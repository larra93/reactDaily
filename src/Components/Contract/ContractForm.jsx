import React, { useContext, useState } from 'react';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { AuthContext } from '../context/authContext';

const ContractForm = ({ onSubmit, users, companies }) => {
  const { control, register, handleSubmit, formState: { errors, }, setValue } = useForm({
    defaultValues: {
      revisorPYC: [],
      revisorCC: [],
      revisorOtraArea: [],
      encargadoContratista: [],
      adminDeContrato: [],
      revisorPYCRequired: false,
      revisorCCRequired: false,
      revisorOtraAreaRequired: false
    }
  });
  const [selectedApprover, setSelectedApprover] = useState([]);
  const [isApproverRequired, setIsApproverRequired] = useState({
    revisorPYC: false,
    revisorCC: false,
    revisorOtraArea: false
  });

  const { currentUser, accessToken } = useContext(AuthContext);
  const handleRevisorPYCChange = (selected) => {
    setValue('revisorPYC', selected); 
  };

  const handleRevisorCCChange = (selected) => {
    setValue('revisorCC', selected); 
  };
  const handleRevisorOtraAreaChange = (selected) => {
    setValue('revisorOtraArea', selected); 
  };
  const handleEncargadoContratistaChange = (selected) => {
    setValue('encargadoContratista', selected); 
  };
  const handleAdminDeContratoChange = (selected) => {
    setValue('adminDeContrato', selected); 
  };
  const customSubmit = (data) => {
    // console.log('data', data)
    onSubmit({ ...data, created_by: currentUser.id  });
  };


  return (
    <Box
      component="form"
      onSubmit={handleSubmit(customSubmit)}
      sx={{ width: '90%', margin: '0 auto' }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre contrato"
            fullWidth
            {...register('name_contract', { required: 'El campo no puede estar vacío' })}
            error={!!errors.name_contract}
            helperText={errors.name_contract?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="NSAP"
            fullWidth
            {...register('NSAP', { required: 'El campo no puede estar vacío' })}
            error={!!errors.NSAP}
            helperText={errors.NSAP?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="DEN"
            fullWidth
            {...register('DEN', { required: 'El campo no puede estar vacío' })}
            error={!!errors.DEN}
            helperText={errors.DEN?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Projecto"
            fullWidth
            {...register('project', { required: 'El campo no puede estar vacío' })}
            error={!!errors.project}
            helperText={errors.project?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="API"
            fullWidth
            {...register('API', { required: 'El campo no puede estar vacío' })}
            error={!!errors.API}
            helperText={errors.API?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="company-label">Empresa contratista</InputLabel>
            <Controller
              name="id_company"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  labelId="company-label"
                  id="company"
                  {...field}
                  input={<OutlinedInput label="Empresa contratista" />}
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="encargadoContratista-field-label">Encargado contratista (daily)</InputLabel>
            <Controller
              name="encargadoContratista"
              control={control}
              rules={{ required: 'El campo no puede estar vacío' }}
              render={({ field }) => (
                <Select
                  labelId="encargadoContratista-field-label"
                  id="encargadoContratista"
                  {...field}
                  multiple
                  input={<OutlinedInput label="Encargado contratista (daily)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                  onChange={(e) => handleEncargadoContratistaChange(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.encargadoContratista && <p style={{ color: 'red' }}>{errors.encargadoContratista.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="CC"
            fullWidth
            {...register('CC', { required: 'El campo no puede estar vacío' })}
            error={!!errors.CC}
            helperText={errors.CC?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="adminDeContrato-field-label">Admin de contrato</InputLabel>
            <Controller
              name="adminDeContrato"
              control={control}
              rules={{ required: 'El campo no puede estar vacío' }}
              render={({ field }) => (
                <Select
                  labelId="adminDeContrato-field-label"
                  id="adminDeContrato"
                  {...field}
                  multiple
                  input={<OutlinedInput label="Admin de contrato" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                  onChange={(e) => handleAdminDeContratoChange(e.target.value)}
                >
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.adminDeContrato && <p style={{ color: 'red' }}>{errors.adminDeContrato.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} container alignItems="center" spacing={1}>
        <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="revisorPYC-field-label">Revisor PYC</InputLabel>
              <Controller
                name="revisorPYC"
                control={control}
                rules={{ required: 'El campo no puede estar vacío' }}
                render={({ field }) => (
                  <Select
                    labelId="revisorPYC-field-label"
                    id="revisorPYC"
                    {...field}
                    multiple
                    input={<OutlinedInput label="Revisor PYC" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={users.find(user => user.id === value)?.name} />
                        ))}
                      </Box>
                    )}
                    onChange={(e) => handleRevisorPYCChange(e.target.value)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.revisorPYC && <p style={{ color: 'red' }}>{errors.revisorPYC.message}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <FormControlLabel
              control={
                <Controller
                  name="revisorPYCRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="¿Es obligatorio?"
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} container alignItems="center" spacing={1}>
        <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="revisorCC-field-label">Revisor CC</InputLabel>
              <Controller
                name="revisorCC"
                control={control}
                rules={{ required: 'El campo no puede estar vacío' }}
                render={({ field }) => (
                  <Select
                    labelId="revisorCC-field-label"
                    id="revisorCC"
                    {...field}
                    multiple
                    input={<OutlinedInput label="Revisor CC" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={users.find(user => user.id === value)?.name} />
                        ))}
                      </Box>
                    )}
                    onChange={(e) => handleRevisorCCChange(e.target.value)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.revisorCC && <p style={{ color: 'red' }}>{errors.revisorCC.message}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <FormControlLabel
              control={
                <Controller
                  name="revisorCCRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="¿Es obligatorio?"
            />
          </Grid>
        
        </Grid>
        <Grid item xs={12} sm={6} container alignItems="center" spacing={1}>
        <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="revisorOtraArea-field-label">Revisor otra área</InputLabel>
              <Controller
                name="revisorOtraArea"
                control={control}
                rules={{ required: 'El campo no puede estar vacío' }}
                render={({ field }) => (
                  <Select
                    labelId="revisorOtraArea-field-label"
                    id="revisorOtraArea"
                    {...field}
                    multiple
                    input={<OutlinedInput label="Revisor otra área" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={users.find(user => user.id === value)?.name} />
                        ))}
                      </Box>
                    )}
                    onChange={(e) => handleRevisorOtraAreaChange(e.target.value)}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.revisorOtraArea && <p style={{ color: 'red' }}>{errors.revisorOtraArea.message}</p>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
          <FormControlLabel
              control={
                <Controller
                  name="revisorOtraAreaRequired"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="¿Es obligatorio?"
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            label="Fecha inicio"
            fullWidth
            {...register('start_date', { required: 'El campo no puede estar vacío' })}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.start_date}
            helperText={errors.start_date?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            label="Fecha fin"
            fullWidth
            {...register('end_date', { required: 'El campo no puede estar vacío' })}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.end_date}
            helperText={errors.end_date?.message}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Guardar</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractForm;
