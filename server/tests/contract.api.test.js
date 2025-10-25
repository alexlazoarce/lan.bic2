// server/tests/contract.api.test.js
const axios = require('axios');

// =============================================================================
// IMPORTANTE: Este script es para verificación manual.
// Antes de ejecutar, necesitas obtener un token de autenticación válido.
// =============================================================================

const BASE_URL = 'http://localhost:5000/api/v1';

// Pega aquí un token JWT válido
const AUTH_TOKEN = 'TU_TOKEN_AQUI';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
  }
});

const testContract = {
  clientName: 'Cliente de Prueba Corp.',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
  status: 'active',
  services: 'Servicios de consultoría'
};

let createdContractId;

const runTests = async () => {
  try {
    console.log('--- Running Contract API Tests ---');

    // 1. Crear un nuevo contrato (POST /contracts)
    console.log('\nTesting POST /contracts...');
    const createRes = await api.post('/contracts', testContract);
    if (createRes.status === 201 && createRes.data.success) {
      createdContractId = createRes.data.data._id;
      console.log(`✅ PASSED: Contract created with ID: ${createdContractId}`);
    } else {
      throw new Error('Failed to create contract.');
    }

    // 2. Obtener todos los contratos (GET /contracts)
    console.log('\nTesting GET /contracts...');
    const getRes = await api.get('/contracts');
    if (getRes.status === 200 && getRes.data.success && getRes.data.count > 0) {
      console.log(`✅ PASSED: Retrieved ${getRes.data.count} contracts.`);
    } else {
      throw new Error('Failed to get contracts.');
    }

    // 3. Obtener el contrato recién creado (GET /contracts/:id)
    console.log(`\nTesting GET /contracts/${createdContractId}...`);
    const getByIdRes = await api.get(`/contracts/${createdContractId}`);
    if (getByIdRes.status === 200 && getByIdRes.data.success) {
        console.log(`✅ PASSED: Retrieved contract by ID.`);
    } else {
        throw new Error('Failed to get contract by ID.');
    }

    // 4. Actualizar el contrato (PUT /contracts/:id)
    console.log(`\nTesting PUT /contracts/${createdContractId}...`);
    const updatedStatus = 'cancelled';
    const updateRes = await api.put(`/contracts/${createdContractId}`, { status: updatedStatus });
    if (updateRes.status === 200 && updateRes.data.success && updateRes.data.data.status === updatedStatus) {
        console.log(`✅ PASSED: Contract updated successfully.`);
    } else {
        throw new Error('Failed to update contract.');
    }

    // 5. Eliminar el contrato (DELETE /contracts/:id)
    console.log(`\nTesting DELETE /contracts/${createdContractId}...`);
    const deleteRes = await api.delete(`/contracts/${createdContractId}`);
    if (deleteRes.status === 200 && deleteRes.data.success) {
        console.log(`✅ PASSED: Contract deleted successfully.`);
    } else {
        throw new Error('Failed to delete contract.');
    }

    console.log('\n--- All Contract API Tests Passed! ---');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.response ? error.response.data : error.message);
  }
};

if (AUTH_TOKEN !== 'TU_TOKEN_AQUI') {
    runTests();
} else {
    console.warn('Please replace "TU_TOKEN_AQUI" with a valid JWT to run the tests.');
}
