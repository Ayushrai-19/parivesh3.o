const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const pool = require('../config/db');
const validateRequest = require('../middlewares/validateRequest');
const { ROLES } = require('../utils/constants');
const { sendResponse, asyncHandler } = require('../utils/response');
const { sendEmail, buildEmailTemplate } = require('../services/emailService');
const { buildChainedHashes } = require('../services/hashChainService');
const { verifyAdminFace } = require('../services/faceAuthService');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_insecure_secret_change_me';
const ADMIN_PREAUTH_SECRET = process.env.ADMIN_PREAUTH_SECRET || JWT_SECRET;

const router = express.Router();

const createTokenPayload = (user) => ({
  id: user.id,
  name: user.name,
  loginId: user.login_id,
  email: user.email,
  role: user.role,
});

const issueToken = (user) => jwt.sign(createTokenPayload(user), JWT_SECRET, { expiresIn: '8h' });
const issueAdminPreAuthToken = (user) =>
  jwt.sign(
    {
      type: 'ADMIN_PREAUTH',
      id: user.id,
      loginId: user.login_id,
    },
    ADMIN_PREAUTH_SECRET,
    { expiresIn: '5m' }
  );

const verifyAdminPreAuthToken = (token) => jwt.verify(token, ADMIN_PREAUTH_SECRET);

const recordLogin = async (user, method, identifier) => {
  const hashPayload = {
    user_id: user.id,
    role: user.role,
    login_method: method,
    identifier_used: identifier || null,
  };

  const { previousHash, currentHash } = await buildChainedHashes({
    db: pool,
    tableName: 'login_activity',
    payload: hashPayload,
  });

  await pool.query(
    `INSERT INTO login_activity (user_id, role, login_method, identifier_used, previous_hash, current_hash)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [user.id, user.role, method, identifier || null, previousHash, currentHash]
  );
};

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('loginId').trim().notEmpty().withMessage('ID is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, loginId, email, password } = req.body;

    const exists = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR login_id = $2',
      [email, loginId]
    );
    if (exists.rowCount) {
      return sendResponse(res, 409, false, null, 'Email or ID already registered');
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = await pool.query(
      `INSERT INTO users (name, login_id, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, login_id, email, role`,
      [name, loginId, email, hashed, ROLES.PROPONENT]
    );

    const createdUser = created.rows[0];

    await sendEmail({
      to: createdUser.email,
      subject: 'PARIVESH Registration Successful',
      text:
        `Hello ${createdUser.name},\n\n` +
        'Your proponent account has been created successfully.\n\n' +
        `Registered Name: ${createdUser.name}\n` +
        `Login ID: ${createdUser.login_id}\n` +
        `Email: ${createdUser.email}\n\n` +
        'Keep your password secure.\n\n- PARIVESH 3.0',
      html: buildEmailTemplate({
        title: 'Proponent Registration Successful',
        recipientName: createdUser.name,
        intro: 'Your proponent account has been created successfully. You can now log in and submit applications.',
        details: [
          { label: 'Registered Name', value: createdUser.name },
          { label: 'Login ID', value: createdUser.login_id },
          { label: 'Email', value: createdUser.email },
        ],
        note: 'For security, your password is stored securely in encrypted form and is not sent by email.',
      }),
    });

    return sendResponse(res, 201, true, null, 'Proponent account created successfully');
  })
);

router.post(
  '/login',
  [
    body('role').isIn([ROLES.ADMIN, ROLES.PROPONENT, ROLES.SCRUTINY, ROLES.MOM]),
    body('password').notEmpty(),
    body('email').optional().isEmail(),
    body('loginId').optional().trim().notEmpty(),
    body('faceImage').optional().isString(),
    body('faceImages').optional().isArray(),
    body().custom((value) => {
      const role = value?.role;
      const hasEmail = typeof value?.email === 'string' && value.email.trim() !== '';
      const hasLoginId = typeof value?.loginId === 'string' && value.loginId.trim() !== '';
      const hasFaceImage = typeof value?.faceImage === 'string' && value.faceImage.trim() !== '';
      const hasFaceImagesArray =
        Array.isArray(value?.faceImages) && value.faceImages.some((item) => typeof item === 'string' && item.trim() !== '');

      if (role === ROLES.PROPONENT && !hasEmail && !hasLoginId) {
        throw new Error('Proponent login requires ID or email');
      }

      if ([ROLES.ADMIN, ROLES.SCRUTINY, ROLES.MOM].includes(role) && !hasLoginId) {
        throw new Error('ID is required for selected role');
      }

      if (role === ROLES.ADMIN && !hasFaceImage && !hasFaceImagesArray) {
        throw new Error('Face scan is required for admin login');
      }

      return true;
    }),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { role, email, loginId, password, faceImage, faceImages } = req.body;

    let userRes;
    let identifierUsed;

    if (role === ROLES.PROPONENT && email) {
      identifierUsed = email;
      userRes = await pool.query(
        'SELECT id, name, login_id, email, password, role FROM users WHERE LOWER(email) = LOWER($1) AND role = $2',
        [email, role]
      );
    } else {
      identifierUsed = loginId;
      userRes = await pool.query(
        'SELECT id, name, login_id, email, password, role FROM users WHERE login_id = $1 AND role = $2',
        [loginId, role]
      );
    }

    if (!userRes.rowCount) {
      return sendResponse(res, 401, false, null, 'Invalid credentials');
    }

    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return sendResponse(res, 401, false, null, 'Invalid credentials');
    }

    if (role === ROLES.ADMIN) {
      const faceResult = await verifyAdminFace({
        adminId: user.login_id,
        faceImageDataUrl: faceImage,
        faceImageDataUrls: faceImages,
      });

      if (!faceResult.ok) {
        return sendResponse(res, 401, false, null, 'login failed');
      }
    }

    const token = issueToken(user);
    await recordLogin(user, role === ROLES.ADMIN ? 'FACE+PASSWORD' : 'STANDARD', identifierUsed);

    return sendResponse(
      res,
      200,
      true,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          loginId: user.login_id,
          email: user.email,
          role: user.role,
        },
      },
      'Login successful'
    );
  })
);

router.post('/logout', (req, res) => {
  return sendResponse(res, 200, true, null, 'Logout successful');
});

router.post(
  '/admin/precheck',
  [body('loginId').trim().notEmpty(), body('password').notEmpty()],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { loginId, password } = req.body;

    const userRes = await pool.query(
      'SELECT id, name, login_id, email, password, role FROM users WHERE login_id = $1 AND role = $2',
      [loginId, ROLES.ADMIN]
    );

    if (!userRes.rowCount) {
      return sendResponse(res, 401, false, null, 'Invalid credentials');
    }

    const user = userRes.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return sendResponse(res, 401, false, null, 'Invalid credentials');
    }

    const preAuthToken = issueAdminPreAuthToken(user);

    return sendResponse(
      res,
      200,
      true,
      {
        preAuthToken,
        admin: {
          id: user.id,
          name: user.name,
          loginId: user.login_id,
        },
      },
      'Credentials verified'
    );
  })
);

router.post(
  '/admin/face-login',
  [
    body('preAuthToken').notEmpty(),
    body('faceImage').optional().isString(),
    body('faceImages').optional().isArray(),
    body().custom((value) => {
      const hasFaceImage = typeof value?.faceImage === 'string' && value.faceImage.trim() !== '';
      const hasFaceImagesArray =
        Array.isArray(value?.faceImages) && value.faceImages.some((item) => typeof item === 'string' && item.trim() !== '');

      if (!hasFaceImage && !hasFaceImagesArray) {
        throw new Error('Face scan is required for admin login');
      }

      return true;
    }),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { preAuthToken, faceImage, faceImages } = req.body;

    let preAuth;
    try {
      preAuth = verifyAdminPreAuthToken(preAuthToken);
    } catch (error) {
      return sendResponse(res, 401, false, null, 'Session expired. Verify credentials again.');
    }

    if (preAuth?.type !== 'ADMIN_PREAUTH') {
      return sendResponse(res, 401, false, null, 'Session expired. Verify credentials again.');
    }

    const userRes = await pool.query(
      'SELECT id, name, login_id, email, role FROM users WHERE id = $1 AND login_id = $2 AND role = $3',
      [preAuth.id, preAuth.loginId, ROLES.ADMIN]
    );

    if (!userRes.rowCount) {
      return sendResponse(res, 401, false, null, 'Session expired. Verify credentials again.');
    }

    const user = userRes.rows[0];
    const faceResult = await verifyAdminFace({
      adminId: user.login_id,
      faceImageDataUrl: faceImage,
      faceImageDataUrls: faceImages,
    });

    if (!faceResult.ok) {
      return sendResponse(res, 401, false, null, 'login failed');
    }

    const token = issueToken(user);
    await recordLogin(user, 'FACE+PASSWORD', user.login_id);

    return sendResponse(
      res,
      200,
      true,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          loginId: user.login_id,
          email: user.email,
          role: user.role,
        },
      },
      'Login successful'
    );
  })
);

router.post(
  '/quick-login',
  [
    body('role').isIn([ROLES.ADMIN, ROLES.PROPONENT, ROLES.SCRUTINY, ROLES.MOM]),
    body('email').optional().isEmail(),
    body('loginId').optional().trim().notEmpty(),
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { role, email, loginId } = req.body;

    let userRes;

    if (loginId) {
      userRes = await pool.query(
        'SELECT id, name, login_id, email, role FROM users WHERE login_id = $1 AND role = $2',
        [loginId, role]
      );
    } else if (email) {
      userRes = await pool.query(
        'SELECT id, name, login_id, email, role FROM users WHERE LOWER(email) = LOWER($1) AND role = $2',
        [email, role]
      );
    } else {
      userRes = await pool.query(
        'SELECT id, name, login_id, email, role FROM users WHERE role = $1 ORDER BY id ASC LIMIT 1',
        [role]
      );
    }

    if (!userRes.rowCount) {
      return sendResponse(res, 404, false, null, 'No matching user found for quick login');
    }

    const user = userRes.rows[0];
    const token = issueToken(user);
    await recordLogin(user, 'QUICK', loginId || email || user.login_id);

    return sendResponse(
      res,
      200,
      true,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          loginId: user.login_id,
          email: user.email,
          role: user.role,
        },
      },
      'Quick login successful'
    );
  })
);

module.exports = router;
