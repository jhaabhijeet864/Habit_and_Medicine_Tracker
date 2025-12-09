const express = require('express');
const router = express.Router();
const { signupUser, loginUser, getMe, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Private
router.get('/me', protect, getMe);

module.exports = router;

