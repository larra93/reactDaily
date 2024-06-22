import React, { useEffect, useState } from 'react';
import UserForm from '../Components/Users/UserForm';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const UserFormPage = () => {
    const navigate = useNavigate(); 
    const { id } = useParams(); 

    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => { 
       
        
        fetchRoles();
        fetchUser();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/roles`);
            setRoles(response.data);
        } catch (error) {
            toast.error('Error intente más tarde');
        }
    };


    const fetchUser = async () => {
        if (id) {
            try {
                const response = await axios.get(`${BASE_URL}/users/${id}`);
                setUser(response.data);
            } catch (error) {
                toast.error('Error intente más tarde');
            }
        }
    };

    const handleCreateUser = async (userData) => {
        try {
            if (id) {
                await axios.put(`${BASE_URL}/users/${id}`, userData);
                toast.success('Usuario actualizado exitosamente');
            } else {
                
                await axios.post(`${BASE_URL}/users`, userData);
                toast.success('Usuario creado exitosamente');
            }
            navigate('/users');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key].join(', '));
                });
            } else {
                toast.error('Error al crear/actualizar el usuario');
            }
        }
    };

    return (
        <div>
            <h2>{id ? 'Editar usuario' : 'Crear usuario'}</h2>
            {id && !user ? <p>Cargando...</p> : <UserForm onSubmit={handleCreateUser} roles={roles} user={user} />}
        </div>
    );
};

export default UserFormPage;
