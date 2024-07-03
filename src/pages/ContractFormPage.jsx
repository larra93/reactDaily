import React, { useEffect, useState } from 'react';
import ContractForm from '../Components/Contract/ContractForm';
import axios from 'axios';
import { BASE_URL } from '../helpers/config';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ContractFormPage = () => {

  const navigate = useNavigate(); 
  const { id } = useParams();
   
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    

    fetchUsers();
    fetchCompanies();
    fetchContract();
  }, []);

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
  const fetchContract = async () => {
    if (id) {
        try {
            const response = await axios.get(`${BASE_URL}/contracts/${id}`);
            console.log('res', response.data)
            setContract(response.data);
        } catch (error) {
            toast.error('Error intente más tarde');
        }
    }
};

  const handleCreateContract = async (data) => {
    try {
      if (id) {
          await axios.put(`${BASE_URL}/contracts/${id}`, data);
          toast.success('Contrato actualizado exitosamente');
      } else {
          
        await axios.post(`${BASE_URL}/contracts`, data);
        toast.success('Contrato creado exitosamente');
      }
      navigate('/contracts');
  } catch (error) {
      if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          Object.keys(errors).forEach(key => {
              toast.error(errors[key].join(', '));
          });
      } else {
        const action = id ? 'actualizar' : 'crear';
        toast.error(`Error al ${action} el contrato`);
      }
  }

  };

  return (
    <div>
      <h2>{id ? 'Editar contrato' : 'Crear contrato'}</h2>
      {id && !contract ? <p>Cargando...</p> : <ContractForm onSubmit={handleCreateContract} users={users} companies={companies} contract={contract} />}
    </div>
  );
};

export default ContractFormPage;
