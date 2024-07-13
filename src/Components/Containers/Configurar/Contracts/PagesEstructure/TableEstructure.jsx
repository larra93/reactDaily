import { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
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
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BASE_URL } from '../../../../../helpers/config';
import axios from 'axios';
import { toast } from 'react-toastify';


//list of field types
const ListTypes = [
  'text',
  'integer',
  'list',
  'hour',
  'date'
];


const TableP = ({ fields, idSheet, idContract }) => {
  const [validationErrors, setValidationErrors] = useState({});



  const idSheet2 = idSheet
  const idContract2 = idContract

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Nombre Columna',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          //remove any previous validation errors when Field focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'description',
        header: 'Descripción',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.description,
          helperText: validationErrors?.description,
          //remove any previous validation errors when Field focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined,
            }),
        },
      },
      {
        accessorKey: 'field_type',
        header: 'Tipo de Campo',
        editVariant: 'select',
        editSelectOptions: ListTypes,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.field_type,
          helperText: validationErrors?.field_type,
        },
      }, {
        accessorKey: 'step',
        header: 'Orden',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.description,
          helperText: validationErrors?.description,
          //remove any previous validation errors when Field focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined,
            }),
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createField, isPending: isCreatingField } =
    useCreateField(idSheet2, idContract2);

  //call READ hook
  const {
    data: fetchedFields = [],
    isError: isLoadingFieldsError,
    isFetching: isFetchingFields,
    isLoading: isLoadingFields,
  } = useGetFields(idSheet2, idContract2);


  //call UPDATE hook
  const { mutateAsync: updateField, isPending: isUpdatingField } =
    useUpdateField(fields);

  //call DELETE hook
  const { mutateAsync: deleteField, isPending: isDeletingField } =
    useDeleteField();

  //CREATE action
  const handleCreateField = async ({ values, table }) => {
    const newValidationErrors = validateField(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createField(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveField = async ({ values, table, row }) => {
    const newValidationErrors = validateField(values);

    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateField({ ...values, id: row.id });
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this Field?')) {
      deleteField(row.original.id);
    }
  };


  const table = useMaterialReactTable({
    columns,
    data: fetchedFields,
    createDisplayMode: 'row', //default ('row', and 'custom' are also available)
    editDisplayMode: 'row', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    initialState: { columnVisibility: { id: false } },
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingFieldsError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateField,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveField,
    //optionally customize modal content
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Crear nueva columna</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Field</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
        }}
      >
        Crear nueva columna
      </Button>
    ),
    state: {
      isLoading: isLoadingFields,
      isSaving: isCreatingField || isUpdatingField || isDeletingField,
      showAlertBanner: isLoadingFieldsError,
      showProgressBars: isFetchingFields,
    },
  });

  return <MaterialReactTable table={table} />;
};


//READ hook (get fields from api)
function useGetFields(idSheet, idContract) {

  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {

      try {
        const response = await axios.get(`${BASE_URL}/contracts/${idContract}/dailySheet`)

        //obtengo los fields del dailysheet correspondiente y los ordeno segun su step
        const step = response.data.steps.find(step => step.idSheet === idSheet);
        const fields = step.fields.sort((a, b) => a.step - b.step);

        return fields;

      } catch (error) {
        console.error('Error al obtener pasos y campos:', error);
      }

    },
    refetchOnWindowFocus: false,
  });
}

//CREATE hook (post new Field to api)
function useCreateField(idSheet, idContract) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (Field) => {
      try {
        // Intenta enviar la solicitud de creación a la API
        const response = await axios.post(`${BASE_URL}/fields/create/${idSheet}`, Field);
        toast.success('Campo creado exitosamente');
        return response.data; // Retorna los datos de la respuesta
      } catch (error) {
        // Maneja cualquier error que ocurra durante la solicitud
        console.error('Error al crear el campo:', error.response ? error.response.data : error.message);
        toast.error(`Error al crear el campo: ${error.response ? error.response.data.message : error.message}`);
        throw error; // Relanza el error para que useMutation pueda manejarlo
      }
    },
    //client side optimistic update
    onMutate: (newFieldInfo) => {
      queryClient.setQueryData(['fields'], (prevFields) => [
        ...prevFields, // Asegurarse de que prevFields sea un arreglo
        {
          ...newFieldInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
     onSettled: () => {queryClient.invalidateQueries({ queryKey: ['fields'] });} //refetch Fields after mutation
  });
}

//UPDATE hook (put Field in api)
function useUpdateField() {
  const queryClient = useQueryClient();
  return useMutation( {
   
    mutationFn: async ({ id, ...Field }) => {
      try {
        // Intenta enviar la solicitud de creación a la API
        const response = await axios.post(`${BASE_URL}/fields/update/${id}`, Field);
        toast.success('Campo creado exitosamente');
        return response.data; // Retorna los datos de la respuesta
      } catch (error) {
        // Maneja cualquier error que ocurra durante la solicitud
        console.error('Error al crear el campo:', error.response ? error.response.data : error.message);
        toast.error(`Error al crear el campo: ${error.response ? error.response.data.message : error.message}`);
        throw error; // Relanza el error para que useMutation pueda manejarlo
      }
    },
    //client side optimistic update
    onMutate: (newFieldInfo) => {
      queryClient.setQueryData(['fields'], (prevFields) =>
        prevFields?.map((prevField) =>
          prevField.id === newFieldInfo.id ? newFieldInfo : prevField,
        ),
      );
    },

    // onSettled: () => {queryClient.invalidateQueries({ queryKey: ['fields'] });}
     //refetch Fields after mutation
  });
}

//DELETE hook (delete Field in api)
function useDeleteField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (FieldId) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (FieldId) => {
      queryClient.setQueryData(['Fields'], (prevFields) =>
        prevFields?.filter((Field) => Field.id !== FieldId),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['Fields'] }), //refetch Fields after mutation, disabled for demo
  });
}

const queryClient = new QueryClient();

const Table = ({ data, idContract }) => {
  if (!data) return null
  //tomo las fields y las ordeno segun su step
  const fields = data.fields.sort((a, b) => a.step - b.step);
  const idSheet = data.idSheet

  return (<QueryClientProvider client={queryClient}>
    <TableP fields={fields} idSheet={idSheet} idContract={idContract} />
  </QueryClientProvider>);


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

function validateField(Field) {
  return {
    name: !validateRequired(Field.name)? ' Name is Required': '',
    description: !validateRequired(Field.description) ? 'description is Required' : '',
    field_type: !validateRequired(Field.field_type) ? 'field_type is Required' : '',
    //step: !validateRequired(Field.step) ? 'step is Required' : '',  //para el step hay que crear una validación especial ya que al ser numero no me tira el length
  };
}


