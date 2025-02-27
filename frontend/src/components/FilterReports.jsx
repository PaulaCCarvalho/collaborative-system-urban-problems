import { useForm } from "react-hook-form";
import { MdOutlineArrowDropUp, MdOutlineArrowDropDown } from "react-icons/md";
import { FaRoadCircleExclamation } from "react-icons/fa6";
import { LuUtilityPole } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useOccurrences } from "../core/ReportsContext";
import { useQuery } from "@tanstack/react-query";
import { listReports, getOccurrenceCountByType } from "../core/requests"; 

const FilterReports = () => {
  const [activeAccordion, setActiveAccordion] = useState(false);
  const [submittedFilters, setSubmittedFilters] = useState({
    tipos: ["buraco", "iluminacao_publica"],
  });
  const { updateOccurrences } = useOccurrences();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      tipos: ["buraco", "iluminacao_publica"],
      status: "",
      days: "",
    },
  });

  const { data, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: ["ocorrencias", submittedFilters],
    queryFn: async () => await listReports(submittedFilters),
    enabled: Object.keys(submittedFilters).length > 0,
  });

  const { data: countData } = useQuery({
    queryKey: ["occurrenceCounts"],
    queryFn: getOccurrenceCountByType,
  });

  useEffect(() => {
    if (isSuccess) {
      updateOccurrences(data.data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isError) {
      console.error("Erro ao buscar ocorrências:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (Object.keys(submittedFilters).length === 0) {
      updateOccurrences([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedFilters]);

  const onSubmit = (data) => {
    setSubmittedFilters(data);
  };

  const handleResetFilters = () => {
    reset({
      tipos: [],
      status: "",
      days: "",
    });
    setSubmittedFilters({});
  };

  return (
    <div className="mx-4 mt-9">
      <button
        className="flex items-center justify-between w-full p-2 bg-gray-100 rounded cursor-pointer"
        onClick={() => setActiveAccordion((prev) => !prev)}
      >
        <span className="text-md font-semibold">Listar ocorrências</span>
        {activeAccordion ? (
          <MdOutlineArrowDropUp />
        ) : (
          <MdOutlineArrowDropDown />
        )}
      </button>

      {activeAccordion && (
        <form onSubmit={handleSubmit(onSubmit)} className="m-2">
          <div>
            <span className="text-sm font-sans font-semibold text-start">
              Tipo da ocorrência
            </span>
            <hr className="border-gray-300 w-full" />

            <div className="mt-2 pl-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="buraco"
                  {...register("tipos")}
                  className="form-checkbox rounded text-gray-700"
                />
                <FaRoadCircleExclamation className="text-gray-700" />
                <span>
                  Buracos
                  <span className="text-gray-600 font-light">
                    {countData.data && ` (${countData.data.buraco})`}
                  </span>
                </span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value="iluminacao_publica"
                  {...register("tipos")}
                  className="form-checkbox rounded text-gray-700"
                />
                <LuUtilityPole className="text-gray-700" />
                <span>
                  Iluminação Pública
                  <span className="text-gray-600 font-light">
                    {countData.data &&
                      ` (${countData.data.iluminacao_publica})`}
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="my-2">
            <span className="text-sm font-sans">Status da ocorrência</span>
            <hr className="border-gray-300 w-full" />

            <div className="mt-2">
              <select
                {...register("status")}
                className="w-full p-1.5 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-2 focus:ring-gray-700 bg-white text-gray-800"
              >
                <option value="">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Em manutenção">Em manutenção</option>
                <option value="Manutenção concluída">
                  Manutenção concluída
                </option>
                <option value="Validada">Validada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-sm font-sans">Últimos registros</span>
            <hr className="border-gray-300 w-full" />

            <div className="mt-2">
              <select
                {...register("days")}
                className="w-full p-1.5 border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-2 focus:ring-gray-700 bg-white text-gray-800"
              >
                <option value="">Todos</option>
                <option value="7">Últimos 7 dias</option>
                <option value="15">Últimos 15 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>
            </div>
          </div>

          <div className="space-x-2">
            <button
              type="submit"
              className="w-full mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {isFetching ? "Carregando..." : "Aplicar Filtros"}
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FilterReports;
