import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getNearestReports,
  getNeighborhoodsWithReports,
} from "../core/requests";
import { useNeighborhood } from "../core/NeighborhoodContext";
import { useOccurrences } from "../core/ReportsContext";

const NearbyReports = ({ position }) => {
  const [searchType, setSearchType] = useState("ocorrencias"); 
  const [radius, setRadius] = useState(10000); 
  const [minOccurrences, setMinOccurrences] = useState(1); 
  const [limit, setLimit] = useState(5); 
  const { updateNeighborhood } = useNeighborhood();
  const { updateOccurrences } = useOccurrences();


  const {
    data: radiusData,
    isFetching: isRadiusFetching,
    refetch: fetchRadiusNeighborhoods,
  } = useQuery({
    queryKey: ["radiusNeighborhoods", radius, minOccurrences, position],
    queryFn: async () => {
      const params = new URLSearchParams({
        longitude: position.lng,
        latitude: position.lat,
        raio: radius,
        min: minOccurrences,
      });
      const response = await getNeighborhoodsWithReports(params.toString());
      return response.data;
    },
    enabled: false,
  });


  const {
    data: nearbyData,
    isFetching: isNearbyFetching,
    refetch: fetchNearbyOccurrences,
  } = useQuery({
    queryKey: ["nearbyOccurrences", limit, position],
    queryFn: async () => {
      const params = new URLSearchParams({
        longitude: position.lng,
        latitude: position.lat,
        limit: limit,
      });
      const response = await getNearestReports(params.toString());
      return response.data;
    },
    enabled: false, 
  });


  useEffect(() => {
    if (radiusData) {
      console.log("Dados de bairros recebidos:", radiusData);
      updateNeighborhood(radiusData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radiusData]);

  useEffect(() => {
    if (nearbyData) {
      console.log("Dados de ocorrências recebidos:", nearbyData);
      updateOccurrences(nearbyData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearbyData]);


  const handleSearch = () => {
    if (searchType === "bairros") {
      fetchRadiusNeighborhoods();
    } else {
      fetchNearbyOccurrences();
    }
  };

  return (
    <div className="">
      <h2 className="text-base font-sans font-medium text-gray-800 mb-4">
        {searchType === "ocorrencias"
          ? `Buscar ${limit}  ${
              limit === 1
                ? "ocorrência mais próxima"
                : "ocorrências mais próximas"
            } `
          : `
        Buscar bairros em um raio de ${radius} metros que possui pelo menos ${minOccurrences} ${
              minOccurrences === 1 ? "ocorrência" : "ocorrências"
            }
       `}
      </h2>

  
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tipo de Busca</label>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="ocorrencias">Ocorrências mais próximas</option>
          <option value="bairros">Bairros próximos com ocorrências</option>
        </select>
      </div>

      {searchType === "bairros" ? (
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
          <div>
            <label className="block text-sm font-medium mb-1">
              Mínimo de Ocorrências
            </label>
            <input
              type="number"
              disabled={isRadiusFetching}
              value={minOccurrences}
              onChange={(e) => setMinOccurrences(Number(e.target.value))}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">
            Limite de Ocorrências
          </label>
          <input
            type="number"
            value={limit}
            disabled={isNearbyFetching}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      )}

      <button
        onClick={handleSearch}
        disabled={isRadiusFetching || isNearbyFetching}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-200 disabled:text-black"
      >
        {isRadiusFetching || isNearbyFetching ? "Buscando..." : "Buscar"}
      </button>
    </div>
  );
};

export default NearbyReports;
