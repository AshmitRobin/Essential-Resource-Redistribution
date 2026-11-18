const EMAIL = /^\S+@\S+\.\S+$/;
const MOBILE = /^(?:\+[1-9]\d{7,14}|[0-9]{10,15})$/;

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

function checkName(name, errors) {
  if (name.length < 2 || name.length > 100) errors.name = 'Name must be 2 to 100 characters';
}
function checkMobile(mobile, errors) {
  if (mobile && !MOBILE.test(mobile)) errors.mobile = 'Use international format, e.g. +919876543210';
}
function checkPassword(password, errors, field = 'password') {
  if (typeof password !== 'string' || password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors[field] = 'Use at least 8 characters with a letter and a number';
  }
}

function validateRegister(body = {}) {
  const errors = {};
  const data = { name: clean(body.name), email: clean(body.email).toLowerCase(), mobile: clean(body.mobile), role: body.role };
  checkName(data.name, errors);
  if (!EMAIL.test(data.email)) errors.email = 'Enter a valid email address';
  checkMobile(data.mobile, errors);
  if (!['Donor', 'Beneficiary'].includes(data.role)) errors.role = 'Choose Donor or Beneficiary';
  checkPassword(body.password, errors);
  return { errors, data: { ...data, password: body.password } };
}

function validateProfile(body = {}) {
  const errors = {};
  const data = { name: clean(body.name), mobile: clean(body.mobile) };
  checkName(data.name, errors);
  checkMobile(data.mobile, errors);
  return { errors, data };
}

function validatePasswordChange(body = {}) {
  const errors = {};
  if (!body.currentPassword) errors.currentPassword = 'Enter your current password';
  checkPassword(body.newPassword, errors, 'newPassword');
  return { errors };
}

module.exports = { validateRegister, validateProfile, validatePasswordChange };
