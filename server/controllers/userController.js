const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: user.username,
      email: user.email,
      links: user.links || [],
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, avatarUrl },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

module.exports = { getProfile, updateProfile };
