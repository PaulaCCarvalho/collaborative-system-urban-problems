import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNearbyInstitutions } from "../core/requests";
import { useInstitution } from "../core/InstitutionContext";

const NearbyInstituions = ({ position }) => {
  const [radius, setRadius] = useState(400); 
  const { updateInstitutions } = useInstitution();

  const {
    data: radiusData,
    isFetching: isRadiusFetching,
    refetch: fetchRadiusInstitutions,
  } = useQuery({
    queryKey: ["radiusInstitutions", radius, position],
    queryFn: async () => {
      const params = new URLSearchParams({
        longitude: position.lng,
        latitude: position.lat,
        raio: radius,
      });
      const response = await getNearbyInstitutions(params.toString());
      return response.data;
    },
    enabled: false, 
  });

  useEffect(() => {
    if (radiusData) {
      console.log("Dados de instituições recebidos:", radiusData);
      updateInstitutions(radiusData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radiusData]);

  const handleSearch = () => {
    fetchRadiusInstitutions();
  };

  return (
    <div className="">
      <h2 className="text-base font-sans font-medium text-gray-800 mb-4">
        {`Buscar instituições em um raio de ${radius} metros`}
      </h2>

      <div className="mb-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Raio (metros)
            </label>
            <input
              type="number"
              value={radius}
              disabled={isRadiusFetching}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
    
        <button
          onClick={handleSearch}
          disabled={isRadiusFetching}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:text-black"
        >
          {isRadiusFetching ? "Buscando..." : "Buscar"}
        </button>
      </div>
    </div>
  );
};

export default NearbyInstituions;
