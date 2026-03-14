const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const DEFAULT_SCRIPT_PATH = path.resolve(
  __dirname,
  '../../../Face module/face_recognition/examples/admin_auth_portal.py'
);
const DEFAULT_DB_PATH = path.resolve(
  __dirname,
  '../../../Face module/face_recognition/examples/admin_auth/admin_auth.db'
);
const DEFAULT_VENV_PYTHON = path.resolve(
  __dirname,
  '../../../Face module/face_recognition/.venv311/Scripts/python.exe'
);

const MIN_CONFIDENCE = Number(process.env.ADMIN_FACE_MIN_CONFIDENCE || 0.8);

const parseDataUrlImage = (dataUrl) => {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/') || !dataUrl.includes(',')) {
    return null;
  }

  const [meta, base64Payload] = dataUrl.split(',', 2);
  if (!meta || !base64Payload || !meta.includes(';base64')) {
    return null;
  }

  try {
    const buffer = Buffer.from(base64Payload, 'base64');
    if (!buffer.length) {
      return null;
    }
    return buffer;
  } catch (error) {
    return null;
  }
};

const resolvePythonCommand = () => {
  if (process.env.FACE_AUTH_PYTHON) {
    return process.env.FACE_AUTH_PYTHON;
  }

  if (fs.existsSync(DEFAULT_VENV_PYTHON)) {
    return DEFAULT_VENV_PYTHON;
  }

  return 'python';
};

const runFaceVerification = ({ adminId, imagePath, scriptPath, dbPath }) =>
  new Promise((resolve, reject) => {
    const pythonCommand = resolvePythonCommand();
    const args = [
      scriptPath,
      '--db',
      dbPath,
      'verify-face',
      '--admin-id',
      adminId,
      '--image',
      imagePath,
      '--tolerance',
      '1.0',
    ];

    const child = spawn(pythonCommand, args, {
      cwd: path.dirname(scriptPath),
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });

const parseFaceResult = ({ code, stdout, stderr }) => {
  const text = (stdout || '').trim();

  if (!text) {
    return {
      ok: false,
      error: 'face_service_no_output',
      details: stderr || 'Face verification service returned no output',
      code,
    };
  }

  try {
    const payload = JSON.parse(text);
    return { payload, code, stderr };
  } catch (error) {
    return {
      ok: false,
      error: 'face_service_invalid_output',
      details: stderr || text,
      code,
    };
  }
};

const verifySingleAdminFace = async ({ adminId, scriptPath, dbPath, imageBuffer }) => {
  if (!fs.existsSync(scriptPath)) {
    return { ok: false, reason: 'face_script_not_found' };
  }

  if (!fs.existsSync(dbPath)) {
    return { ok: false, reason: 'face_db_not_found' };
  }

  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'admin-face-'));
  const tempImagePath = path.join(tempDir, `${Date.now()}-capture.jpg`);

  try {
    await fs.promises.writeFile(tempImagePath, imageBuffer);

    const commandResult = await runFaceVerification({
      adminId,
      imagePath: tempImagePath,
      scriptPath,
      dbPath,
    });

    const parsed = parseFaceResult(commandResult);

    if (!parsed.payload) {
      return { ok: false, reason: parsed.error || 'face_service_error' };
    }

    if (!parsed.payload.ok || typeof parsed.payload.min_distance !== 'number') {
      return { ok: false, reason: parsed.payload.error || 'face_verification_failed' };
    }

    const minDistance = Number(parsed.payload.min_distance);
    const confidence = Math.max(0, (1 - minDistance) * 100);
    const passedThreshold = confidence > MIN_CONFIDENCE * 100;

    return {
      ok: passedThreshold,
      confidence: Number(confidence.toFixed(2)),
      minDistance: Number(minDistance.toFixed(6)),
      threshold: Number((MIN_CONFIDENCE * 100).toFixed(2)),
      reason: passedThreshold ? null : 'face_threshold_not_met',
    };
  } catch (error) {
    return {
      ok: false,
      reason: 'face_verification_exception',
      details: error.message,
    };
  } finally {
    await fs.promises.rm(tempImagePath, { force: true }).catch(() => {});
    await fs.promises.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
};

const verifyAdminFace = async ({ adminId, faceImageDataUrl, faceImageDataUrls = [] }) => {
  const scriptPath = path.resolve(process.env.FACE_AUTH_SCRIPT_PATH || DEFAULT_SCRIPT_PATH);
  const dbPath = path.resolve(process.env.FACE_AUTH_DB_PATH || DEFAULT_DB_PATH);

  const candidates = [];
  if (typeof faceImageDataUrl === 'string' && faceImageDataUrl.trim()) {
    candidates.push(faceImageDataUrl);
  }
  if (Array.isArray(faceImageDataUrls)) {
    for (const frame of faceImageDataUrls) {
      if (typeof frame === 'string' && frame.trim()) {
        candidates.push(frame);
      }
    }
  }

  if (!candidates.length) {
    return { ok: false, reason: 'invalid_face_image' };
  }

  let bestResult = null;
  for (const candidate of candidates) {
    const imageBuffer = parseDataUrlImage(candidate);
    if (!imageBuffer) {
      continue;
    }

    const result = await verifySingleAdminFace({
      adminId,
      scriptPath,
      dbPath,
      imageBuffer,
    });

    if (result.ok) {
      return result;
    }

    if (!bestResult || (result.confidence || 0) > (bestResult.confidence || 0)) {
      bestResult = result;
    }
  }

  return bestResult || { ok: false, reason: 'invalid_face_image' };
};

module.exports = {
  verifyAdminFace,
};
