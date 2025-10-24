const User = require('../database/models/User');
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const tenantId = req.user.tenant;
  if (role === 'super_admin') return res.status(403).json({ success: false, message: 'Not authorized' });
  const existingUser = await User.findOne({ email, tenant: tenantId });
  if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });
  const user = await User.create({ name, email, password, role: role || 'user', tenant: tenantId });
  res.status(201).json({ success: true, data: user });
});
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({ tenant: req.user.tenant });
  res.status(200).json({ success: true, count: users.length, data: users });
});
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user || user.tenant.toString() !== req.user.tenant.toString()) return res.status(404).json({ success: false, message: 'User not found' });
  res.status(200).json({ success: true, data: user });
});
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user || user.tenant.toString() !== req.user.tenant.toString()) return res.status(404).json({ success: false, message: 'User not found' });
  if (req.body.role === 'super_admin') return res.status(403).json({ success: false, message: 'Not authorized' });
  delete req.body.tenant;
  user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
});
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user || user.tenant.toString() !== req.user.tenant.toString()) return res.status(404).json({ success: false, message: 'User not found' });
  if (user._id.toString() === req.user.id.toString()) return res.status(400).json({ success: false, message: 'Cannot delete self' });
  await user.remove();
  res.status(200).json({ success: true, data: {} });
});
