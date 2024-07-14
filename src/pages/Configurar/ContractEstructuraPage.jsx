import React, { useEffect, useState, createContext, useContext } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import TableEstructure from '../../Components/Containers/Configurar/Contracts/PagesEstructure/TableEstructure'
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';
import { StepsProvider, useSteps } from '../../Components/Containers/Configurar/Contracts/PagesEstructure/StepsContext';




// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];



const ContractFormato = ({ onSubmit, users, companies }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const { steps } = useSteps();

  const { setSteps } = useSteps(); // Destructure to get setTableData

  const { id } = useParams();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  useEffect(() => {
    fetchStepsAndFields();

  }, [id]);

  const fetchStepsAndFields = async () => {

    if (steps.length === 0) {
      try {
        const response = await axios.get(`${BASE_URL}/contracts/${id}/dailySheet`)

        setSteps(response.data.steps);

      } catch (error) {
        console.error('Error al obtener pasos y campos:', error);
      }
    }
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const handleNext = () => {

    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? activeStep + 0
        : activeStep + 1;
    setActiveStep(newActiveStep);

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {

    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const sendData = async () => {

    console.log('Data sent to API:', steps);
    //console.log('tabledata', useTableData);

  };

  const stepStyle = {
    boxShadow: 2,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 2,
    "& .Mui-active": {
      "&.MuiStepIcon-root": {
        color: "warning.main",
        fontSize: "2rem",
      },
      "& .MuiStepConnector-line": {
        borderColor: "warning.main"
      }
    },
    "& .Mui-completed": {
      "&.MuiStepIcon-root": {
        color: "secondary.main",
        fontSize: "2rem",
      },
      "& .MuiStepConnector-line": {
        borderColor: "secondary.main"
      }
    }
  }

  return (
    <Box
      // onSubmit=""
      sx={{ width: '90%', margin: '0 auto' }}
    >
      <h2>Modificar Estructura Daily   </h2>

      <Button variant="contained"  onClick={sendData}>
        Guardar Datos
      </Button>
      <Box
        component="form"
        // onSubmit=""
        sx={{ width: '95%', margin: '0 auto' }}
      >
        <Box sx={{ width: '100%' }}>
          <Stepper nonLinear activeStep={activeStep} >
            {steps.map((label, index) => (
              <Step key={label.idSheet} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label.sheet}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>

            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleNext} disabled={isLastStep()} sx={{ mr: 1 }}>
                  Next
                </Button>

              </Box>
              <Grid
                item
                xs={12}
                sx={{ padding: '20px' }}
              >
                <TableEstructure
                  key={activeStep}
                  data={steps[activeStep]}
                  currentStep={activeStep}
                  idContract={id}
                />
              </Grid>

            </React.Fragment>

          </div>
        </Box>
      </Box>
    </Box>
  );
}

export default () => (
  <StepsProvider>
      <ContractFormato />
  </StepsProvider>
);

