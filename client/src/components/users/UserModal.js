import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Content = styled.div`
  background: #1f2833;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const Title = styled.h2`
  color: #66fcf1;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  color: #c5c6c7;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  background: #0b0c10;
  border: 1px solid #45a29e;
  color: #c5c6c7;
  border-radius: 4px;
`;

const BtnGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: ${props => props.primary ? '#45a29e' : 'transparent'};
  color: ${props => props.primary ? '#0b0c10' : '#c5c6c7'};
  border: 1px solid #45a29e;
  padding: 0.8rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 1rem;

  &:hover {
    background: #66fcf1;
    color: #0b0c10;
    border-color: #66fcf1;
  }
`;

const UserModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, role: user.role });
    } else {
      setForm({ name: '', email: '', password: '', role: 'user' });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Backdrop>
      <Content>
        <Title>{user ? 'Edit User' : 'Add New User'}</Title>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" name="email" value={form.email} onChange={handleChange} required />
          </FormGroup>
          {!user && (
            <FormGroup>
              <Label>Password</Label>
              <Input type="password" name="password" onChange={handleChange} required />
            </FormGroup>
          )}
          <FormGroup>
            <Label>Role</Label>
            <Input as="select" name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Input>
          </FormGroup>
          <BtnGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button primary type="submit">{user ? 'Save' : 'Create'}</Button>
          </BtnGroup>
        </form>
      </Content>
    </Backdrop>
  );
};

export default UserModal;
