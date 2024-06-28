import React from 'react';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const ContractForm = ({ onSubmit, users, companies }) => {
  const { control, register, handleSubmit, formState: { errors, }, setValue } = useForm({
    defaultValues: {
      revisorPYC: [],
      revisorCC: [] // Agrega el campo adicional con un array vacío
    }
  });
  const [selectedApprover, setSelectedApprover] = React.useState([]);
  const [isApproverRequired, setIsApproverRequired] = React.useState(false);

  const handleRevisorPYCChange = (selected) => {
    setValue('revisorPYC', selected); // Setea el valor de 'approver'
  };

  const handleRevisorCCChange = (selected) => {
    setValue('revisorCC', selected); // Setea el valor de 'revisorCC'
  };
  const customSubmit = (data) => {
    onSubmit({ ...data, approver: selectedApprover });
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
            {...register('contractName', { required: 'El campo no puede estar vacío' })}
            error={!!errors.contractName}
            helperText={errors.contractName?.message}
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
              name="company"
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
          {/* <FormControl fullWidth>
            <InputLabel id="approver-label">Revisor PYC</InputLabel>
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
                  input={<OutlinedInput label="Revisor PYC" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {users.length > 0 && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
          </FormControl> */}
          <FormControl fullWidth>
            <InputLabel id="another-field-label">Revisor PYC</InputLabel>
            <Controller
              name="revisorPYC"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="revisorPYC-field-label"
                  id="revisorPYC"
                  {...field}
                  multiple
                  input={<OutlinedInput label="Otro Campo" />}
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
            {errors.revisorCC && <p style={{ color: 'red' }}>{errors.revisorCC.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="another-field-label">Revisor cc</InputLabel>
            <Controller
              name="revisorCC"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="revisorCC-field-label"
                  id="revisorCC"
                  {...field}
                  multiple
                  input={<OutlinedInput label="Otro Campo" />}
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
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="approver-label">Revisor otra área</InputLabel>
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
                  input={<OutlinedInput label="Revisor PYC OB" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {users.length > 0 && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="approver-label">Encargado contratista (daily)</InputLabel>
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
                  input={<OutlinedInput label="Revisor PYC OB" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {users.length > 0 && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="approver-label">CC</InputLabel>
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
                  input={<OutlinedInput label="Revisor PYC OB" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {users.length > 0 && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="approver-label">Admin de contrato</InputLabel>
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
                  input={<OutlinedInput label="Revisor PYC OB" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {users.length > 0 && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="approver-label">Revisor PYC</InputLabel>
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
                  input={<OutlinedInput label="Revisor PYC OB" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {users.length > 0 && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">¿Es obligatorio?</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isApproverRequired}
                  onChange={(e) => setIsApproverRequired(e.target.checked)}
                />
              }
              sx={{ marginLeft: 0 }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="approver-label">Revisor CC</InputLabel>
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
                  input={<OutlinedInput label="Revisor PYC OB" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {users.length > 0 && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">¿Es obligatorio?</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isApproverRequired}
                  onChange={(e) => setIsApproverRequired(e.target.checked)}
                />
              }
              sx={{ marginLeft: 0 }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="approver-label">Revisores otra área</InputLabel>
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
                  input={<OutlinedInput label="Revisores otra área" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={users.find(user => user.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {users.length > 0 && users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.approver && <p style={{ color: 'red' }}>{errors.approver.message}</p>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1">¿Es obligatorio?</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isApproverRequired}
                  onChange={(e) => setIsApproverRequired(e.target.checked)}
                />
              }
              sx={{ marginLeft: 0 }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="datetime-local"
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
            type="datetime-local"
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
          <Button type="submit" variant="contained" color="primary">
            Crear Contrato
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractForm;
