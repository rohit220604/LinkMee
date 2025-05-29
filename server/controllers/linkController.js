const User = require('../models/User');

const addLink = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    const { name, url } = req.body;
    if (!name || !url) return res.status(400).json({ message: 'Name and URL are required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.links.push({ name, url });
    await user.save();

    res.status(201).json({ message: 'Link added', links: user.links });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLinks = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'User not authenticated' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.links);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addLink, getLinks };
