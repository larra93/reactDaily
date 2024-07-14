import React, { createContext, useContext, useState } from 'react';

const StepsContext = createContext();

export const useSteps = () => useContext(StepsContext);

export const StepsProvider = ({ children }) => {
  const [steps, setSteps] = useState([]);

  return (
    <StepsContext.Provider value={{ steps, setSteps }}>
      {children}
    </StepsContext.Provider>
  );
};

