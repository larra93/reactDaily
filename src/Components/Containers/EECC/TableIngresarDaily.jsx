import { useMemo, useState } from 'react';
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

const TableP = ({ fields, idSheet, idDaily }) => {
  const [validationErrors, setValidationErrors] = useState({});

  //list of field types
const ListTypes = [
  'text',
  'integer',
  'list',
  'hour',
  'date'
];
  // Extraer valores y transformarlos en filas para la tabla
  const rows = useMemo(() => {
    if (!fields) return [];

    const rowMap = {};
    console.log('aer', fields)
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


  const columns = useMemo(() => {
    const safeFields = fields || [];
    console.log('save', safeFields)
    const safeValidationErrors = validationErrors || {};
    return safeFields.map((field) => {

      return {
        accessorKey: field.name,
        header: field.name,
        ...(field.name === 'Comentarios Codelco' && { enableEditing: false }),
        muiEditTextFieldProps: {
          required: true,
          error: !!safeValidationErrors[field.name],
          helperText: safeValidationErrors[field.name],
          onFocus: () =>
            setValidationErrors({
              ...safeValidationErrors,
              [field.name]: undefined,
            }),
          ...(field.field_type === 'integer' && { type: 'number' }),
          ...(field.field_type === 'date' && { type: 'date' }),
          ...(field.field_type === 'hour' && { type: 'time' }),
        },
        ...(field.field_type === 'list' && {
          editVariant: 'select',
          editSelectOptions: field.dropdown_lists,
        }),
      };
    });
   
  }, [fields, validationErrors]);

  // Hooks y manejadores de Crear, Actualizar, Eliminar
  const { mutateAsync: createField, isPending: isCreatingField } = useCreateField();
  const { mutateAsync: updateField, isPending: isUpdatingField } = useUpdateField();
  const { mutateAsync: deleteField, isPending: isDeletingField } = useDeleteField();
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetFields(idDaily, idSheet);


  const handleCreateField = async ({ values, table }) => {
console.log('valll', values)
console.log('requiredallsave', fetchedUsers.requiredAll)
   console.log('fetchedUsers', fetchedUsers.rows)

    const rowId = table.getState().creatingRowId;
    const maxRow = Math.max(...fetchedUsers.rows.map(row => row.id), 0);
    const newRowId = maxRow + 1;

    const transformedValues = Object.keys(values).map((key) => {
      const field = fields.find((f) => f.name === key);
      console.log('field', field)
      if (!field) {
        return null;
      }
      return {
        field_id: field ? field.id : null,
        value: values[key],
        daily_sheet_id: idSheet,
        daily_id: idDaily,
        row: newRowId,
        required: field.required,
        name: field.name
      };
    }).filter(value => value !== null);
      
    const allRequiredFields = fields.flatMap(field => field).filter(field => field.required === 'Si');
    console.log('allRequiredFields', allRequiredFields)
    // const newValidationErrors = validateField(fetchedUsers.requiredAll);
    const newValidationErrors = validateField(fetchedUsers.requiredAll, values);

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    console.log('transf', transformedValues)
    // await createField(transformedValues);
    table.setCreatingRow(null);
  };

  const handleSaveField = async ({ values, row, table }) => {
    const rowId = row.id;
    const transformedValues = Object.keys(values).map((key) => {
      console.log('valuesaaa', values)
      const field = fields.find((f) => f.name === key);
      const existingValue = field.values.find((v) => v.row === rowId);
      return {
        id: existingValue.id,
        field_id: field ? field.id : null,
        value: values[key],
        daily_sheet_id: idSheet,
        daily_id: idDaily,
        row: rowId
      };
    });
    await updateField(transformedValues);
    table.setEditingRow(null);
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este campo?')) {
      deleteField(row.original.id);
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
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateField,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveField,
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
function useGetFields(idDaily, idSheet) {


  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {

      const response = await axios.get(`${BASE_URL}/Dailys/${idDaily}/dailyStructure`)
      var  fields = response.data.steps.find(step => step.idSheet === idSheet).fields;
      const steps = response.data.steps;
      const requiredAll = steps.flatMap(step => step.fields);
      console.log('requiredAll', requiredAll)
      console.log('response.data.steps.', response.data.steps)
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
      console.log('rowMap', rowMap)
      return {
        requiredAll,
        rows: Object.values(rowMap)
      };

      return Object.values(rowMap);





      // const response = await axios.get(`${BASE_URL}/contracts/${idContract}/dailySheet`)
      //obtengo los fields del dailysheet correspondiente y los ordeno segun su step
      // const step = response.data.steps.find(step => step.idSheet === idSheet);
      //  const fields = step.fields.sort((a, b) => a.step - b.step);

      //return fields;


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
      console.log('updata', field);
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
    mutationFn: async (FieldId) => {
      await axios.delete(`${BASE_URL}/values/${FieldId}`);
      return Promise.resolve();
    },
    onMutate: (FieldId) => {
      queryClient.setQueryData(['Fields'], (prevFields) =>
        prevFields?.filter((Field) => Field.id !== FieldId),
      );
    },
  });
}

const queryClient = new QueryClient();

const Table = ({ data, idDaily }) => {
  //  console.log('daily1', idDaily);
  if (!data) return null;
  const fields = data.fields.sort((a, b) => a.step - b.step);
  console.log('daa', data)
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

// function validateField(Field) {
//   return {
//     RUT: !validateRequired(Field.RUT)
//       ? 'First Name is Required'
//       : '',
//    // lastName: !validateRequired(Field.lastName) ? 'Last Name is Required' : '',
//     //state: !validateRequired(Field.state) ? 'Last Name is Required' : '',
//   };
// }

function validateField(fields, values) {
  const validationErrors = {};

  fields.forEach(field => {
    if (field.required === 'Si' && !values[field.name]) {
      validationErrors[field.name] = `${field.name} es requerido`;
    } else {
      if (validationErrors[field.name]) {
        delete validationErrors[field.name];
      }
    }
  });

  return validationErrors;
}



// function validateField(values) {
//   const validationErrors = {};
// console.log('valuessss', values)
//   values.forEach(field => {
//     console.log('values, field', field);
//     if (field.required === 'Si') {
//       validationErrors[field.name] = `${field.name} es requerido`;
//     }
//   });
// console.log('validationErrors ', validationErrors )
//   return validationErrors;
// }

// function validateField(values) {
//   const validationErrors = {};

//   Object.keys(values).forEach(key => {
//     if (!values[key].trim()) {
//       validationErrors[key] = `${key} es requerido`;
//     }
//   });

//   return validationErrors;
// }




