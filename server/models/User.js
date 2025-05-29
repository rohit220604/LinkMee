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
  bio: { type: String },           // User bio
  avatarUrl: { type: String },     // Profile picture URL
  links: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    }
  ]
}, {
  timestamps: true,
});

// Password hash middleware etc. (unchanged)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
