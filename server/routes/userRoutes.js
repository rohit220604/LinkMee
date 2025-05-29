const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');
const User = require('../models/User');

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      links: user.links || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/profile', protect, updateProfile);

module.exports = router;
