import React from 'react';
import { TextField, Button, Box, FormControl, Select, InputLabel, MenuItem, Chip } from '@mui/material';
import { useForm } from 'react-hook-form';

const UserForm = ({ onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const customSubmit = (data) => {
        onSubmit(data); // Llama al onSubmit pasado como prop con los datos del formulario
    };

    const handleRoleChange = (event) => {
        const selected = event.target.value;
        setSelectedRoles(selected);
    };

    const [personName, setPersonName] = React.useState([]);

    const names = [
        { id: 1, name: 'fe' },
        { id: 2, name: 'felipe' },
        { id: 3, name: 'eeee' }
      ];
    
      const handleChange = (event) => {
        const {
          target: { value }
        } = event;
        setPersonName(value);
      };
    
      return (
        <Box
          component="form"
          onSubmit={handleSubmit(customSubmit)}
          sx={{ display: 'flex', width: '30%', margin: '0 auto', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Nombre"
            {...register('name', { required: 'El campo no puede estar vacío', maxLength: { value: 5, message: 'El campo no puede tener más de 5 caracteres' } })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            {...register('email', { required: 'El campo no puede estar vacío', pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: 'Ingrese un email válido' } })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            type='password'
            label="Contraseña"
            {...register('password', { required: 'El campo no puede estar vacío' })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={personName}
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value.id} label={value.name} />
                  ))}
                </Box>
              )}
            >
              {names.map((name) => (
                <MenuItem key={name.id} value={name}>
                  {name.name}
                </MenuItem>
              ))}
            </Select>
          
      </FormControl>
            <Button type="submit" variant="contained" color="primary">Crear usuario</Button>
        </Box>
    );
};

export default UserForm;
