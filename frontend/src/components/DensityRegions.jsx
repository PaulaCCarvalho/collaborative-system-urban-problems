import { MdOutlineArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDensityRegions, getRegionsRanking } from "../core/requests";
import { useRegions } from "../core/RegionsContext";

const DensityRegions = () => {
  const [activeAccordion, setActiveAccordion] = useState(false);
  const [showDensity, setShowDensity] = useState(false);
  const [showRanking, setShowRanking] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState(null);
  const { updateRegions, regions } = useRegions();

  const { data: densityData, isFetching: isDensityFetching } = useQuery({
    queryKey: ["regionsDensity"],
    queryFn: getDensityRegions,
    enabled: showDensity,
  });

  const { data: rankingData, isFetching: isRankingFetching } = useQuery({
    queryKey: ["regionsRanking"],
    queryFn: getRegionsRanking,
    enabled: showRanking,
  });

  useEffect(() => {
    if (showDensity && densityData) {
      updateRegions(densityData.data);
    } else if (showRanking && rankingData) {
      updateRegions(rankingData.data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [densityData, rankingData, showDensity, showRanking]);

  useEffect(() => {
    if (!showDensity && !showRanking) {
      updateRegions([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDensity, showRanking]);

  const handleToggleDensity = () => {
    setShowDensity((prev) => !prev);
    setShowRanking(false);
  };

  const handleToggleRanking = () => {
    setShowRanking((prev) => !prev);
    setShowDensity(false); 
  };

  return (
    <div className="mx-4 my-4">
      <button
        className="flex items-center justify-between w-full p-2 bg-gray-100 rounded cursor-pointer"
        onClick={() => setActiveAccordion((prev) => !prev)}
      >
        <span className="text-md font-semibold text-start">
          Ocorrências por região
        </span>
        {activeAccordion ? (
          <MdOutlineArrowDropUp />
        ) : (
          <MdOutlineArrowDropDown />
        )}
      </button>

      {activeAccordion && (
        <div className="flex items-center flex-col mt-2">
          <form className="my-3 space-y-3">
            {/* Checkbox para densidade */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showDensity}
                onChange={handleToggleDensity}
                className="form-checkbox rounded text-gray-700"
              />
              <span className="text-sm font-sans">
                Visualizar densidade de ocorrências
              </span>
            </label>

            {/* Novo checkbox para ranking */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showRanking}
                onChange={handleToggleRanking}
                className="form-checkbox rounded text-gray-700"
              />
              <span className="text-sm font-sans">
                Visualizar ranking por tipo de ocorrência
              </span>
            </label>

            {(isDensityFetching || isRankingFetching) && (
              <div className="flex items-center justify-center my-2">
                <span className="text-xs font-medium justify-center">
                  Carregando...
                </span>
              </div>
            )}
          </form>

          {regions?.length > 0 && (
            <div className="flex flex-col w-full">
              {regions.map((region) => (
                <div
                  key={region.regiao.id}
                  className="flex flex-col border border-gray-200 rounded-lg p-2 mb-2"
                >
                  <button
                    className="flex items-center justify-between w-full"
                    onClick={() =>
                      setExpandedRegion(
                        expandedRegion === region.regiao.id
                          ? null
                          : region.regiao.id
                      )
                    }
                  >
                    <span className="text-sm font-sans">
                      {region.regiao.nome} - {region.regiao.sigla}
                    </span>
                    {expandedRegion === region.regiao.id ? (
                      <MdOutlineArrowDropUp />
                    ) : (
                      <MdOutlineArrowDropDown />
                    )}
                  </button>

                  {expandedRegion === region.regiao.id && (
                    <div className="mt-2 space-y-2">
                      {/* Conteúdo condicional baseado no tipo de visualização */}
                      {showDensity && (
                        <>
                          <div className="text-sm">
                            <strong>Ocorrências totais:</strong>{" "}
                            {region.metricas.total}
                          </div>
                          <div className="text-sm">
                            <strong>Densidade:</strong>{" "}
                            {region.metricas.densidade}/km²
                          </div>
                        </>
                      )}

                      {showRanking && (
                        <>
                          <div className="text-sm">
                            <strong>Buracos:</strong>{" "}
                            {region?.ocorrencias?.buracos}
                          </div>
                          <div className="text-sm">
                            <strong>Iluminação Pública:</strong>{" "}
                            {region?.ocorrencias?.iluminacao_publica}
                          </div>
                          <div className="text-sm">
                            <strong>Total:</strong> {region.ocorrencias.total}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DensityRegions;
