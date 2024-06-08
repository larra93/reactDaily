import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import UserTable from '../Users/UserTable';


const UserContainer = () => {
    // Datos estáticos para ejemplo
    const [users, setUsers] = useState([
        { id: 1, name: 'Juan perez', roles: 'Aprobador, Admin contrato' },
        { id: 2, name: 'Felipe', roles: 'Aprobador, Admin contrato' },
        { id: 3, name: 'Diego', roles: 'Aprobado' },
        
    ]);

   

    return (
        <div>
        <h2>Administrar Usuarios</h2>
        <Box display="flex" justifyContent="flex-end" mb={2}> 
        <Button type="submit" variant="contained" color="primary" component={Link} to="/contracts/create">Crear usuario</Button>
        </Box>
        <UserTable usuarios={users} />
    </div>
    );
};

export default UserContainer;
