// server/routes/contract.routes.js
const express = require('express');
const router = express.Router();
const {
  createContract,
  getContracts,
  getContract,
  updateContract,
  deleteContract
} = require('../controllers/contract.controller');
const { protect } = require('../middleware/auth');

// Proteger todas las rutas, cualquier usuario autenticado del tenant puede acceder.
router.use(protect);

router.route('/')
  .post(createContract)
  .get(getContracts);

router.route('/:id')
  .get(getContract)
  .put(updateContract)
  .delete(deleteContract);

module.exports = router;
