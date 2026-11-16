const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { validateProfile, validatePasswordChange } = require('../utils/validate');

const bad = (res, errors) => res.status(400).json({ message: 'Please check the highlighted fields', errors });
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---- Any logged-in user: own account ----
exports.updateMe = asyncHandler(async (req, res) => {
  const { errors, data } = validateProfile(req.body);
  if (Object.keys(errors).length) return bad(res, errors);
  req.user.name = data.name;
  req.user.mobile = data.mobile || undefined;
  await req.user.save();
  res.json({ user: req.user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { errors } = validatePasswordChange(req.body);
  if (Object.keys(errors).length) return bad(res, errors);

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return bad(res, { currentPassword: 'Current password is incorrect' });
  }
  user.password = req.body.newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});

// ---- Admin only (FR10): oversee user accounts ----
exports.listUsers = asyncHandler(async (req, res) => {
  const filter = {};
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ name: rx }, { email: rx }];
  }
  if (['Donor', 'Beneficiary', 'Admin'].includes(req.query.role)) filter.role = req.query.role;
  const users = await User.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json({ users });
});

exports.userStats = asyncHandler(async (req, res) => {
  const rows = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
  const stats = { Donor: 0, Beneficiary: 0, Admin: 0 };
  rows.forEach((r) => (stats[r._id] = r.count));
  res.json({ stats, total: stats.Donor + stats.Beneficiary + stats.Admin });
});

exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { errors, data } = validateProfile(req.body);
  if (!['Donor', 'Beneficiary', 'Admin'].includes(req.body.role)) errors.role = 'Choose a valid role';
  if (req.body.role !== user.role && user._id.equals(req.user._id)) errors.role = 'You cannot change your own role';
  if (Object.keys(errors).length) return bad(res, errors);

  user.name = data.name;
  user.mobile = data.mobile || undefined;
  user.role = req.body.role;
  await user.save();
  res.json({ user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user._id.equals(req.user._id)) return res.status(400).json({ message: 'You cannot delete your own account' });
  if (user.role === 'Admin') return res.status(400).json({ message: 'Admin accounts cannot be deleted here' });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});
