const {User} = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const requestedUserId = req.params.userId || req.user.id; 
    const user = await User.findById(requestedUserId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isOwner = req.user.id === user._id.toString();

    if (!isOwner && !user.isPublic) {
      return res.status(403).json({ message: 'Profile is private' });
    }

    res.json({
      username: user.username,
      email: isOwner ? user.email : undefined, 
      links: user.links || [],
      name: user.name,
      bio: user.bio,
      isPublic: user.isPublic ?? true,
      avatarUrl: `/api/users/profile/avatar/${user._id}`,
      _id: user._id,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, links, isPublic } = req.body; 
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, links, isPublic }, 
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

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

const getAvatar = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    
    if (!user || !user.avatar?.data) {
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

    user.avatar = undefined;
    await user.save();

    res.status(200).json({ message: 'Avatar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllPublicProfiles = async (req, res) => {
  try {
    const users = await User.find({ isPublic: true })
      .select('username name bio links avatarUrl'); 
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
