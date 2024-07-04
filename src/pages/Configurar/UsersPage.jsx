import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import UserTable from '../../Components/Containers/Configurar/Users/UserTable';
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchUsers(page + 1, rowsPerPage);
    }, [page, rowsPerPage]);

    const fetchUsers = async (page, rowsPerPage) => {
        try {
            const response = await axios.get(`${BASE_URL}/users?page=${page}&per_page=${rowsPerPage}`);
            setUsers(response.data.data);
            setTotalCount(response.data.total);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
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
            <h2>Administrar Usuarios</h2>
            <Box display="flex" justifyContent="flex-end" mb={2}> 
                <Button type="submit" variant="contained" color="primary" component={Link} to="/users/create">Crear usuario</Button>
            </Box>
            <UserTable
                usuarios={users}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default UserPage;
