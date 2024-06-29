import React, { useEffect, useState } from 'react';
import ContractForm from '../Components/Contract/ContractForm';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ContractFormPage = () => {

  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getUsers`);
        console.log('Usuarios obtenidos:', response.data); 
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/companies`);
        console.log('Compañías obtenidas:', response.data); 
        setCompanies(response.data);
      } catch (error) {
        console.error('Error al obtener las compañías', error);
      }
    };

    fetchUsers();
    fetchCompanies();
  }, []);

  const handleCreateContract = async (data) => {
    try {      
      const response = await axios.post(`${BASE_URL}/contracts`, data);
      toast.success('Contrato creado exitosamente');
      // console.log('Contrato creado:', response.data);
      
      navigate('/contracts');
  } catch (error) {
      if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          Object.keys(errors).forEach(key => {
              toast.error(errors[key].join(', '));
          });
      } else {
          toast.error('Error al crear contrato');
      }
  }
  };

  return (
    <div>
      <h2>Crear Contrato</h2>
      <ContractForm onSubmit={handleCreateContract} users={users} companies={companies} />
    </div>
  );
};

export default ContractFormPage;
