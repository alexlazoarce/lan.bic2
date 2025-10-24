const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');

// @desc    Register a new tenant and user
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register', register);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', login);

module.exports = router;
