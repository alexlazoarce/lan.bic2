#!/bin/bash
# ==============================================================================
# Script de Reconstrucción Atómica para el Módulo de Gestión de Roles
# ==============================================================================

set -e

echo "--- Iniciando la reconstrucción del Módulo de Gestión de Roles ---"

# --- 1. Creación de la Interfaz de Usuario para Roles ---

echo "[FE] Creando directorio para componentes de roles..."
mkdir -p client/src/components/roles

echo "[FE] Creando RoleManagement.js..."
cat << 'EOF' > client/src/components/roles/RoleManagement.js
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
EOF

echo "[FE] Creando RoleTable.js..."
cat << 'EOF' > client/src/components/roles/RoleTable.js
import React from 'react';
import styled from 'styled-components';
const TableWrapper = styled.div\`margin-top: 2rem; overflow-x: auto;\`;
const StyledTable = styled.table\`width: 100%; border-collapse: collapse; background-color: #1f2833;\`;
const Th = styled.th\`padding: 1rem; text-align: left; background-color: #45a29e; color: #0b0c10; font-weight: bold;\`;
const Td = styled.td\`padding: 1rem; border-bottom: 1px solid #0b0c10; color: #c5c6c7;\`;
const PermissionTag = styled.span\`background-color: #0c7075; color: #c5c6c7; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.8rem; margin-right: 0.5rem; white-space: nowrap;\`;
const ActionButton = styled.button\`background: transparent; color: #66fcf1; border: 1px solid #66fcf1; padding: 0.5rem 1rem; cursor: pointer; border-radius: 5px; &:hover { background: #66fcf1; color: #0b0c10; }\`;
const RoleTable = ({ roles, onEdit }) => (
  <TableWrapper><StyledTable>
    <thead><tr><Th>Role Name</Th><Th>Permissions</Th><Th>Actions</Th></tr></thead>
    <tbody>{roles.map(role => (
      <tr key={role._id}><Td>{role.name}</Td><Td>{role.permissions.length > 0 ? role.permissions.map(p => <PermissionTag key={p}>{p}</PermissionTag>) : 'No permissions'}</Td><Td><ActionButton onClick={() => onEdit(role)}>Edit</ActionButton></Td></tr>
    ))}</tbody>
  </StyledTable></TableWrapper>
);
export default RoleTable;
EOF

echo "[FE] Creando RoleModal.js..."
cat << 'EOF' > client/src/components/roles/RoleModal.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
const Backdrop = styled.div\`position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000;\`;
const Content = styled.div\`background: #1f2833; padding: 2rem; border-radius: 8px; width: 90%; max-width: 500px;\`;
const Title = styled.h2\`color: #66fcf1; margin-bottom: 1.5rem;\`;
const FormGroup = styled.div\`margin-bottom: 1.5rem;\`;
const Label = styled.label\`display: block; color: #c5c6c7; margin-bottom: 0.5rem;\`;
const Input = styled.input\`width: 100%; padding: 0.8rem; background: #0b0c10; border: 1px solid #45a29e; color: #c5c6c7; border-radius: 4px;\`;
const Small = styled.small\`color: #c5c6c7; opacity: 0.7; margin-top: 0.5rem; display: block;\`;
const BtnGroup = styled.div\`display: flex; justify-content: flex-end; margin-top: 2rem;\`;
const Button = styled.button\`background: \${p => p.primary ? '#45a29e' : 'transparent'}; color: \${p => p.primary ? '#0b0c10' : '#c5c6c7'}; border: 1px solid #45a29e; padding: 0.8rem 1.5rem; cursor: pointer; border-radius: 5px; margin-left: 1rem; &:hover { background: #66fcf1; color: #0b0c10; border-color: #66fcf1; }\`;
const RoleModal = ({ isOpen, onClose, onSubmit, role }) => {
  const [name, setName] = useState(''); const [permissions, setPermissions] = useState('');
  useEffect(() => {
    if (role) { setName(role.name); setPermissions(role.permissions.join(', ')); }
    else { setName(''); setPermissions(''); }
  }, [role]);
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    const permissionsArray = permissions.split(',').map(p => p.trim()).filter(p => p);
    onSubmit({ name, permissions: permissionsArray });
  };
  return (
    <Backdrop><Content>
      <Title>{role ? 'Edit Role' : 'Add New Role'}</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup><Label>Role Name</Label><Input type="text" value={name} onChange={e => setName(e.target.value)} required /></FormGroup>
        <FormGroup><Label>Permissions</Label><Input type="text" value={permissions} onChange={e => setPermissions(e.target.value)} /><Small>Comma-separated (e.g., manage_users, view_reports).</Small></FormGroup>
        <BtnGroup><Button type="button" onClick={onClose}>Cancel</Button><Button primary type="submit">{role ? 'Save' : 'Create'}</Button></BtnGroup>
      </form>
    </Content></Backdrop>
  );
};
export default RoleModal;
EOF

# --- 2. Integración en la Aplicación Principal ---

echo "[FE] Integrando ruta en App.js..."
sed -i.bak "/import ContractManagement from '.\/components\/contracts\/ContractManagement';/a import RoleManagement from './components/roles/RoleManagement';" client/src/App.js
sed -i.bak "/path=\"\\/contracts\"/a \\        <Route path=\"/roles\" element={<PrivateRoute><MainLayout><RoleManagement /></MainLayout></PrivateRoute>} />" client/src/App.js

echo "[FE] Integrando enlace de navegación en MainLayout.js..."
sed -i.bak "/<Link to=\"\\/users\">User Management<\\/Link><\\/li>/a \\            <li><Link to=\"/roles\">Role Management</Link></li>" client/src/components/MainLayout.js

# --- 3. Actualización del Módulo de Usuarios ---

echo "[FE] Actualizando UserManagement.js para obtener roles..."
cat << 'EOF' > client/src/components/users/UserManagement.js
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
EOF

echo "[FE] Actualizando UserModal.js para usar el desplegable de roles..."
cat << 'EOF' > client/src/components/users/UserModal.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
const Backdrop = styled.div\`position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000;\`;
const Content = styled.div\`background: #1f2833; padding: 2rem; border-radius: 8px; width: 90%; max-width: 500px;\`;
const Title = styled.h2\`color: #66fcf1; margin-bottom: 1.5rem;\`;
const FormGroup = styled.div\`margin-bottom: 1rem;\`;
const Label = styled.label\`display: block; color: #c5c6c7; margin-bottom: 0.5rem;\`;
const Input = styled.input\`width: 100%; padding: 0.8rem; background: #0b0c10; border: 1px solid #45a29e; color: #c5c6c7; border-radius: 4px;\`;
const Select = styled.select\`width: 100%; padding: 0.8rem; background: #0b0c10; border: 1px solid #45a29e; color: #c5c6c7; border-radius: 4px;\`;
const BtnGroup = styled.div\`display: flex; justify-content: flex-end; margin-top: 2rem;\`;
const Button = styled.button\`background: \${p => p.primary ? '#45a29e' : 'transparent'}; color: \${p => p.primary ? '#0b0c10' : '#c5c6c7'}; border: 1px solid #45a29e; padding: 0.8rem 1.5rem; font-weight: bold; cursor: pointer; border-radius: 5px; margin-left: 1rem; &:hover { background: #66fcf1; color: #0b0c10; border-color: #66fcf1; }\`;
const UserModal = ({ isOpen, onClose, onSubmit, user, roles = [] }) => {
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  useEffect(() => {
    if (user) { setForm({ name: user.name, email: user.email, role: user.role?._id || '' }); }
    else { setForm({ name: '', email: '', password: '', role: roles.length > 0 ? roles[0]._id : '' }); }
  }, [user, roles]);
  if (!isOpen) return null;
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); onSubmit(form); };
  return (
    <Backdrop><Content>
      <Title>{user ? 'Edit User' : 'Add New User'}</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup><Label>Name</Label><Input name="name" value={form.name} onChange={handleChange} required /></FormGroup>
        <FormGroup><Label>Email</Label><Input type="email" name="email" value={form.email} onChange={handleChange} required /></FormGroup>
        {!user && <FormGroup><Label>Password</Label><Input type="password" name="password" onChange={handleChange} required /></FormGroup>}
        <FormGroup>
          <Label>Role</Label>
          <Select name="role" value={form.role} onChange={handleChange}>
            {roles.map(role => ( <option key={role._id} value={role._id}>{role.name}</option> ))}
          </Select>
        </FormGroup>
        <BtnGroup><Button onClick={onClose}>Cancel</Button><Button primary type="submit">{user ? 'Save' : 'Create'}</Button></BtnGroup>
      </form>
    </Content></Backdrop>
  );
};
export default UserModal;
EOF

echo "[FE] Actualizando UserTable.js para mostrar el nombre del rol..."
sed -i.bak "s|<Td>{user.role}</Td>|<Td>{user.role ? user.role.name : 'No Role Assigned'}</Td>|" client/src/components/users/UserTable.js

# Limpiar archivos .bak
find . -name "*.bak" -type f -delete

echo "--- Reconstrucción completada. ---"
