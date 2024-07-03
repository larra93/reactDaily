import React, { useEffect, useState } from 'react';
import ContractTable from '../Contract/ContractTable';
import { Box, Button } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';


const ContractContainer = () => {
    // Datos estáticos para ejemplo
    const [contracts, setContracts] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchContracts(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);

    
    const fetchContracts = async (page, rowsPerPage) => {
        try {
            const response = await axios.get(`${BASE_URL}/contracts?page=${page}&per_page=${rowsPerPage}`);
            console.log('contratos', response.data)
            setContracts(response.data.data);
            setTotalCount(response.data.total);
            console.log('resp', response.data)
        } catch (error) {
            console.error('Error al obtener los contratos:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

   

    return (
        <div>
        <h2>Administrar Contratos</h2>
        <Box display="flex" justifyContent="flex-end" mb={2}> 
        <Button type="submit" variant="contained" color="primary" component={Link} to="/contracts/create">Crear Contrato</Button>
        </Box>
        <ContractTable 
        contracts={contracts}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </div>
    );
};

export default ContractContainer;
