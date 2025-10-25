import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import RoleTable from './RoleTable';
import RoleModal from './RoleModal';
const Container = styled.div\`padding: 2rem; color: #c5c6c7;\`;
const Title = styled.h1\`color: #66fcf1; font-size: 2rem; margin-bottom: 2rem;\`;
const Button = styled.button\`background-color: #45a29e; color: #0b0c10; border: none; padding: 0.8rem 1.5rem; font-size: 1rem; font-weight: bold; cursor: pointer; border-radius: 5px; margin-bottom: 2rem; &:hover { background-color: #66fcf1; }\`;
const ErrorMessage = styled.p\`color: #ff6b6b;\`;
const RoleManagement = () => {
  const [roles, setRoles] = useState([]); const [loading, setLoading] = useState(true); const [isModalOpen, setIsModalOpen] = useState(false); const [editingRole, setEditingRole] = useState(null); const [error, setError] = useState('');
  const getApiConfig = () => ({ headers: { Authorization: \`Bearer \${localStorage.getItem('authToken')}\` } });
  const fetchRoles = useCallback(async () => {
    try { setLoading(true); setError(''); const { data } = await axios.get('/api/v1/roles', getApiConfig()); setRoles(data.data); } catch (err) { setError('Failed to fetch roles.'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchRoles(); }, [fetchRoles]);
  const handleOpenModal = (role = null) => { setEditingRole(role); setIsModalOpen(true); };
  const handleCloseModal = () => { setEditingRole(null); setIsModalOpen(false); };
  const handleSubmit = async (formData) => {
    try { setError(''); if (editingRole) { await axios.put(\`/api/v1/roles/\${editingRole._id}\`, formData, getApiConfig()); } else { await axios.post('/api/v1/roles', formData, getApiConfig()); } fetchRoles(); handleCloseModal(); } catch (err) { setError(err.response?.data?.message || 'An error occurred.'); }
  };
  return ( <Container> <Title>Role Management</Title> <Button onClick={() => handleOpenModal()}>Add New Role</Button> {error && <ErrorMessage>{error}</ErrorMessage>} {loading ? <p>Loading roles...</p> : <RoleTable roles={roles} onEdit={handleOpenModal} />} <RoleModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} role={editingRole} /> </Container> );
};
export default RoleManagement;
