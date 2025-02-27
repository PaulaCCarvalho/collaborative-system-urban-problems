import { createContext, useContext, useState } from "react";

export const RegionsContext = createContext();

export const RegionsProvider = ({ children }) => {
  const [regions, setRegions] = useState([]);

  const updateRegions = (newRegions) => {
    console.log("Regiões recebidas:", newRegions);
    setRegions(newRegions);
  };

  return (
    <RegionsContext.Provider value={{ regions, updateRegions }}>
      {children}
    </RegionsContext.Provider>
  );
};

export const useRegions = () => {
  const context = useContext(RegionsContext);
  if (!context) {
    throw new Error("useRegions must be used within a RegionsProvider");
  }
  return context;
};
