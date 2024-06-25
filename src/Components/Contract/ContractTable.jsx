import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const ContractTable = ({ contracts }) => {
    return (
        <TableContainer component={Paper}>
           <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre contrato</TableCell>
                        <TableCell>N SAP</TableCell>
                        <TableCell>DEN</TableCell>
                        <TableCell>Proyecto</TableCell>
                        <TableCell>API</TableCell>
                        <TableCell>Empresa contratista</TableCell>
                        <TableCell>Rut Empresa contratista</TableCell>
                        <TableCell>Encargados Codelco(Daily)</TableCell>
                        <TableCell>Revisor Secundario Codelco</TableCell>
                        <TableCell>Encargado Contratista(Daily)</TableCell>
                        <TableCell>CC</TableCell>
                        <TableCell>Admin de contrato</TableCell>
                        {/* <TableCell>Acciones</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contracts.map((contract) => (
                        <TableRow key={contract.id}>
                            <TableCell>{contract.id}</TableCell>
                            <TableCell>{contract.name}</TableCell>
                            <TableCell>{contract.nsap}</TableCell>
                            <TableCell>{contract.den}</TableCell>
                            <TableCell>{contract.project}</TableCell>
                            <TableCell>{contract.api}</TableCell>
                            <TableCell>{contract.contractorCompany}</TableCell>
                            <TableCell>{contract.contractorCompanyRut}</TableCell>
                            <TableCell>{contract.codelcoManager}</TableCell>
                            <TableCell>{contract.secondaryReviewer}</TableCell>
                            <TableCell>{contract.contractorManager}</TableCell>
                            <TableCell>{contract.cc}</TableCell>
                            <TableCell>{contract.contractAdmin}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary">Editar</Button>
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ContractTable;
