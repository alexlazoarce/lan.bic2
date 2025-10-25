import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import UserTable from './UserTable';
import UserModal from './UserModal';
const Container = styled.div\`padding: 2rem; color: #c5c6c7;\`;
const Title = styled.h1\`color: #66fcf1; font-size: 2rem; margin-bottom: 2rem;\`;
const Button = styled.button\`background-color: #45a29e; color: #0b0c10; border: none; padding: 0.8rem 1.5rem; font-size: 1rem; font-weight: bold; cursor: pointer; border-radius: 5px; margin-bottom: 2rem; &:hover { background-color: #66fcf1; }\`;
const ErrorMessage = styled.p\`color: #ff6b6b;\`;
const UserManagement = () => {
  const [users, setUsers] = useState([]); const [roles, setRoles] = useState([]); const [loading, setLoading] = useState(true); const [isModalOpen, setIsModalOpen] = useState(false); const [editingUser, setEditingUser] = useState(null); const [error, setError] = useState('');
  const getApiConfig = () => ({ headers: { Authorization: \`Bearer \${localStorage.getItem('authToken')}\` } });
  const fetchData = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const [usersRes, rolesRes] = await Promise.all([ axios.get('/api/v1/users', getApiConfig()), axios.get('/api/v1/roles', getApiConfig()) ]);
      setUsers(usersRes.data.data); setRoles(rolesRes.data.data);
    } catch (err) { setError('Failed to fetch data.'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchData(); }, [fetchData]);
  const handleOpenModal = (user = null) => { setEditingUser(user); setIsModalOpen(true); };
  const handleCloseModal = () => { setEditingUser(null); setIsModalOpen(false); };
  const handleSubmit = async (formData) => {
    try { setError(''); if (editingUser) { await axios.put(\`/api/v1/users/\${editingUser._id}\`, formData, getApiConfig()); } else { await axios.post('/api/v1/users', formData, getApiConfig()); } fetchData(); handleCloseModal(); } catch (err) { setError(err.response?.data?.message || 'An error occurred.'); }
  };
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure?')) {
      try { setError(''); await axios.delete(\`/api/v1/users/\${userId}\`, getApiConfig()); fetchData(); } catch (err) { setError(err.response?.data?.message || 'Failed to delete user.'); }
    }
  };
  return ( <Container> <Title>User Management</Title> <Button onClick={() => handleOpenModal()}>Add New User</Button> {error && <ErrorMessage>{error}</ErrorMessage>} {loading ? <p>Loading data...</p> : <UserTable users={users} onEdit={handleOpenModal} onDelete={handleDelete} />} <UserModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} user={editingUser} roles={roles} /> </Container> );
};
export default UserManagement;
