const nodemailer = require('nodemailer');

// Lazy-create transporter based on env; fallback to console logger
function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('[notify] Email skipped (SMTP not configured)', { to, subject, text });
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html
  });
}

async function sendReminderNotification({ user, reminder }) {
  if (reminder.channel === 'email' && user?.email) {
    const subject = `Reminder: ${reminder.title}`;
    const text = `Hi ${user.name || ''},\n\n${reminder.title}\nTime: ${reminder.time}\nNotes: ${reminder.notes || '—'}`;
    await sendEmail({ to: user.email, subject, text });
  } else {
    console.log('[notify] In-app reminder', {
      user: user?._id,
      reminder: reminder._id,
      title: reminder.title,
      time: reminder.time
    });
  }
}

module.exports = { sendReminderNotification };

