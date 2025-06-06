const {User} = require('../models/User');

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

const deleteLink = async (req, res) => {
  try {
    const userId = req.user.id; 
    const linkId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const initialLength = user.links.length;
    user.links = user.links.filter(link => link._id.toString() !== linkId);

    if (user.links.length === initialLength) {
      return res.status(404).json({ message: 'Link not found' });
    }

    await user.save();
    res.status(200).json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { addLink, getLinks ,deleteLink};
