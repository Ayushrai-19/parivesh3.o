const nodemailer = require('nodemailer');

let transporter = null;

const isEmailEnabled = () => String(process.env.EMAIL_ENABLED || '').toLowerCase() === 'true';

const getProviderDefaults = () => {
  const provider = String(process.env.EMAIL_PROVIDER || 'custom').toLowerCase();

  if (provider === 'gmail') {
    return {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
    };
  }

  if (provider === 'outlook') {
    return {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      requireTLS: true,
    };
  }

  return {
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    requireTLS: true,
  };
};

const getTransporter = () => {
  if (transporter) return transporter;

  const defaults = getProviderDefaults();
  const host = process.env.SMTP_HOST || defaults.host;
  const tlsServerName = process.env.SMTP_TLS_SERVERNAME || host;

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || defaults.port),
    secure: String(process.env.SMTP_SECURE || String(defaults.secure)).toLowerCase() === 'true',
    requireTLS: String(process.env.SMTP_REQUIRE_TLS || String(defaults.requireTLS)).toLowerCase() === 'true',
    tls: {
      servername: tlsServerName,
    },
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });

  return transporter;
};

const getFromAddress = () => process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@parivesh.local';

const buildEmailTemplate = ({
  title,
  recipientName,
  intro,
  details = [],
  note = '',
}) => {
  const detailsHtml = details
    .map((item) => `<tr><td style="padding:8px 0;color:#475569;">${item.label}</td><td style="padding:8px 0;color:#0f172a;font-weight:600;">${item.value}</td></tr>`)
    .join('');

  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;background:#f1f5f9;padding:24px;">
      <table role="presentation" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;">
        <tr>
          <td style="padding-bottom:12px;">
            <p style="margin:0;color:#1e3a8a;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">PARIVESH 3.0</p>
            <h2 style="margin:8px 0 0;color:#0f172a;font-size:22px;">${title}</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0 4px;color:#334155;font-size:15px;">Hello ${recipientName},</td>
        </tr>
        <tr>
          <td style="padding:4px 0 14px;color:#475569;font-size:14px;line-height:1.6;">${intro}</td>
        </tr>
        ${details.length ? `<tr><td><table role="presentation" style="width:100%;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;margin:8px 0 10px;">${detailsHtml}</table></td></tr>` : ''}
        ${note ? `<tr><td style="padding-top:8px;color:#475569;font-size:13px;line-height:1.6;">${note}</td></tr>` : ''}
        <tr>
          <td style="padding-top:16px;color:#64748b;font-size:12px;">This is an automated email from PARIVESH 3.0.</td>
        </tr>
      </table>
    </div>
  `;
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) return { sent: false, skipped: true, reason: 'missing-recipient' };

  if (!isEmailEnabled()) {
    return { sent: false, skipped: true, reason: 'email-disabled' };
  }

  try {
    const tx = getTransporter();
    await tx.sendMail({
      from: getFromAddress(),
      to,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (error) {
    const fallbackHost = process.env.SMTP_FALLBACK_HOST;
    const canRetryWithFallback =
      fallbackHost && String(error.message || '').toLowerCase().includes('querya etimeout');

    if (canRetryWithFallback) {
      try {
        const fallbackTx = nodemailer.createTransport({
          host: fallbackHost,
          port: Number(process.env.SMTP_PORT || 587),
          secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
          requireTLS: String(process.env.SMTP_REQUIRE_TLS || 'true').toLowerCase() === 'true',
          tls: {
            servername: process.env.SMTP_TLS_SERVERNAME || process.env.SMTP_HOST || 'smtp.gmail.com',
          },
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
              ? {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                }
              : undefined,
        });

        await fallbackTx.sendMail({
          from: getFromAddress(),
          to,
          subject,
          text,
          html,
        });

        return { sent: true, viaFallback: true };
      } catch (fallbackError) {
        // eslint-disable-next-line no-console
        console.error('Email send failed (fallback):', fallbackError.message);
        return {
          sent: false,
          skipped: false,
          reason: 'send-failed',
          error: fallbackError.message,
        };
      }
    }

    // eslint-disable-next-line no-console
    console.error('Email send failed:', error.message);
    return { sent: false, skipped: false, reason: 'send-failed', error: error.message };
  }
};

module.exports = {
  sendEmail,
  isEmailEnabled,
  buildEmailTemplate,
};
