import React, { useMemo, useState, forwardRef } from 'react';
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
import { useSteps } from './StepsContext';


//list of field types
const ListTypes = [
  'text',
  'integer',
  'list',
  'hour',
  'date'
];


const Table = ({ handleCreateField, handleSaveField, openDeleteConfirmModal }) => {
  const [validationErrors, setValidationErrors] = useState({});

  const { steps } = useSteps();
  const { setSteps } = useSteps();


  const columns = useMemo(
    () => [
      {
        accessorKey: 'idSheet',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'sheet',
        header: 'Nombre Hoja',
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
          type: 'number', // set the type to 'number' for numeric input
        },
      }
    ],
    [validationErrors],
  );

  const table = useMaterialReactTable({
    columns,
    data: steps,
    createDisplayMode: 'row', //default ('row', and 'custom' are also available)
    editDisplayMode: 'row', //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    initialState: { columnVisibility: { id: false } },
    getRowId: (row) => row.id,
    /* 
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
    },*/
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
      <Box>
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
          Crear nueva Hoja
        </Button>
      </Box>
    ),
    /*  state: { 
      isLoading: isLoadingFields,
      isSaving: isCreatingField || isUpdatingField || isDeletingField,
      showAlertBanner: isLoadingFieldsError,
      showProgressBars: isFetchingFields,
       }, 
    */
  });

  return <MaterialReactTable table={table} />;
};


const queryClient = new QueryClient();

const TableHojas = forwardRef((props, ref) => {

  const { steps } = useSteps();
  const { setSteps } = useSteps();
  //tomo las fields y las ordeno segun su step
  console.log(steps);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCreateField = async ({ values, table }) => {
    const newValidationErrors = validateField(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    const stepValueAsInteger = parseInt(values.step, 10);
    // Generar un ID temporal para el nuevo campo
    const newField = {
      ...values,
      step: stepValueAsInteger,
      idSheet: (Math.random() + 1).toString(36).substring(7),
    };

    // Crear una copia profunda de steps para evitar mutaciones directas
    let newSteps = [...steps];
    // Asegurarse de que el objeto en el currentStep exista y tenga un arreglo de fields
    if (newSteps && Array.isArray(newSteps)) {
      newSteps = [...newSteps, newField];
    } else {
      // Si no existe, inicializarlo con el nuevo campo
      //newSteps = { fields: [newField] };
    }
    setSteps(newSteps); // Actualizar el estado global

    table.setCreatingRow(null); // Exit creating mode
  };

  const handleSaveField = async ({ values, table, row }) => {
    const newValidationErrors = validateField(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    let newSteps = [...steps];
    newSteps = steps.map((sheet) =>
      sheet.idSheet === row.original.idSheet ? { ...sheet, ...values } : sheet
    );
    setSteps(newSteps); // Actualizar el estado global
    table.setEditingRow(null); // Exit editing mode
  };

  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this Field?')) {
      let newSteps = [...steps];
      console.log('row', row);
      newSteps = steps.filter((sheet) => sheet.idSheet !== row.original.idSheet);
      console.log('newSteps:', newSteps);

      setSteps(newSteps); // Update local state
    }
  };


  const sendData = async () => {
    console.log('Data sent to API:', steps[currentStep]);
    //console.log('tabledata', useTableData);
  };
  return (
    <Box
    // onSubmit=""
    sx={{ width: '100%', margin: '0 auto', justifyContent: 'center', alignItems: 'center' }}
  >
    <h2>Modificar Hojas Daily Report</h2>
    <QueryClientProvider client={queryClient}>
      <Table
        handleCreateField={handleCreateField}
        handleSaveField={handleSaveField}
        openDeleteConfirmModal={openDeleteConfirmModal} />
    </QueryClientProvider>
    </Box>);
   

});



export default TableHojas;

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
    sheet: !validateRequired(Field.sheet) ? ' Name is Required' : '',
    //step: !validateRequired(Field.step) ? 'step is Required' : '',  //para el step hay que crear una validación especial ya que al ser numero no me tira el length
  };
}


