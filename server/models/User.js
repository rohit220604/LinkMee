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
  isPublic: { type: Boolean, default: true }, // Profile visibility flag
}, {
  timestamps: true,
});

// Password hash middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
