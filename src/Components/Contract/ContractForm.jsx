import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const ContractForm = ({ addContract, onSubmit }) => {
    const [newContract, setNewContract] = useState({
        name: '',
        nsap: '',
        den: '',
        project: '',
        api: '',
        contractorCompany: '',
        contractorCompanyRut: '',
        codelcoManager: '',
        secondaryReviewer: '',
        contractorManager: '',
        cc: '',
        contractAdmin: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewContract({
            ...newContract,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addContract(newContract);
        setNewContract({
            name: '',
            nsap: '',
            den: '',
            project: '',
            api: '',
            contractorCompany: '',
            contractorCompanyRut: '',
            codelcoManager: '',
            secondaryReviewer: '',
            contractorManager: '',
            cc: '',
            contractAdmin: '',
        });
        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', width: '30%' ,margin:'0 auto', flexDirection: 'column', gap: 2 }}>
            <TextField label="Nombre contrato" name="name" value={newContract.name} onChange={handleChange} required />
            <TextField label="N SAP" name="nsap" value={newContract.nsap} onChange={handleChange} required />
            <TextField label="DEN" name="den" value={newContract.den} onChange={handleChange} required />
            <TextField label="Proyecto" name="project" value={newContract.project} onChange={handleChange} required />
            <TextField label="API" name="api" value={newContract.api} onChange={handleChange} required />
            <TextField label="Empresa contratista" name="contractorCompany" value={newContract.contractorCompany} onChange={handleChange} required />
            <TextField label="Rut Empresa contratista" name="contractorCompanyRut" value={newContract.contractorCompanyRut} onChange={handleChange} required />
            <TextField label="Encargados Codelco(Daily)" name="codelcoManager" value={newContract.codelcoManager} onChange={handleChange} required />
            <TextField label="Revisor Secundario Codelco" name="secondaryReviewer" value={newContract.secondaryReviewer} onChange={handleChange} required />
            <TextField label="Encargado Contratista(Daily)" name="contractorManager" value={newContract.contractorManager} onChange={handleChange} required />
            <TextField label="CC" name="cc" value={newContract.cc} onChange={handleChange} required />
            <TextField label="Admin de contrato" name="contractAdmin" value={newContract.contractAdmin} onChange={handleChange} required />
            <Button type="submit" variant="contained" color="primary">Crear Contrato</Button>
        </Box>
    );
};

export default ContractForm;
