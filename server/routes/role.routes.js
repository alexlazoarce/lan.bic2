// server/routes/role.routes.js
const express = require('express');
const router = express.Router();
const {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole
} = require('../controllers/role.controller');
const { protect, authorize } = require('../middleware/auth');

// Proteger todas las rutas y autorizar solo a los administradores
router.use(protect);
// Por ahora, asumimos que solo los 'super_admin' y 'admin' pueden gestionar roles.
// Esto podría cambiar en el futuro para permitir a ciertos roles gestionar otros roles.
router.use(authorize('super_admin', 'admin'));

router.route('/')
  .post(createRole)
  .get(getRoles);

router.route('/:id')
  .get(getRole)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
