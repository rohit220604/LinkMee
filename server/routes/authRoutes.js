const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

console.log('Auth routes loaded');  // <== add this line

router.post('/register', (req, res, next) => {
  console.log('Register route hit');  // <== add this line
  registerUser(req, res, next);
});

router.post('/login', loginUser);

module.exports = router;
