import React from 'react';
import styled from 'styled-components';

const TableWrapper = styled.div`
  margin-top: 2rem;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #1f2833;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: #45a29e;
  color: #0b0c10;
  font-weight: bold;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #0b0c10;
  color: #c5c6c7;
`;

const ActionButton = styled.button`
  background: transparent;
  color: ${props => props.actionType === 'edit' ? '#66fcf1' : '#ff6b6b'};
  border: 1px solid ${props => props.actionType === 'edit' ? '#66fcf1' : '#ff6b6b'};
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 0.5rem;

  &:hover {
    background: ${props => props.actionType === 'edit' ? '#66fcf1' : '#ff6b6b'};
    color: #0b0c10;
  }
`;

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>
                <ActionButton actionType="edit" onClick={() => onEdit(user)}>
                  Edit
                </ActionButton>
                <ActionButton actionType="delete" onClick={() => onDelete(user._id)}>
                  Delete
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default UserTable;
