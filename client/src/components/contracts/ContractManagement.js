// client/src/components/contracts/ContractManagement.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import ContractTable from './ContractTable';
import ContractModal from './ContractModal';

const Container = styled.div`
  padding: 2rem;
  color: #c5c6c7;
`;

const Title = styled.h1`
  color: #66fcf1;
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background-color: #45a29e;
  color: #0b0c10;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background-color: #66fcf1;
  }
`;

const ErrorMessage = styled.p`
    color: #ff6b6b;
`;

const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [error, setError] = useState('');

  const getApiConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  });

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/v1/contracts', getApiConfig());
      setContracts(data.data);
    } catch (err) {
      setError('Failed to fetch contracts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleOpenModal = (contract = null) => {
    setEditingContract(contract);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingContract(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
        setError('');
        if (editingContract) {
            await axios.put(`/api/v1/contracts/${editingContract._id}`, formData, getApiConfig());
        } else {
            await axios.post('/api/v1/contracts', formData, getApiConfig());
        }
        fetchContracts(); // Recargar la lista de contratos
        handleCloseModal();
    } catch (err) {
        setError(err.response?.data?.message || 'An error occurred.');
        console.error(err);
    }
  };

  return (
    <Container>
      <Title>Contract Management</Title>
      <Button onClick={() => handleOpenModal()}>Add New Contract</Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <p>Loading contracts...</p>
      ) : (
        <ContractTable contracts={contracts} onEdit={handleOpenModal} />
      )}

      <ContractModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        contract={editingContract}
      />
    </Container>
  );
};

export default ContractManagement;
