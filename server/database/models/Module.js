const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  moduleId: {
    type: String,
    required: true,
    unique: true,
    // Ejemplo: 'LAN-GP1'
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  basePrice: {
    type: Number,
    required: true,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Module', moduleSchema);
