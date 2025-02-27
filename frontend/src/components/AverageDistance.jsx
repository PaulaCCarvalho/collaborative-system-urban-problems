import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";
import { getAverageDistance } from "../core/requests"; 

const AverageDistance = () => {
  const [activeAccordion, setActiveAccordion] = useState(false);

  const {
    data: averageDistances,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["averageDistance"],
    queryFn: async () => {
        const response = await getAverageDistance()
        return response.data
    },
  });

  return (
    <div className="mx-4 my-4">
      <button
        className="flex items-center justify-between w-full p-2 bg-gray-100 rounded cursor-pointer"
        onClick={() => setActiveAccordion((prev) => !prev)}
      >
        <span className="text-md font-semibold text-start">
          Média de distância entre ocorrências
        </span>
        {activeAccordion ? (
          <MdOutlineArrowDropUp />
        ) : (
          <MdOutlineArrowDropDown />
        )}
      </button>

      {activeAccordion && (
        <div className="flex items-center flex-col mt-2">
          {isFetching ? (
            <p className="text-gray-500">Carregando...</p>
          ) : isError ? (
            <p className="text-red-500">
              Erro ao carregar dados: {error.message}
            </p>
          ) : averageDistances?.length > 0 ? (
            <div className="w-full">
              {averageDistances.map((item) => (
                <div
                  key={item.tipo}
                  className="flex flex-col border border-gray-200 rounded-lg p-2 mb-2"
                >
                  <p className="text-sm font-semibold text-gray-800">
                    Tipo: {item.tipo}
                  </p>
                  <p className="text-sm text-gray-700">
                    Média de Distância: {item.media_distancia} metros
                  </p>
                  <p className="text-sm text-gray-700">
                    Total de Pares Analisados: {item.total_pares_analisados}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nenhum dado disponível.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AverageDistance;
