// client/src/components/contracts/ContractTable.js
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

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #0b0c10;
  background-color: ${({ status }) => {
    if (status === 'active') return '#66fcf1';
    if (status === 'expired') return '#ff6b6b';
    return '#c5c6c7';
  }};
`;

const ActionButton = styled.button`
  background-color: transparent;
  color: #66fcf1;
  border: 1px solid #66fcf1;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 0.5rem;
  &:hover { background-color: #66fcf1; color: #0b0c10; }
`;

const ContractTable = ({ contracts, onEdit, onDelete }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <Th>Client Name</Th>
            <Th>Status</Th>
            <Th>End Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract._id}>
              <Td>{contract.clientName}</Td>
              <Td><StatusBadge status={contract.status}>{contract.status}</StatusBadge></Td>
              <Td>{formatDate(contract.endDate)}</Td>
              <Td>
                <ActionButton onClick={() => onEdit(contract)}>Edit</ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default ContractTable;
