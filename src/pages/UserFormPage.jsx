import React, { useEffect, useState } from 'react';
import UserForm from '../Components/Users/UserForm';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserFormPage = () => {
    const navigate = useNavigate(); 

    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]); 

    useEffect(() => { 
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/roles`);
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                toast.error('Error fetching roles');
            }
        };

        fetchRoles();
    }, []);

    const handleCreateUser = async (userData) => {
        try {
            userData.roles = selectedRoles.map(roleId => ({ id: roleId }));
            const response = await axios.post(`${BASE_URL}/users`, userData);
            toast.success('Usuario creado exitosamente');
            navigate('/users');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key].join(', '));
                });
            } else {
                toast.error('Error al crear el usuario');
            }
        }
    };

    return (
        <div>
            <h2>Crear usuario</h2>
            <UserForm onSubmit={handleCreateUser} roles={roles} />
        </div>
    );
};

export default UserFormPage;
