import { useMutation } from "@tanstack/react-query";
import { addReport } from "../core/requests";
import { useForm } from "react-hook-form";
import { useState } from "react";

const AddReport = ({ onAdd, position, setPosition, setPopupOpen }) => {
  const { register, handleSubmit, reset } = useForm();
  const [problemType, setProblemType] = useState("buraco");

  const { mutate, isPending } = useMutation({
    mutationFn: addReport,
    onSuccess: (response) => {
      onAdd(response.data);
      reset();
      setPosition(null);
      setPopupOpen(false);
    },
    onError: (error) => {
      console.error("Erro ao cadastrar ocorrência:", error);
    },
  });

  const onSubmit = async (data) => {
    if (!position) return;

    const occurrenceData = {
      titulo: data.titulo,
      longitude: position.lng,
      latitude: position.lat,
      problema: {
        tipo: problemType,
        descricao: data.descricao,
        ...(problemType === "buraco" && {
          comprimento: parseFloat(data.comprimento),
          largura: parseFloat(data.largura),
          profundidade: parseFloat(data.profundidade),
        }),
        ...(problemType === "iluminacao_publica" && {
          status: data.status,
        }),
      },
    };

    mutate(occurrenceData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-1 space-y-3">
      <h3 className="text-base font-sans font-medium text-gray-800">
        Forneça mais detalhes sobre a ocorrência
      </h3>
      <div>
        <label className="text-sm font-sans font-medium text-gray-700">
          Título
        </label>
        <input
          {...register("titulo", { required: true })}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-sans font-medium text-gray-700">
          Tipo de Problema
        </label>
        <select
          value={problemType}
          onChange={(e) => setProblemType(e.target.value)}
          className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="buraco">Buraco</option>
          <option value="iluminacao_publica">Iluminação Pública</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-sans font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register("descricao", { required: true })}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {problemType === "buraco" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div>
              <label className="text-sm font-sans font-medium text-gray-700">
                Comprimento (m)
              </label>
              <input
                defaultValue={0}
                type="number"
                step="0.1"
                {...register("comprimento", { required: true })}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-sans font-medium text-gray-700">
                Largura (m)
              </label>
              <input
                defaultValue={0}
                type="number"
                step="0.1"
                {...register("largura", { required: true })}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-sans font-medium text-gray-700">
              Profundidade (m)
            </label>
            <input
              defaultValue={0}
              type="number"
              step="0.1"
              {...register("profundidade", { required: true })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      {problemType === "iluminacao_publica" && (
        <div>
          <label className="text-sm font-sans font-medium text-gray-700">
            Status
          </label>
          <select
            {...register("status", { required: true })}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Piscando">Piscando</option>
            <option value="Danificado">Danificado</option>
            <option value="Apagado">Apagado</option>
            <option value="Em manutenção">Em manutenção</option>
            <option value="Funcionando">Funcionando</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        {isPending ? "Carregando..." : "Cadastrar Ocorrência"}
      </button>
    </form>
  );
};

export default AddReport;
