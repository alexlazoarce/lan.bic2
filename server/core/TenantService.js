// server/core/TenantService.js
const Tenant = require('../database/models/Tenant');
const Role = require('../database/models/Role');
const Module = require('../database/models/Module');

/**
 * @description Crea un nuevo tenant, sus roles por defecto y le asigna una suscripción de prueba.
 * @param {string} tenantName - El nombre de la nueva empresa/tenant.
 * @returns {Promise<Tenant>} El documento del tenant recién creado.
 */
const createTenant = async (tenantName) => {
  // Crear un ID de tenant único (ej: basado en el nombre de la empresa)
  const tenantId = tenantName.toLowerCase().replace(/\s+/g, '-');

  // Buscar el módulo principal para la prueba gratuita
  const coreModule = await Module.findOne({ moduleId: 'LAN-CORE' });

  // 1. Crear el Tenant con suscripción de prueba
  const tenant = await Tenant.create({
    tenantId,
    name: tenantName,
    subscriptions: coreModule ? [{
      module: coreModule._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
    }] : [],
  });

  // 2. Crear Roles por Defecto para el nuevo Tenant
  const adminRole = await Role.create({
      name: 'Admin',
      tenant: tenant._id,
      permissions: ['manage_users', 'manage_roles', 'manage_contracts'], // Permisos iniciales
      isDefault: true
  });

  await Role.create({
      name: 'User',
      tenant: tenant._id,
      permissions: [],
      isDefault: true
  });

  // Devolver el tenant y el rol de admin para que el controlador pueda crear el usuario
  return { tenant, adminRole };
};

module.exports = {
  createTenant,
};
