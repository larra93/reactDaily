import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, FormControl, Select, InputLabel, MenuItem, Chip, OutlinedInput, FormControlLabel, Checkbox } from '@mui/material';
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

const ContractForm = ({ onSubmit }) => {
  const theme = useTheme();
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();
  const [approver, setApprover] = useState([]);

  // Datos estáticos para probar
  const companies = [
    { id: 1, name: 'Company A' },
    { id: 2, name: 'Company B' },
  ];

  const users = [
    { id: 1, name: 'Felipe Larraguibel - felipe@example.com' },
    { id: 2, name: 'Diego Cataldo - diego@example.com' },
  ];

  useEffect(() => {
    // Simulación de datos pre-rellenados para la prueba
    const contract = {
      NSAP: 'NSAP12345',
      DEN: 'DEN12345',
      project: 'Proyecto ABC',
      API: 'API12345',
      start_date: '2024-01-01T10:00',
      end_date: '2024-12-31T18:00',
      id_company: 1,
      created_by: 1,
      approver: [1]
    };

    setValue('NSAP', contract.NSAP);
    setValue('DEN', contract.DEN);
    setValue('project', contract.project);
    setValue('API', contract.API);
    // setValue('start_date', dayjs(contract.start_date).format('YYYY-MM-DDTHH:mm'));
    // setValue('end_date', dayjs(contract.end_date).format('YYYY-MM-DDTHH:mm'));
    setValue('id_company', contract.id_company);
    setValue('created_by', contract.created_by);
    setApprover(contract.approver);
  }, [setValue]);

  const customSubmit = (data) => {
    console.log({ ...data, approver });
    alert(JSON.stringify({ ...data, approver }, null, 2));
  };

  const handleChange = (event) => {
    setApprover(event.target.value);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(customSubmit)}
      sx={{ display: 'flex', width: '30%', margin: '0 auto', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        label="NSAP"
        {...register('NSAP', { required: 'El campo no puede estar vacío' })}
        error={!!errors.NSAP}
        helperText={errors.NSAP?.message}
      />
      <TextField
        label="DEN"
        {...register('DEN', { required: 'El campo no puede estar vacío' })}
        error={!!errors.DEN}
        helperText={errors.DEN?.message}
      />
      <TextField
        label="Project"
        {...register('project', { required: 'El campo no puede estar vacío' })}
        error={!!errors.project}
        helperText={errors.project?.message}
      />
      <TextField
        label="API"
        {...register('API', { required: 'El campo no puede estar vacío' })}
        error={!!errors.API}
        helperText={errors.API?.message}
      />
      {/* <TextField
        type="datetime-local"
        label="Start Date"
        {...register('start_date', { required: 'El campo no puede estar vacío' })}
        InputLabelProps={{ shrink: true }}
        error={!!errors.start_date}
        helperText={errors.start_date?.message}
      />
      <TextField
        type="datetime-local"
        label="End Date"
        {...register('end_date', { required: 'El campo no puede estar vacío' })}
        InputLabelProps={{ shrink: true }}
        error={!!errors.end_date}
        helperText={errors.end_date?.message}
      /> */}
      <FormControl md={{ m: 1, width: 300 }}>
        <InputLabel id="company-label">Company</InputLabel>
        <Controller
          name="id_company"
          control={control}
          rules={{ required: 'El campo no puede estar vacío' }}
          render={({ field }) => (
            <Select
              labelId="company-label"
              id="id_company"
              {...field}
              input={<OutlinedInput label="Company" />}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.id_company && <p style={{ color: 'red' }}>{errors.id_company.message}</p>}
      </FormControl>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <InputLabel id="approver-label">Revisor otra área</InputLabel>
        <Controller
          name="approver"
          control={control}
        //   rules={{ required: isApproverRequired ? 'El campo no puede estar vacío' : false }}
          render={({ field }) => (
            <Select
              labelId="approver-label"
              id="approver"
              value={approver}
              onChange={(e) => {
                handleChange(e);
                field.onChange(e.target.value);
              }}
              input={<OutlinedInput id="select-multiple-chip" label="Aprobador TCP" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={users.find(user => user.id === value)?.name} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  style={getStyles(user.name, approver.map(a => a.name), theme)}
                >
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
        <FormControlLabel
          control={
            <Checkbox
            //   checked={isApproverRequired}
            //   onChange={(e) => setIsApproverRequired(e.target.checked)}
              color="primary"
            />
          }
          label="Obligatorio?"
          sx={{ mt: 1 }}
        />
      </FormControl>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <InputLabel id="approver-label">Revisor CC</InputLabel>
        <Controller
          name="approver"
          control={control}
        //   rules={{ required: isApproverRequired ? 'El campo no puede estar vacío' : false }}
          render={({ field }) => (
            <Select
              labelId="approver-label"
              id="approver"
              value={approver}
              onChange={(e) => {
                handleChange(e);
                field.onChange(e.target.value);
              }}
              input={<OutlinedInput id="select-multiple-chip" label="Aprobador TCP" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={users.find(user => user.id === value)?.name} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                  style={getStyles(user.name, approver.map(a => a.name), theme)}
                >
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
        <FormControlLabel
          control={
            <Checkbox
            //   checked={isApproverRequired}
            //   onChange={(e) => setIsApproverRequired(e.target.checked)}
              color="primary"
            />
          }
          label="Obligatorio?"
          sx={{ mt: 1 }}
        />
      </FormControl>
      
      <Button type="submit" variant="contained" color="primary">
        {true ? 'Actualizar Contrato' : 'Crear Contrato'} {/* true para simular que ya hay un contrato */}
      </Button>
    </Box>
  );
};

export default ContractForm;
