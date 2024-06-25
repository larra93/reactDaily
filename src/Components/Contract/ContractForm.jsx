import React from 'react';
import axios from 'axios';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';

const ContractForm = ({ onSubmit, users, companies }) => {
  const theme = useTheme();
  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const [selectedCompany, setSelectedCompany] = React.useState('');
  const [selectedApprover, setSelectedApprover] = React.useState([]);

  const customSubmit = (data) => {
    onSubmit({ ...data, company_id: selectedCompany, approvers: selectedApprover });
  };

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleApproverChange = (event) => {
    setSelectedApprover(event.target.value);
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
      <TextField
        type="datetime-local"
        label="Start Date"
        {...register('start_date', { required: 'El campo no puede estar vacío' })}
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.start_date}
        helperText={errors.start_date?.message}
      />
      <TextField
        type="datetime-local"
        label="End Date"
        {...register('end_date', { required: 'El campo no puede estar vacío' })}
        InputLabelProps={{
          shrink: true,
        }}
        error={!!errors.end_date}
        helperText={errors.end_date?.message}
      />
      <FormControl>
        <InputLabel id="company-label">Company</InputLabel>
        <Controller
          name="company"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              labelId="company-label"
              id="company"
              value={selectedCompany}
              onChange={(e) => {
                handleCompanyChange(e);
                field.onChange(e.target.value);
              }}
              input={<OutlinedInput label="Company" />}
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name} ({company.rut_number}-{company.rut_verifier})
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.company && <p style={{ color: 'red' }}>{errors.company.message}</p>}
      </FormControl>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <InputLabel id="approver-label">Aprobador TCP</InputLabel>
        <Controller
          name="approver"
          control={control}
          render={({ field }) => (
            <Select
              labelId="approver-label"
              id="approver"
              value={selectedApprover}
              onChange={(e) => {
                handleApproverChange(e);
                field.onChange(e.target.value);
              }}
              input={<OutlinedInput label="Aprobador TCP" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={users.find(user => user.id === value)?.name} />
                  ))}
                </Box>
              )}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Crear Contrato
      </Button>
    </Box>
  );
};

export default ContractForm;
