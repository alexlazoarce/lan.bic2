// server/controllers/contract.controller.js
const Contract = require('../database/models/Contract');

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @desc    Crear un nuevo contrato
 * @route   POST /api/v1/contracts
 * @access  Private
 */
exports.createContract = asyncHandler(async (req, res, next) => {
  // Asignar el tenant y el usuario creador desde el objeto req.user
  req.body.tenant = req.user.tenant;
  req.body.createdBy = req.user.id;

  const contract = await Contract.create(req.body);
  res.status(201).json({ success: true, data: contract });
});

/**
 * @desc    Obtener todos los contratos del tenant
 * @route   GET /api/v1/contracts
 * @access  Private
 */
exports.getContracts = asyncHandler(async (req, res, next) => {
  const contracts = await Contract.find({ tenant: req.user.tenant }).populate('createdBy', 'name email');
  res.status(200).json({ success: true, count: contracts.length, data: contracts });
});

/**
 * @desc    Obtener un solo contrato por ID
 * @route   GET /api/v1/contracts/:id
 * @access  Private
 */
exports.getContract = asyncHandler(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id).populate('createdBy', 'name email');

  if (!contract || contract.tenant.toString() !== req.user.tenant.toString()) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  res.status(200).json({ success: true, data: contract });
});

/**
 * @desc    Actualizar un contrato
 * @route   PUT /api/v1/contracts/:id
 * @access  Private
 */
exports.updateContract = asyncHandler(async (req, res, next) => {
  let contract = await Contract.findById(req.params.id);

  if (!contract || contract.tenant.toString() !== req.user.tenant.toString()) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  // Evitar que se cambie el tenant o el creador del contrato
  delete req.body.tenant;
  delete req.body.createdBy;

  contract = await Contract.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: contract });
});

/**
 * @desc    Eliminar un contrato
 * @route   DELETE /api/v1/contracts/:id
 * @access  Private
 */
exports.deleteContract = asyncHandler(async (req, res, next) => {
  const contract = await Contract.findById(req.params.id);

  if (!contract || contract.tenant.toString() !== req.user.tenant.toString()) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }

  await contract.remove();

  res.status(200).json({ success: true, data: {} });
});
