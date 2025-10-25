// server/controllers/role.controller.js
const Role = require('../database/models/Role');
const User = require('../database/models/User');

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @desc    Crear un nuevo rol
 * @route   POST /api/v1/roles
 * @access  Private (Admin)
 */
exports.createRole = asyncHandler(async (req, res, next) => {
  const { name, permissions } = req.body;
  const tenantId = req.user.tenant;

  // Asegurarse de que el rol pertenezca al tenant del admin
  req.body.tenant = tenantId;

  // Verificar si ya existe un rol con el mismo nombre en este tenant
  const existingRole = await Role.findOne({ name, tenant: tenantId });
  if (existingRole) {
    return res.status(400).json({ success: false, message: `Role '${name}' already exists` });
  }

  const role = await Role.create(req.body);
  res.status(201).json({ success: true, data: role });
});

/**
 * @desc    Obtener todos los roles del tenant
 * @route   GET /api/v1/roles
 * @access  Private (Admin)
 */
exports.getRoles = asyncHandler(async (req, res, next) => {
  const roles = await Role.find({ tenant: req.user.tenant });
  res.status(200).json({ success: true, count: roles.length, data: roles });
});

/**
 * @desc    Obtener un solo rol por ID
 * @route   GET /api/v1/roles/:id
 * @access  Private (Admin)
 */
exports.getRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role || role.tenant.toString() !== req.user.tenant.toString()) {
    return res.status(404).json({ success: false, message: 'Role not found' });
  }

  res.status(200).json({ success: true, data: role });
});

/**
 * @desc    Actualizar un rol
 * @route   PUT /api/v1/roles/:id
 * @access  Private (Admin)
 */
exports.updateRole = asyncHandler(async (req, res, next) => {
  let role = await Role.findById(req.params.id);

  if (!role || role.tenant.toString() !== req.user.tenant.toString()) {
    return res.status(404).json({ success: false, message: 'Role not found' });
  }

  // Evitar que los roles por defecto sean modificados
  if (role.isDefault) {
      return res.status(400).json({ success: false, message: 'Cannot update a default role' });
  }

  // Evitar que se cambie el tenant del rol
  delete req.body.tenant;

  role = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: role });
});

/**
 * @desc    Eliminar un rol
 * @route   DELETE /api/v1/roles/:id
 * @access  Private (Admin)
 */
exports.deleteRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role || role.tenant.toString() !== req.user.tenant.toString()) {
    return res.status(404).json({ success: false, message: 'Role not found' });
  }

  // Evitar que los roles por defecto sean eliminados
  if (role.isDefault) {
      return res.status(400).json({ success: false, message: 'Cannot delete a default role' });
  }

  // Opcional: Verificar si algún usuario tiene este rol asignado antes de eliminar
  const userWithRole = await User.findOne({ role: role._id, tenant: req.user.tenant });
  if (userWithRole) {
      return res.status(400).json({ success: false, message: 'Cannot delete role, it is currently assigned to one or more users.' });
  }

  await role.remove();

  res.status(200).json({ success: true, data: {} });
});
