import React, { useEffect, useState } from 'react';
import ContractForm from '../Components/Contract/ContractForm';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';

const ContractFormPage = () => {
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

  const handleCreateContract = (data) => {
    
    console.log('Crear contrato', data);
    
  };

  return (
    <div>
      <h2>Crear Contrato</h2>
      <ContractForm onSubmit={handleCreateContract} users={users} companies={companies} />
    </div>
  );
};

export default ContractFormPage;
