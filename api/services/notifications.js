// Notification service stubs for future expansion
// Environment variables expected:
// WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY (for VAPID)
// SENDGRID_API_KEY (email), TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (sms)

const webpush = require('web-push');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

function initProviders() {
  if (process.env.WEB_PUSH_PUBLIC_KEY && process.env.WEB_PUSH_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:admin@example.com',
      process.env.WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );
  }
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

initProviders();

async function sendWebPush(subscription, payload) {
  if (!process.env.WEB_PUSH_PUBLIC_KEY) return { skipped: true };
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function sendEmail(to, subject, text) {
  if (!process.env.SENDGRID_API_KEY) return { skipped: true };
  try {
    await sgMail.send({ to, from: process.env.SENDGRID_FROM || 'no-reply@example.com', subject, text });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function buildTwilioClient() {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return null;
}

async function sendSMS(to, body) {
  const client = buildTwilioClient();
  if (!client) return { skipped: true };
  try {
    await client.messages.create({ to, from: process.env.TWILIO_FROM, body });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

module.exports = { sendWebPush, sendEmail, sendSMS };
