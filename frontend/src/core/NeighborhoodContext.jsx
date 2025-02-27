import { createContext, useContext, useState } from "react";

export const NeighborhoodContext = createContext();

export const NeighborhoodProvider = ({ children }) => {
  const [neighborhoods, setNeighborhoods] = useState([]);

  const updateNeighborhood = (newNeighborhood) => {
    console.log("Bairros recebidas:", newNeighborhood);
    setNeighborhoods(newNeighborhood);
  };

  return (
    <NeighborhoodContext.Provider value={{ neighborhoods, updateNeighborhood }}>
      {children}
    </NeighborhoodContext.Provider>
  );
};

export const useNeighborhood = () => {
  const context = useContext(NeighborhoodContext);
  if (!context) {
    throw new Error("useNeighborhood must be used within a NeighborhoodProvider");
  }
  return context;
};


