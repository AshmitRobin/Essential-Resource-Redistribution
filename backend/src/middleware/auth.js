const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Checks the Bearer token and attaches the logged-in user to req.user
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Please log in to continue' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please log in again' });
  }

  const user = await User.findById(payload.id);
  if (!user) return res.status(401).json({ message: 'This account no longer exists' });
  req.user = user;
  next();
});

// Role-based access: authorize('Admin') or authorize('Donor', 'Admin')
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to do this' });
  }
  next();
};

module.exports = { protect, authorize };
