import React from 'react';
import ContractForm from '../Components/Contract/ContractForm';


const ContractFormPage = () => {
  const handleCreateContract = () => {
    // Lógica para crear un nuevo contrato
    console.log('Crear contrato');
  };

  return (
    <div>
      <h2>Crear Contrato</h2>
      <ContractForm onSubmit={handleCreateContract} /> {/* Renderiza el formulario */}
    </div>
  );
};

export default ContractFormPage;
