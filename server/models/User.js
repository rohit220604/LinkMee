const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const linkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  bio: { type: String },
  avatar: {
    data: Buffer,
    contentType: String,
  },
  links: [linkSchema],
  isPublic: { type: Boolean, default: true }, 
  isVerified: {type: Boolean, default: false }
}, {
  timestamps: true,
});

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  purpose: { 
    type: String, 
    required: true,
    enum: ['signup', 'reset'] // Only allow these purposes
  }
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
const Otp = mongoose.model('Otp', otpSchema);

module.exports = { User, Otp };
