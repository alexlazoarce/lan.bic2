const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a role name'],
    trim: true,
  },
  permissions: {
    type: [String],
    // Ejemplo: ['create_invoice', 'edit_user', 'view_reports']
    default: [],
  },
  tenant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false, // Para roles predeterminados que no se pueden eliminar
  }
}, {
  timestamps: true,
  // Asegurar que el nombre del rol sea único dentro de un mismo tenant
  unique: [['name', 'tenant']]
});

module.exports = mongoose.model('Role', roleSchema);
