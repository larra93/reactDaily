import { useMemo, useState, useEffect } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { BASE_URL } from '../../../helpers/config';
import { toast } from 'react-toastify';

const TableP = ({ fields, idSheet, idDaily }) => {
  const [validationErrors, setValidationErrors] = useState({});

  const fieldsDeep = JSON.parse(JSON.stringify(fields));
  const [rowValues, setRowValues] = useState({});

  useEffect(() => {
    setRowValues(rowValues);
    // console.log('rowValues', rowValues)
  }, [rowValues]);

  const rows = useMemo(() => {
    if (!fields) return [];

    const rowMap = {};
    fields.forEach(field => {
      field.values.forEach(value => {
        if (!rowMap[value.row]) {
          rowMap[value.row] = { id: value.row };
        }
        rowMap[value.row][field.name] = value.value;
      });
    });

    return Object.values(rowMap);
  }, [fields]);

let columns  = null;
   columns = useMemo(() => {
  const fieldsDeep = JSON.parse(JSON.stringify(fields));

    const safeFields = fieldsDeep || [];
    const safeValidationErrors = validationErrors || {};
    return fieldsDeep.map((field) => {

      return {
        // necesitamos un accessorKey único para cada columna
        // accessorKey: `${field.name}-${field.daily_sheet_id}`, pero esto requerira cambios
        
        accessorKey: field.name,
        header: field.name,
        ...(field.name === 'Comentarios Codelco' && { enableEditing: false }),
        muiEditTextFieldProps: ({ cell, row, table }) => ({
          ...(field.name === 'HH Trabajadas' && {
            value: rowValues[`${field.name}-${row.id}`] || '',
            onChange: (e) => handleHH(e, field, row, table)
          }),
          id: `${field.name}-${row.id}`,
          required: true,
          error: !!safeValidationErrors[field.name],
          helperText: safeValidationErrors[field.name],
          ...(field.name === 'Estado Personal' && { onChange: (e) => handleEstado(e, field, row, table) }),
          ...(field.name === 'Jornada' && { onChange: (e) => handleJornada(e, field, row, table) }),
          ...(field.name === 'Categoría' && { onChange: (e) => handleCategoria(e, field, row, table) }),
          ...(field.field_type === 'integer' && { type: 'number' }),
          ...(field.field_type === 'date' && { type: 'date' }),
          ...(field.field_type === 'hour' && { type: 'time' }),
        }),
        ...(field.field_type === 'list' && {
          editVariant: 'select',
          editSelectOptions: field.dropdown_lists,
        }),
      };
    });
  }, [JSON.stringify(fieldsDeep), validationErrors, rowValues]);


  // Función para manejar el cambio en "HH trabajadas"
  const handleHH = (event, field, row, table) => {
    const newValue = event.target.value;
    const valueJornada = rowValues[`Jornada-${row.id}`];
    // Actualiza el estado con el nuevo valor
    setRowValues(prevValues => ({
      ...prevValues,
      [`${field.name}-${row.id}`]: newValue,
    }));
  };
  const handleJornada = (event, field, row, table) => {
    const newValue = event.target.value;
    const valueEstado = rowValues[`Estado Personal-${row.id}`];
    //por el momento no se esta tomando en cuenta categoría, pero puede que a futuro se necesite
    const valueCategoria = rowValues[`Categoría-${row.id}`];
    // Actualiza el estado de Jornada en rowValues
    setRowValues(prevValues => ({
      ...prevValues,
      [`${field.name}-${row.id}`]: newValue,
    }));
    let valorFinalHH = rowValues[`HH Trabajadas-${row.id}`];
    //comienza formula para defnir HH trabajadas
    if (valueEstado === "Trabajando" || valueEstado === "Teletrabajo") {
      if (newValue === "5x2") {
        valorFinalHH = "10";
      } else if (newValue === "8x6" || newValue === "10x10" || newValue === "14x14" || newValue === "11x9" || newValue === "7x7" || newValue === "4x3") {
        valorFinalHH = "11";
      } else if (newValue === "10x5") {
        valorFinalHH = "9";
      }
    }
    // Actualiza el estado de HH trabajadas en rowValues
    setRowValues(prevValues => ({
      ...prevValues,
      [`HH Trabajadas-${row.id}`]: valorFinalHH,
    }));
  };
  // Función para manejar el cambio en "HH trabajadas"
  const handleEstado = (event, field, row, table) => {
    const newValue = event.target.value;
    const valueJornada = rowValues[`Jornada-${row.id}`];
    //por el momento no se esta tomando en cuenta categoría, pero puede que a futuro se necesite
    const valueCategoria = rowValues[`Categoría-${row.id}`];
    // Actualiza el estado de Estado Personal en rowValues
    setRowValues(prevValues => ({
      ...prevValues,
      [`${field.name}-${row.id}`]: newValue,
    }));

    let valorFinalHH = rowValues[`HH Trabajadas-${row.id}`];
    //comienza formula para defnir HH trabajadas
    if (newValue === "Trabajando" || newValue === "Teletrabajo") {
      if (valueJornada === "5x2") {
        valorFinalHH = "10";
      } else if (valueJornada === "8x6" || valueJornada === "10x10" || valueJornada === "14x14" || valueJornada === "11x9" || valueJornada === "7x7" || valueJornada === "4x3") {
        valorFinalHH = "11";
      } else if (valueJornada === "10x5") {
        valorFinalHH = "9";
      }
    } else {
      valorFinalHH = "0";
    }
    // Actualiza el estado de HH trabajadas en rowValues
    setRowValues(prevValues => ({
      ...prevValues,
      [`HH Trabajadas-${row.id}`]: valorFinalHH,
    }));
  };
  const handleCategoria = (event, field, row, table) => {
    const newValue = event.target.value;
    const valueJornada = rowValues[`Jornada-${row.id}`];
    const valueEstado = rowValues[`Estado Personal-${row.id}`];
    // Actualiza el estado de Categoria en rowValues
    setRowValues(prevValues => ({
      ...prevValues,
      [`${field.name}-${row.id}`]: newValue,
    }));
  };
  const resetRowValues = () => {
    setRowValues({});
  }


  // Hooks y manejadores de Crear, Actualizar, Eliminar
  const { mutateAsync: createField, isPending: isCreatingField } = useCreateField();
  const { mutateAsync: updateField, isPending: isUpdatingField } = useUpdateField();
  const { mutateAsync: deleteField, isPending: isDeletingField } = useDeleteField();
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetRows(idDaily, idSheet);


  const handleCreateField = async ({ values, table }) => {

    const rowId = table.getState().creatingRowId;
    const maxRow = Math.max(...fetchedUsers.rows.map(row => row.id), 0);
    const newRowId = maxRow + 1;

    console.log('fetchedUsers', fetchedUsers);
    console.log('values', values);

    const transformedValues = fetchedUsers.requiredAll.map((field) => {
      const value = values[field.name];
      if (value === undefined || value === null || value === '') {
        return null;
      }

      return {
        field_id: field.id,
        value: value,
        daily_sheet_id: field.daily_sheet_id,
        daily_id: idDaily,
        row: newRowId,
        required: field.required,
        name: field.name
      };
    }).filter(value => value !== null);

    const newValidationErrors = validateCurrentSheetFields(idSheet, fetchedUsers.requiredAll, values);

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    toast.success('Campos creados exitosamente');
    await createField(transformedValues);
    table.setCreatingRow(null);
    resetRowValues();
  };


  const handleSaveField = async ({ values, row, table }) => {
    const rowId = row.id;

    const transformedValues = fetchedUsers.requiredAll.map((field) => {
      const value = values[field.name];

      if (value === undefined) {
        return null;
      }

      const idValue = field.values.find(v => v.field_id === field.id && v.row === rowId);

      return {
        field_id: field.id,
        value: value,
        daily_sheet_id: field.daily_sheet_id,
        daily_id: idDaily,
        row: rowId,
        required: field.required,
        name: field.name,
        id: idValue.id
      };
    }).filter(value => value !== null);


    const newValidationErrors = validateCurrentSheetFields(idSheet, fetchedUsers.requiredAll, values);


    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    await updateField(transformedValues);
    toast.success('Actualizado exitosamente');
    table.setEditingRow(null);
  };
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este campo?')) {
      deleteField({ row: row.original.id, daily_id: idDaily });
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers.rows ? fetchedUsers.rows : [],
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiTableContainerProps: { sx: { minHeight: '500px' } },
    onCreatingRowCancel: () => {
      setValidationErrors({});
      resetRowValues();
    },

    onCreatingRowSave: async ({ values, table }) => {
      await handleCreateField({ values, table });
    },
    onEditingRowCancel: () => {
      setValidationErrors({});
    },

    onEditingRowSave: async ({ values, row, table }) => {
      await handleSaveField({ values, row, table });
      resetRowValues();
    },
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Crear nueva columna</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Editar campo</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button variant="contained" onClick={() => table.setCreatingRow(true)}>
        Crear nueva columna
      </Button>
    ),
    state: {
      isSaving: isCreatingField || isUpdatingField || isDeletingField,
    },
  });

  return <MaterialReactTable table={table} />;
};


//READ hook (get fields from api)
function useGetRows(idDaily, idSheet) {

  return useQuery({
    queryKey: ['fields', idSheet],
    queryFn: async () => {

      const response = await axios.get(`${BASE_URL}/Dailys/${idDaily}/dailyStructure`)
      var fields = response.data.steps.find(step => step.idSheet === idSheet).fields;
   //   console.log('fields:', fields);
      const steps = response.data.steps;
      const allFields = steps.flatMap(step => step.fields);
      if (!fields) return [];

      const rowMap = {};

      fields.forEach(field => {
        field.values.forEach(value => {
          if (!rowMap[value.row]) {
            rowMap[value.row] = { id: value.row };
          }
          rowMap[value.row][field.name] = value.value;
        });
      });
     

      return {
        requiredAll: fields,
        rows: Object.values(rowMap)
      };

    },
    refetchOnWindowFocus: false,
  });
}


// CREATE hook
function useCreateField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fieldData) => {
      const response = await axios.post(`${BASE_URL}/values`, fieldData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['fields']); // Invalidar consultas para volver a obtener datos
    },
  });
}

// UPDATE hook
function useUpdateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (field) => {
      const response = await axios.put(`${BASE_URL}/updateValues`, field);
      return response.data;
    },
    onMutate: async (newFieldInfo) => {
      const previousFields = queryClient.getQueryData(['Fields']);
      queryClient.setQueryData(['Fields'], (prevFields) =>
        prevFields?.map((prevField) =>
          prevField.id === newFieldInfo.id ? newFieldInfo : prevField,
        ),
      );
      return { previousFields };
    },
    onError: (error, newFieldInfo, context) => {
      queryClient.setQueryData(['Fields'], context.previousFields);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['Fields']);
    },
  });
}

// DELETE hook
function useDeleteField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ row, daily_id }) => {

      await axios.delete(`${BASE_URL}/values`, {
        data: { row, daily_id }
      });
    },

    onMutate: (deletedField) => {
      queryClient.setQueryData(['Fields'], (prevFields) =>
        prevFields?.filter((field) => field.id !== deletedField.row),
      );
    },
    onError: (error) => {
      toast.error('Error al eliminar el campo');
    },
    onSettled: (data, error) => {
      if (!error) {
        toast.success('Campos eliminados exitosamente');
      }
      queryClient.invalidateQueries(['Fields']);
    },
  });
}

const queryClient = new QueryClient();

const Table = ({ data, idDaily }) => {
  if (!data) return null;
  const fields = data.fields.sort((a, b) => a.step - b.step);
  console.log('fields:', fields);
  const idSheet = data.idSheet;

  return (
    <QueryClientProvider client={queryClient}>
      <TableP fields={fields} idSheet={idSheet} idDaily={idDaily} />
    </QueryClientProvider>
  );
};

export default Table;

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );


function validateCurrentSheetFields(currentSheetId, allFields, values) {
  const validationErrors = {};

  // Filtrar los campos que pertenecen al idSheet actual
  const currentSheetFields = allFields.filter(field => field.daily_sheet_id === currentSheetId);

  // Validar los campos filtrados
  currentSheetFields.forEach(field => {
    if (field.required === 'Si' && !values[field.name]) {
      console.log('field.name:', field.name);
      if(field.name === "HH Trabajadas"){
        console.log('entro', field.name);
        validationErrors[field.name] = `Seleccione Manualmente el campo`;
      }else{
        console.log('entro', field.name);
      validationErrors[field.name] = `${field.name} es requerido`;
      }
    } else {
      if (validationErrors[field.name]) {
        delete validationErrors[field.name];
      }
    }
  });
  console.log(validationErrors);

  return validationErrors;
}




