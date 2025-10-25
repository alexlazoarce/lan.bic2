const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please provide a client name'],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date'],
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  services: {
    type: String,
    trim: true,
  },
  tenant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Contract', contractSchema);
