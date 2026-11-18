const nodemailer = require('nodemailer');

let transporter;
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Email service is not configured. Set EMAIL_USER and EMAIL_APP_PASSWORD.');
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
    });
  }
  return transporter;
}

async function sendOtpEmail(to, code, purpose) {
  const action = purpose === 'registration' ? 'verify your email address' : 'reset your password';
  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `Essential Resource Redistribution – verification code`,
    text: `Your verification code to ${action} is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;background:#fff8f0;border-radius:16px;color:#35152f"><h2>Essential Resource Redistribution</h2><p>Your code to ${action}:</p><div style="font-size:32px;letter-spacing:8px;font-weight:bold;padding:18px;background:#f6e0b6;border-radius:12px;text-align:center">${code}</div><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`,
  });
}
module.exports = { sendOtpEmail };
