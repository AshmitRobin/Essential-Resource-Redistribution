const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = ['Donor', 'Beneficiary', 'Admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    password: { type: String, required: true, select: false }, // bcrypt hash, never returned by default
    mobile: { type: String, trim: true, match: [/^[0-9]{10,15}$/, 'Mobile must be 10 to 15 digits'] },
    role: { type: String, enum: ROLES, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
module.exports.ROLES = ROLES;
