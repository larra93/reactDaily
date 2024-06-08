import React, { useState } from 'react';
import ContractTable from '../Contract/ContractTable';
import { Box, Button } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';


const ContractContainer = () => {
    // Datos estáticos para ejemplo
    const [contracts, setContracts] = useState([
        { id: 1, name: 'Contrato A', nsap: '12345', den: 'DEN-001', project: 'Proyecto X', api: 'API-001', contractorCompany: 'Empresa A', contractorCompanyRut: '12345678-9', codelcoManager: 'Encargado A', secondaryReviewer: 'Revisor A', contractorManager: 'Encargado B', cc: 'CC-001', contractAdmin: 'Admin A' },
        { id: 2, name: 'Contrato B', nsap: '67890', den: 'DEN-002', project: 'Proyecto Y', api: 'API-002', contractorCompany: 'Empresa B', contractorCompanyRut: '98765432-1', codelcoManager: 'Encargado C', secondaryReviewer: 'Revisor B', contractorManager: 'Encargado D', cc: 'CC-002', contractAdmin: 'Admin B' },
        { id: 3, name: 'Contrato C', nsap: '11223', den: 'DEN-003', project: 'Proyecto Z', api: 'API-003', contractorCompany: 'Empresa C', contractorCompanyRut: '11122233-4', codelcoManager: 'Encargado E', secondaryReviewer: 'Revisor C', contractorManager: 'Encargado F', cc: 'CC-003', contractAdmin: 'Admin C' },
    ]);

   

    return (
        <div>
        <h2>Administrar Contratos</h2>
        <Box display="flex" justifyContent="flex-end" mb={2}> 
        <Button type="submit" variant="contained" color="primary" component={Link} to="/contracts/create">Crear Contrato</Button>
        </Box>
        <ContractTable contracts={contracts} />
    </div>
    );
};

export default ContractContainer;
