
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const EmailOtp = require('../models/EmailOtp');
const asyncHandler = require('../utils/asyncHandler');
const { validateRegister } = require('../utils/validate');
const { sendOtpEmail } = require('../services/email');
const { encrypt, decrypt } = require('../services/crypto');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const makeCode = () => String(crypto.randomInt(100000, 1000000));

const hashCode = (code) =>
  crypto
    .createHash('sha256')
    .update(`${code}:${process.env.JWT_SECRET}`)
    .digest('hex');

// Registration: send an OTP to the user's email.
exports.startRegistration = asyncHandler(async (req, res) => {
  const { errors, data } = validateRegister(req.body);

  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: 'Please check the highlighted fields',
      errors,
    });
  }

  if (await User.exists({ email: data.email })) {
    return res.status(409).json({
      message: 'An account with this email already exists',
      errors: { email: 'Email already registered' },
    });
  }

  const recent = await EmailOtp.findOne({
    email: data.email,
    purpose: 'registration',
    createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
  });

  if (recent) {
    return res.status(429).json({
      message: 'Please wait one minute before requesting another code.',
    });
  }

  const code = makeCode();

  await EmailOtp.deleteMany({
    email: data.email,
    purpose: 'registration',
  });

  await EmailOtp.create({
    email: data.email,
    purpose: 'registration',
    codeHash: hashCode(code),
    payload: encrypt(data),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  try {
    await sendOtpEmail(data.email, code, 'registration');
  } catch (err) {
    await EmailOtp.deleteMany({
      email: data.email,
      purpose: 'registration',
    });
    throw err;
  }

  res.json({
    message: 'A verification code has been sent to your email address.',
  });
});

// Verify email OTP and create the account.
exports.verifyRegistration = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const code = String(req.body.code || '').trim();

  const record = await EmailOtp.findOne({
    email,
    purpose: 'registration',
  }).sort({ createdAt: -1 });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({
      message: 'Code expired. Please register again to receive a new code.',
    });
  }

  if (record.attempts >= 5) {
    return res.status(429).json({
      message: 'Too many incorrect attempts. Please request a new code.',
    });
  }

  if (record.codeHash !== hashCode(code)) {
    record.attempts += 1;
    await record.save();

    return res.status(400).json({
      message: 'Incorrect verification code.',
    });
  }

  const data = decrypt(record.payload);

  if (await User.exists({ email })) {
    return res.status(409).json({
      message: 'An account with this email already exists.',
    });
  }

  const user = await User.create({
    ...data,
    emailVerified: true,
  });

  await EmailOtp.deleteMany({
    email,
    purpose: 'registration',
  });

  res.status(201).json({
    token: signToken(user),
    user,
    message: 'Email verified. Your account is ready.',
  });
});

// Login remains email and password based.
exports.login = asyncHandler(async (req, res) => {
  const email =
    typeof req.body.email === 'string'
      ? req.body.email.trim().toLowerCase()
      : '';

  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Enter your email and password',
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      message: 'Incorrect email or password',
    });
  }

  if (user.emailVerified === false) {
    return res.status(403).json({
      message: 'Please verify your email address before logging in.',
    });
  }

  res.json({
    token: signToken(user),
    user,
  });
});

// Password recovery: email address only.
exports.startPasswordReset = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '')
    .trim()
    .toLowerCase();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      message: 'Enter a valid email address.',
    });
  }

  const user = await User.findOne({
    email,
    emailVerified: { $ne: false },
  });

  // Keep the response generic so account existence is not revealed.
  if (user) {
    const recent = await EmailOtp.findOne({
      email,
      purpose: 'password_reset',
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });

    if (recent) {
      return res.status(429).json({
        message: 'Please wait one minute before requesting another code.',
      });
    }

    const code = makeCode();

    await EmailOtp.deleteMany({
      email,
      purpose: 'password_reset',
    });

    await EmailOtp.create({
      email,
      purpose: 'password_reset',
      codeHash: hashCode(code),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
      await sendOtpEmail(email, code, 'password_reset');
    } catch (err) {
      await EmailOtp.deleteMany({
        email,
        purpose: 'password_reset',
      });
      throw err;
    }
  }

  res.json({
    channel: 'email',
    destination: email,
    message:
      'If an account matches that email address, a verification code has been sent.',
  });
});

// Verify password-reset email OTP.
exports.verifyPasswordReset = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '')
    .trim()
    .toLowerCase();

  const code = String(req.body.code || '').trim();

  const record = await EmailOtp.findOne({
    email,
    purpose: 'password_reset',
  }).sort({ createdAt: -1 });

  if (
    !record ||
    record.expiresAt < new Date() ||
    record.attempts >= 5
  ) {
    return res.status(400).json({
      message: 'Code expired or invalid. Request a new code.',
    });
  }

  if (record.codeHash !== hashCode(code)) {
    record.attempts += 1;
    await record.save();

    return res.status(400).json({
      message: 'Incorrect verification code.',
    });
  }

  const user = await User.findOne({
    email,
    emailVerified: { $ne: false },
  });

  if (!user) {
    return res.status(400).json({
      message: 'Unable to verify this account.',
    });
  }

  await EmailOtp.deleteMany({
    email,
    purpose: 'password_reset',
  });

  const resetToken = jwt.sign(
    { id: user._id, purpose: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

  res.json({
    resetToken,
    message: 'Verification successful. Create your new password.',
  });
});

// Save the new password after successful email verification.
exports.resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (
    typeof newPassword !== 'string' ||
    newPassword.length < 8 ||
    !/[A-Za-z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword)
  ) {
    return res.status(400).json({
      message: 'Use at least 8 characters with a letter and a number.',
    });
  }

  let payload;

  try {
    payload = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      message: 'Password reset session expired. Start again.',
    });
  }

  if (payload.purpose !== 'password_reset') {
    return res.status(401).json({
      message: 'Invalid password reset session.',
    });
  }

  const user = await User.findById(payload.id).select('+password');

  if (!user) {
    return res.status(404).json({
      message: 'Account not found.',
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    message: 'Password updated successfully. You can now log in.',
  });
});

exports.me = (req, res) => res.json({ user: req.user });
