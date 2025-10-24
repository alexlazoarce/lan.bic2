const express = require('express');
const router = express.Router();
const { createModule, getModules } = require('../controllers/modules');
const { protect } = require('../middleware/auth');

// @desc    Create a new module
// @route   POST /api/v1/modules
// @access  Private (Super Admin)
router.post('/', protect, createModule); // NOTE: Faltaría la autorización por rol

// @desc    Get all available modules
// @route   GET /api/v1/modules
// @access  Private
router.get('/', protect, getModules);

module.exports = router;
