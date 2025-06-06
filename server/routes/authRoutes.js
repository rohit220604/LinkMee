const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log('Auth routes loaded'); 

router.post('/register', (req, res, next) => {
  console.log('Register route hit'); 
  authController.registerUser(req, res, next);
});

router.post('/verify-signup-otp', authController.verifySignupOtp);

router.post('/login', authController.loginUser);

router.post('/send-reset-otp', authController.sendPasswordResetOtp);

router.post('/reset-password', authController.resetPassword);

module.exports = router;
