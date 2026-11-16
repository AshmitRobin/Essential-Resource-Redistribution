const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { validateRegister } = require('../utils/validate');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// FR01 - register (Donor or Beneficiary only; Admin accounts are created by seeding)
exports.register = asyncHandler(async (req, res) => {
  const { errors, data } = validateRegister(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Please check the highlighted fields', errors });

  if (await User.exists({ email: data.email })) {
    return res.status(409).json({ message: 'An account with this email already exists', errors: { email: 'Email already registered' } });
  }
  if (!data.mobile) delete data.mobile;
  const user = await User.create(data);
  res.status(201).json({ token: signToken(user), user });
});

// FR01 - login
exports.login = asyncHandler(async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = req.body.password;
  if (!email || !password) return res.status(400).json({ message: 'Enter your email and password' });

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  res.json({ token: signToken(user), user });
});

exports.me = (req, res) => res.json({ user: req.user });
