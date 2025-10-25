// client/src/components/contracts/ContractModal.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #1f2833;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
`;

const ModalTitle = styled.h2`
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
  background-color: #0b0c10;
  border: 1px solid #45a29e;
  color: #c5c6c7;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background-color: #0b0c10;
  border: 1px solid #45a29e;
  color: #c5c6c7;
  border-radius: 4px;
  min-height: 100px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: ${({ primary }) => (primary ? '#45a29e' : 'transparent')};
  color: ${({ primary }) => (primary ? '#0b0c10' : '#c5c6c7')};
  border: 1px solid #45a29e;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 1rem;
  &:hover { background-color: #66fcf1; color: #0b0c10; border-color: #66fcf1; }
`;

const ContractModal = ({ isOpen, onClose, onSubmit, contract }) => {
  const [formData, setFormData] = useState({ clientName: '', startDate: '', endDate: '', status: 'active', services: '' });

  useEffect(() => {
    if (contract) {
      // Formatear las fechas para los inputs de tipo 'date'
      const formatDate = (date) => new Date(date).toISOString().split('T')[0];
      setFormData({
        clientName: contract.clientName,
        startDate: formatDate(contract.startDate),
        endDate: formatDate(contract.endDate),
        status: contract.status,
        services: contract.services || '',
      });
    } else {
      setFormData({ clientName: '', startDate: '', endDate: '', status: 'active', services: '' });
    }
  }, [contract]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <ModalBackdrop>
      <ModalContent>
        <ModalTitle>{contract ? 'Edit Contract' : 'Add New Contract'}</ModalTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Client Name</Label>
            <Input type="text" name="clientName" value={formData.clientName} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Start Date</Label>
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>End Date</Label>
            <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <Input as="select" name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Services / Details</Label>
            <TextArea name="services" value={formData.services} onChange={handleChange} />
          </FormGroup>
          <ButtonGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button primary type="submit">{contract ? 'Save Changes' : 'Create Contract'}</Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default ContractModal;
