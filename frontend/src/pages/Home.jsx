import { useState } from "react";
import { useOccurrences } from "../core/ReportsContext";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Map from "../components/Map";
import { useRegions } from "../core/RegionsContext";
import { useNeighborhood } from "../core/NeighborhoodContext";
import { useInstitution } from "../core/InstitutionContext";

function Home() {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [sidebarType, setSidebarType] = useState(null); 

  const { occurrences, updateOccurrences } = useOccurrences();
  const { neighborhoods } = useNeighborhood();
  const { institutions } = useInstitution();
  const { regions } = useRegions();

  const handleNewOccurrence = (newOccurrence) => {
    updateOccurrences([...occurrences, newOccurrence]);
  };

  const handleCloseSidebar = () => {
    setSidebarType(null);
    setSelectedFilter(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <Menu setSidebarType={setSidebarType} />
      {/* Container principal */}
      <div
        className={`flex-1 flex relative mt-16 ${
          sidebarType ? "overflow-hidden" : ""
        }`}
      >
        {/* Mapa */}
        <div
          className={`transition-all duration-300 ${
            sidebarType ? "w-3/4" : "w-full"
          }`}
        >
          <Map
            occurrences={occurrences}
            onOccurrenceAdded={handleNewOccurrence}
            regions={regions}
            neighborhoods={neighborhoods}
            institutions={institutions}
          />
        </div>

        {/* Sidebar */}
        {sidebarType && (
          <div className="transition-all duration-300 w-1/4">
            <Sidebar
              sidebarType={sidebarType}
              onClose={handleCloseSidebar}
              filter={selectedFilter}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
