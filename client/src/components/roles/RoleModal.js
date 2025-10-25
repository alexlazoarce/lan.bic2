// client/src/components/roles/RoleModal.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div\`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
\`;

const ModalContent = styled.div\`
  background-color: #1f2833; padding: 2rem; border-radius: 8px;
  width: 90%; max-width: 500px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
\`;

const ModalTitle = styled.h2\`color: #66fcf1; margin-bottom: 1.5rem;\`;
const FormGroup = styled.div\`margin-bottom: 1.5rem;\`;
const Label = styled.label\`display: block; color: #c5c6c7; margin-bottom: 0.5rem;\`;
const Input = styled.input\`
  width: 100%; padding: 0.8rem; background-color: #0b0c10;
  border: 1px solid #45a29e; color: #c5c6c7; border-radius: 4px;
\`;
const Small = styled.small\`color: #c5c6c7; opacity: 0.7; margin-top: 0.5rem; display: block;\`;

const ButtonGroup = styled.div\`display: flex; justify-content: flex-end; margin-top: 2rem;\`;
const Button = styled.button\`
  background-color: \${({ primary }) => (primary ? '#45a29e' : 'transparent')};
  color: \${({ primary }) => (primary ? '#0b0c10' : '#c5c6c7')};
  border: 1px solid #45a29e; padding: 0.8rem 1.5rem; cursor: pointer;
  border-radius: 5px; margin-left: 1rem;
  &:hover { background-color: #66fcf1; color: #0b0c10; border-color: #66fcf1; }
\`;

const RoleModal = ({ isOpen, onClose, onSubmit, role }) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState('');

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissions(role.permissions.join(', '));
    } else {
      setName('');
      setPermissions('');
    }
  }, [role]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const permissionsArray = permissions.split(',').map(p => p.trim()).filter(p => p);
    onSubmit({ name, permissions: permissionsArray });
  };

  return (
    <ModalBackdrop>
      <ModalContent>
        <ModalTitle>{role ? 'Edit Role' : 'Add New Role'}</ModalTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Role Name</Label>
            <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="permissions">Permissions</Label>
            <Input
              type="text"
              id="permissions"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
            />
            <Small>Enter permissions separated by commas (e.g., manage_users, view_reports).</Small>
          </FormGroup>
          <ButtonGroup>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button primary type="submit">{role ? 'Save Changes' : 'Create Role'}</Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default RoleModal;
