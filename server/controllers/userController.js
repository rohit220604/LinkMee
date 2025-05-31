const User = require('../models/User');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const requestedUserId = req.params.userId || req.user.id; // If no param, get own profile
    const user = await User.findById(requestedUserId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if requester is the owner
    const isOwner = req.user.id === user._id.toString();

    // If not owner and profile is private, block access
    if (!isOwner && !user.isPublic) {
      return res.status(403).json({ message: 'Profile is private' });
    }

    res.json({
      username: user.username,
      email: isOwner ? user.email : undefined, // email only visible to owner
      links: user.links || [],
      name: user.name,
      bio: user.bio,
      isPublic: user.isPublic ?? true,
      avatarUrl: `/api/users/profile/avatar`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (name, bio, links, etc.)
const updateProfile = async (req, res) => {
  try {
    const { name, bio, links } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, links },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    await user.save();
    res.status(200).json({ message: 'Avatar uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get avatar image
const getAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.avatar || !user.avatar.data) {
      return res.status(404).json({ message: 'Avatar not found' });
    }

    res.set('Content-Type', user.avatar.contentType);
    res.send(user.avatar.data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatar = undefined; // Remove avatar
    await user.save();

    res.status(200).json({ message: 'Avatar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all public profiles with basic info and links
const getAllPublicProfiles = async (req, res) => {
  try {
    const users = await User.find({ isPublic: true }).select('username name bio links');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  getAvatar,
  deleteAvatar,
  getAllPublicProfiles
};
