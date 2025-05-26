const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');  // Make sure this path is correct

router.get('/profile', protect, async (req, res) => {
  try {
    // Find user by ID, exclude password field
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back user info you want to expose
    res.json({
      username: user.username,
      email: user.email,
      links: user.links || [], // optional if you store links
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
