const pool = require('../config/db');
const { sendEmail, buildEmailTemplate } = require('./emailService');

const createNotification = async (userId, message, options = {}, client = null) => {
  const db = client || pool;
  await db.query(
    `INSERT INTO notifications (user_id, message)
     VALUES ($1, $2)`,
    [userId, message]
  );

  const userRes = await db.query('SELECT email, name FROM users WHERE id = $1', [userId]);
  if (!userRes.rowCount) return;

  const user = userRes.rows[0];
  const subject = options.subject || 'PARIVESH Notification';
  const title = options.title || 'Workflow Update';
  const details = Array.isArray(options.details) ? options.details : [];
  const note = options.note || '';

  const textDetails = details.map((item) => `${item.label}: ${item.value}`).join('\n');

  await sendEmail({
    to: user.email,
    subject,
    text:
      `Hello ${user.name},\n\n` +
      `${message}\n\n` +
      (textDetails ? `${textDetails}\n\n` : '') +
      (note ? `${note}\n\n` : '') +
      '- PARIVESH 3.0',
    html: buildEmailTemplate({
      title,
      recipientName: user.name,
      intro: message,
      details,
      note,
    }),
  });
};

module.exports = {
  createNotification,
};
