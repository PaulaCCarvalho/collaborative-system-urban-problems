import { MdOutlineArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDensityNeighborhoods } from "../core/requests";
import { useNeighborhood } from "../core/NeighborhoodContext";

const DensityNeighborhood = () => {
  const [activeAccordion, setActiveAccordion] = useState(false);
  const [showDensity, setShowDensity] = useState(false);
  const [expandedNeighborhood, setExpandedNeighborhood] = useState(null);
  const { updateNeighborhood, neighborhoods } = useNeighborhood();

  const { data, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: ["neighborhood"],
    queryFn: getDensityNeighborhoods,
    enabled: showDensity,
  });

  useEffect(() => {
    if (isSuccess && data) {
      console.log("Dados recebidos com sucesso:", data);
      updateNeighborhood(data.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.error("Erro ao buscar bairros:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!showDensity) {
      updateNeighborhood([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDensity]);

  const handleToggleDensity = () => {
    setShowDensity((prev) => !prev);
  };

  const topNeighborhoods = neighborhoods
    .sort((a, b) => b.metricas.total_ocorrencias - a.metricas.total_ocorrencias)
    .slice(0, 3);

  return (
    <div className="mx-4 my-4">
      <button
        className="flex items-center justify-between w-full p-2 bg-gray-100 rounded cursor-pointer"
        onClick={() => setActiveAccordion((prev) => !prev)}
      >
        <span className="text-md font-semibold text-start">
          Ocorrências por bairros
        </span>
        {activeAccordion ? (
          <MdOutlineArrowDropUp />
        ) : (
          <MdOutlineArrowDropDown />
        )}
      </button>

      {activeAccordion && (
        <div className="flex items-center flex-col mt-2">
          <form className="my-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showDensity}
                onChange={handleToggleDensity}
                className="form-checkbox rounded text-gray-700"
              />
              <span className="text-sm font-sans">
                Visualizar densidade de ocorrências por bairros
              </span>
            </label>

            {isFetching && (
              <div className="flex items-center justify-center my-2">
                <span className="text-xs font-medium justify-center">
                  Carregando...
                </span>
              </div>
            )}
          </form>

          {topNeighborhoods.length > 0 && (
            <>
              <span className="text-sm font-sans font-semibold text-start">
                Bairros com maior número de ocorrências registradas
              </span>
              <hr className="border-gray-300 w-full mt-1.5 mb-3" />
              <div className="flex flex-col w-full">
                {topNeighborhoods.map((neighborhood) => (
                  <div
                    key={neighborhood.bairro.id}
                    className="flex flex-col border border-gray-200 rounded-lg p-2 mb-2"
                  >
                    <button
                      className="flex items-center justify-between w-full"
                      onClick={() =>
                        setExpandedNeighborhood(
                          expandedNeighborhood === neighborhood.bairro.id
                            ? null
                            : neighborhood.bairro.id
                        )
                      }
                    >
                      <span className="text-sm font-sans">
                        <strong>Bairro:</strong> {neighborhood.bairro.nome}
                      </span>
                      {expandedNeighborhood === neighborhood.bairro.id ? (
                        <MdOutlineArrowDropUp />
                      ) : (
                        <MdOutlineArrowDropDown />
                      )}
                    </button>

                    {expandedNeighborhood === neighborhood.bairro.id && (
                      <div className="mt-2">
                        <span className="text-sm font-sans block">
                          <strong>N.º de ocorrências registradas: </strong>
                          {neighborhood.metricas.total_ocorrencias}
                        </span>
                        <span className="text-sm font-sans block">
                          <strong>Densidade de ocorrência:</strong>{" "}
                          {neighborhood.metricas.densidade_km2} ocorrências/km²
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Seção de todos os bairros */}

          {neighborhoods.length > 0 && (
            <>
              <span className="text-sm font-sans font-semibold text-start mt-4">
                Todos os bairros
              </span>
              <hr className="border-gray-300 w-full mt-1.5 mb-3" />
              <div className="flex flex-col w-full">
                {neighborhoods.map((neighborhood) => (
                  <div
                    key={neighborhood.bairro.id}
                    className="flex flex-col border border-gray-200 rounded-lg p-2 mb-2"
                  >
                    <button
                      className="flex items-center justify-between w-full"
                      onClick={() =>
                        setExpandedNeighborhood(
                          expandedNeighborhood === neighborhood.bairro.id
                            ? null
                            : neighborhood.bairro.id
                        )
                      }
                    >
                      <span className="text-sm font-sans">
                        <strong>Bairro:</strong> {neighborhood.bairro.nome}
                      </span>
                      {expandedNeighborhood === neighborhood.bairro.id ? (
                        <MdOutlineArrowDropUp />
                      ) : (
                        <MdOutlineArrowDropDown />
                      )}
                    </button>

                    {expandedNeighborhood === neighborhood.bairro.id && (
                      <div className="mt-2">
                        <span className="text-sm font-sans block">
                          <strong>N.º de ocorrências registradas: </strong>
                          {neighborhood.metricas.total_ocorrencias}
                        </span>
                        <span className="text-sm font-sans block">
                          <strong>Densidade de ocorrência:</strong>{" "}
                          {neighborhood.metricas.densidade_km2} ocorrências/km²
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DensityNeighborhood;
