import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import AddReport from "./AddReport";
import NearbyReports from "./NearbyReports";
import NearbyInstituions from "./NearbyInstitutions";

const MenuPopup = ({ onAdd, icon }) => {
  const [position, setPosition] = useState(null);
  const [popupOpen, setPopupOpen] = useState(true);
  const [mode, setMode] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setPopupOpen(true);
      setMode(null);
    },
  });

  const handleClick = (e, mode) => {
    e.stopPropagation()
    setMode(mode)
  }

  if (!position) return;

  return (
    <Marker position={position} icon={icon}>
      <Popup onClose={() => setPopupOpen(false)}>
        <div className="max-h-[72vh] w-76 overflow-auto">
          {mode === null && (
            <div className="flex flex-col justify-center p-2">
              <h3 className="text-xl font-semibold text-gray-700 mb-3 text-center">
                O que você deseja fazer?
              </h3>
              <button
                type="button"
                className="w-full bg-blue-500 text-white py-3 px-2 rounded-lg hover:bg-blue-700 transform transition-transform duration-300 hover:scale-102 mb-1 cursor-pointer"
                onClick={(e) => handleClick(e, "register")}
              >
                <span className="text-sm font-sans font-medium">
                  Registrar Ocorrência
                </span>
              </button>
              <button
                type="button"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transform transition-transform duration-300 hover:scale-102 mb-1 cursor-pointer"
                onClick={(e) => handleClick(e, "search-occurences")}
              >
                <span className="text-sm font-sans font-medium">
                  Buscar informações de ocorrências próximas
                </span>
              </button>

              <button
                type="button"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transform transition-transform duration-300 hover:scale-102 cursor-pointer"
                onClick={(e) => handleClick(e, "search-institutions")}
              >
                <span className="text-sm font-sans font-medium">
                  Buscar informações de instituições de ensino e saúde próximas
                </span>
              </button>
            </div>
          )}

          {mode === "register" && (
            <AddReport
              onAdd={onAdd}
              position={position}
              setPosition={setPosition}
              setPopupOpen={setPopupOpen}
            />
          )}

          {mode === "search-occurences" && (
            <NearbyReports position={position} />
          )}

          {mode === "search-institutions" && (
            <NearbyInstituions position={position} />
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default MenuPopup;
