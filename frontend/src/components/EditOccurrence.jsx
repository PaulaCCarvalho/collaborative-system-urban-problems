import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { editOccurrence } from "../core/requests";

const EditOccurrence = ({ occurrence, onClose }) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      titulo: occurrence.titulo,
      status: occurrence.status,
      descricao: occurrence.problema?.descricao || "",
      comprimento: occurrence.problema?.comprimento || "",
      largura: occurrence.problema?.largura || "",
      profundidade: occurrence.problema?.profundidade || "",
      statusProblema: occurrence.problema?.status || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (updatedData) => editOccurrence(occurrence.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["occurrenceDetails", occurrence.id]);
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao editar ocorrência:", error);
    },
  });

  const onSubmit = (formData) => {
    let updatedData = {
      titulo: formData.titulo,
      problema: {
        descricao: formData.descricao,
      },
    };

    if (formData.status !== "Validada") {
      updatedData = {
        ...updatedData,
        status: formData.status,
      };
    }

    if (occurrence.problema.tipo === "buraco") {
      updatedData.problema = {
        ...updatedData.problema,
        comprimento: Number(formData.comprimento),
        largura: Number(formData.largura),
        profundidade: Number(formData.profundidade),
      };
    } else if (occurrence.problema.tipo === "iluminacao_publica") {
      updatedData.problema = {
        ...updatedData.problema,
        status: formData.statusProblema,
      };
    }

    mutation.mutate(updatedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-base font-sans font-medium text-gray-800">
        Editar ocorrência
      </h3>

      <div>
        <label className="text-sm font-sans font-medium text-gray-700">
          Título
        </label>
        <input
          {...register("titulo", { required: false })}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status da ocorrência
        </label>
        {getValues("status") !== "Validada" ? (
          <select
            {...register("status", { required: false })}
            className="block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Pendente">Pendente</option>
            <option value="Danificado">Em manutenção</option>
            <option value="Manutenção concluída">Manutenção concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        ) : (
          <input
            disabled={true}
            {...register("status", { required: true })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-200"
          />
        )}
      </div>

      <div>
        <label className="text-sm font-sans font-medium text-gray-700">
          Descrição do problema
        </label>
        <textarea
          {...register("descricao", { required: false })}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {occurrence.problema.tipo === "buraco" && (
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
                {...register("comprimento", { required: false })}
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
                {...register("largura", { required: false })}
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
              {...register("profundidade", { required: false })}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      )}

      {occurrence.problema.tipo === "iluminacao_publica" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status do Problema
          </label>
          <select
            {...register("statusProblema", { required: false })}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Piscando">Piscando</option>
            <option value="Danificado">Danificado</option>
            <option value="Apagado">Apagado</option>
            <option value="Em manutenção">Em manutenção</option>
            <option value="Funcionando">Funcionando</option>
          </select>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors cursor-pointer"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditOccurrence;
