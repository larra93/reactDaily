import React, { useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router-dom';
import { Grid, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import Personal from '../../Components/Containers/Configurar/Contracts/PagesEstructure/TablePersonal'
import Maquinarias from '../../Components/Containers/Configurar/Contracts/PagesEstructure/TablePersonal'
import Interferencias from '../../Components/Containers/Configurar/Contracts/PagesEstructure/TablePersonal'
import axios from 'axios';
import { BASE_URL } from '../../helpers/config';



// const steps = ['Select campaign settings', 'Create an ad group', 'Create an ad'];

const ContractFormato = ({ onSubmit, users, companies }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [steps, setSteps] = useState([]);


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
  try {
      const response = await axios.get(`${BASE_URL}/contracts/${id}/dailySheet`)
      setSteps(response.data.steps);
      console.log('response', response.data.steps)
  } catch (error) {
      console.error('Error al obtener pasos y campos:', error);
  }
};

const handleStepClick = (index) => {
  setActiveStep(index);
};

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
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

  const formContent = (step) => {
    switch(step) {
      case 0:
        return <Personal  />;
      case 1:
        return <Maquinarias  />;
      case 2:
        return <Interferencias  />;
      default:
        return <div>404: Not Found</div>
    }
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
    <div>
      <h2>Crear Contrato</h2>
      <Box
        component="form"
       // onSubmit=""
        sx={{ width: '90%', margin: '0 auto' }}
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
            {allStepsCompleted() ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>Reset</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                  Step {activeStep + 1}
                </Typography>
                <Grid
                  item
                  xs={12}
                  sx={{ padding: '20px' }}
                >
                  {formContent(activeStep)}
                </Grid>
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
                  <Button onClick={handleNext} sx={{ mr: 1 }}>
                    Next
                  </Button>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography variant="caption" sx={{ display: 'inline-block' }}>
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : (
                      <Button onClick={handleComplete}>
                        {completedSteps() === totalSteps() - 1
                          ? 'Finish'
                          : 'Complete Step'}
                      </Button>
                    ))}
                </Box>
              </React.Fragment>
            )}
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default ContractFormato;