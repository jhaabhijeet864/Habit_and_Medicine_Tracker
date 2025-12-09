const express = require('express');
const router = express.Router();
const { signupUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Public
router.post('/signup', signupUser);
router.post('/login', loginUser);

// Private
router.get('/me', protect, getMe);

module.exports = router;

