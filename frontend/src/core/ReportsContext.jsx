import { createContext, useContext, useState } from "react";

export const OccurrencesContext = createContext();

export const OccurrencesProvider = ({ children }) => {
  const [occurrences, setOccurrences] = useState([]);

  const updateOccurrences = (newOccurrences) => {
    console.log("Ocorrências recebidas:", newOccurrences);
    setOccurrences(newOccurrences);
  };

  return (
    <OccurrencesContext.Provider value={{ occurrences, updateOccurrences }}>
      {children}
    </OccurrencesContext.Provider>
  );
};

export const useOccurrences = () => {
  const context = useContext(OccurrencesContext);
  if (!context) {
    throw new Error(
      "useOccurrences must be used within an OccurrencesProvider"
    );
  }
  return context;
};
