const { User, Otp } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id } },  
    process.env.JWT_SECRET,          
    { expiresIn: '1d' }
  );
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create unverified user
    const user = new User({ username, email, password, isVerified: false });
    await user.save();

    // Generate and send OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await Otp.findOneAndUpdate(
      { email, purpose: 'signup' },
      { otp, expiresAt },
      { upsert: true }
    );

    await transporter.sendMail({
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification OTP is: ${otp}`
    });

    res.status(201).json({ message: 'OTP sent to your email' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifySignupOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Verify OTP
    const otpRecord = await Otp.findOne({ 
      email, 
      purpose: 'signup',
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    // Generate token
    const token = generateToken(user);

    // Cleanup OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ 
      message: 'Account verified successfully', 
      token,
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate and send OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await Otp.findOneAndUpdate(
      { email, purpose: 'reset' },
      { otp, expiresAt },
      { upsert: true }
    );

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is: ${otp}`
    });

    res.json({ message: 'OTP sent to your email' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Verify OTP
    const otpRecord = await Otp.findOne({ 
      email, 
      purpose: 'reset',
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password
    const user = await User.findOne({ email });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Cleanup OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  verifySignupOtp,
  sendPasswordResetOtp,
  resetPassword,
  loginUser
};
