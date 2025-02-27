import { createContext, useContext, useState } from "react";

export const InstitutionContext = createContext();

export const InstitutionProvider = ({ children }) => {
  const [institutions, setInstitutions] = useState([]);

  const updateInstitutions = (newInstitution) => {
    console.log("Bairros recebidas:", newInstitution);
    setInstitutions(newInstitution);
  };

  return (
    <InstitutionContext.Provider value={{ institutions, updateInstitutions }}>
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = () => {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error("useInstitution must be used within a InstitutionProvider");
  }
  return context;
};


