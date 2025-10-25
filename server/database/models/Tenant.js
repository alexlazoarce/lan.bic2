const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    unique: true,
    // Ejemplo: 'empresa_x'
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  customDomain: {
    type: String,
    unique: true,
    sparse: true, // Permite valores nulos sin violar la unicidad
  },
  logoUrl: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subscriptions: [
    {
      module: {
        type: mongoose.Schema.ObjectId,
        ref: 'Module',
      },
      expiresAt: {
        type: Date,
      },
    },
  ],
  // Otros campos relevantes para la empresa
}, {
  timestamps: true,
});

module.exports = mongoose.model('Tenant', tenantSchema);
