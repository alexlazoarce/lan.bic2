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
