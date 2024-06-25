import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, FormControl, Select, InputLabel, MenuItem, Chip, OutlinedInput } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const UserForm = ({ onSubmit, roles, user }) => {
  const theme = useTheme();
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();
  const [roleName, setRoleName] = useState([]);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('password', ''); // Do not pre-fill the password field

      // Pre-seleccionar los roles del usuario
      const preselectedRoles = user.roles.map(role => role.id);
      setRoleName(preselectedRoles);
      setValue('roles', preselectedRoles); // Actualizar el valor del campo controlado 'roles'
    }
  }, [user, setValue]);

  const customSubmit = (data) => {
    onSubmit({ ...data, roles: roleName });
  };

  const handleChange = (event) => {
    const selectedRoles = event.target.value;
    setRoleName(selectedRoles);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(customSubmit)}
      sx={{ display: 'flex', width: '30%', margin: '0 auto', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label="Nombre"
        {...register('name', { required: 'El campo no puede estar vacío', maxLength: { value: 50, message: 'El campo no puede tener más de 50 caracteres' } })}
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
      {/* <FormControl md={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Roles</InputLabel>
        <Controller
          name="roles"
          control={control}
          rules={{ required: 'El campo no puede estar vacío' }}
          render={({ field }) => (
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={roleName}
              onChange={(e) => {
                handleChange(e);
                field.onChange(e.target.value);
              }}
              input={<OutlinedInput id="select-multiple-chip" label="Roles" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={roles.find(role => role.id === value)?.name} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {roles.map((role) => (
                <MenuItem
                  key={role.id}
                  value={role.id}
                  style={getStyles(role.name, roleName.map(r => r.name), theme)}
                >
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.roles && <p style={{ color: 'red' }}>{errors.roles.message}</p>}
      </FormControl> */}
      <Button type="submit" variant="contained" color="primary">
        {user ? 'Actualizar usuario' : 'Crear usuario'}
      </Button>
    </Box>
  );
};

export default UserForm;
