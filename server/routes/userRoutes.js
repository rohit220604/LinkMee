const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, uploadAvatar, getAvatar, deleteAvatar,getAllPublicProfiles } = require('../controllers/userController');
const User = require('../models/User');

const multer = require('multer'); 
const upload = multer({ storage: multer.memoryStorage() });
  
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/profile/avatar', protect, getAvatar);
router.delete('/profile/avatar', protect, deleteAvatar);
router.get('/public-profiles', getAllPublicProfiles);

module.exports = router;
