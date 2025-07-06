const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// console.log('Auth routes loaded'); 
const passport = require('passport');

router.post('/register', (req, res, next) => {
  // console.log('Register route hit'); 
  authController.registerUser(req, res, next);
});

router.post('/verify-signup-otp', authController.verifySignupOtp);

router.post('/login', authController.loginUser);

router.post('/send-reset-otp', authController.sendPasswordResetOtp);

router.post('/reset-password', authController.resetPassword);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' ,session: false}),
  (req, res) => {
    const token = authController.generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
