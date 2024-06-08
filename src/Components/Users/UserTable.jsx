import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const UserTable = ({ usuarios }) => {
    return (
        <TableContainer component={Paper}>
           <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Roles</TableCell>
                        {/* <TableCell>Acciones</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {usuarios.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.roles}</TableCell>
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

export default UserTable;
