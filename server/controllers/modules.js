const Module = require('../models/Module');

// @desc    Create a new module
// @route   POST /api/v1/modules
// @access  Private (Super Admin)
exports.createModule = async (req, res, next) => {
  try {
    const newModule = await Module.create(req.body);
    res.status(201).json({
      success: true,
      data: newModule,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get all available modules
// @route   GET /api/v1/modules
// @access  Private
exports.getModules = async (req, res, next) => {
  try {
    const modules = await Module.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
