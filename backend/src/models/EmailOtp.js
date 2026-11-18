const mongoose = require('mongoose');

const emailOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  purpose: { type: String, enum: ['registration', 'password_reset'], required: true },
  codeHash: { type: String, required: true },
  payload: { type: String }, // AES-256-GCM encrypted registration data, never plaintext
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('EmailOtp', emailOtpSchema);
