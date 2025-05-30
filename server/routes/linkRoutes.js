const express = require('express');
const router = express.Router();
const { addLink, getLinks, deleteLink } = require('../controllers/linkController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addLink);
router.get('/', protect, getLinks);
router.delete('/:id', protect, deleteLink);

module.exports = router;
