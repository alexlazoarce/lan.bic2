const User = require('../database/models/User');
const TenantService = require('../core/TenantService'); // Importar el nuevo servicio
const jwt = require('jsonwebtoken');

// Función para generar el token JWT
const getSignedJwtToken = (id, tenantId) => {
  return jwt.sign({ id, tenantId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new tenant and user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { tenantName, name, email, password } = req.body;

    // 1. Usar el servicio para crear el Tenant y sus roles por defecto
    const { tenant, adminRole } = await TenantService.createTenant(tenantName);

    // 2. Crear el Usuario administrador y asignarle el rol 'Admin'
    const user = await User.create({
      name,
      email,
      password,
      tenant: tenant._id,
      role: adminRole._id, // Asignar el ID del rol 'Admin' devuelto por el servicio
    });

    // 3. Crear y enviar el token
    const token = getSignedJwtToken(user._id, tenant._id);

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = getSignedJwtToken(user._id, user.tenant);

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
