import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOccurrenceDetails } from "../core/requests";
import { Marker, Popup } from "react-leaflet";
import {
  FaLightbulb,
  FaRulerCombined,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FaRoadCircleExclamation } from "react-icons/fa6";
import { LuUtilityPole } from "react-icons/lu";
import CommentsSection from "./CommentSection";
import EditOccurrence from "./EditOccurrence";
import { useAuth } from "../core/AuthContext";

const OccurrenceDetails = ({ occurrence, position, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const { getUserId } = useAuth();
  const userId = getUserId();

  const { data, isFetching, isError } = useQuery({
    queryKey: ["occurrenceDetails", occurrence.id],
    queryFn: async () => {
      const response = await getOccurrenceDetails(occurrence.id);
      return response.data;
    },
    enabled: isOpen,
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <Marker position={position} icon={icon}>
      <Popup>
        <div className={`${isOpen && "max-h-[72vh] w-76 overflow-auto p-2"}`}>
          {editing ? (
            <EditOccurrence
              occurrence={data}
              position={position}
              icon={icon}
              onClose={() => setEditing(false)}
            />
          ) : (
            <>
              {isOpen ? (
                <div>
                  {isFetching ? (
                    <p className="text-gray-500">Carregando...</p>
                  ) : isError ? (
                    <p className="text-red-500">Erro ao carregar detalhes.</p>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center space-x-4 bg-neutral-50 px-1 py-2 rounded-lg shadow-sm">
                        <div className="bg-zinc-100 p-2 rounded-full flex items-center justify-center">
                          {data.problema.tipo === "buraco" ? (
                            <FaRoadCircleExclamation className="text-gray-700 text-3xl" />
                          ) : (
                            <LuUtilityPole className="text-amber-600  text-3xl" />
                          )}
                        </div>
                        <h2 className="text-md font-extrabold text-gray-700 flex items-center">
                          Detalhes da Ocorrência - {data.titulo}
                        </h2>
                      </div>

                      <div>
                        <p className="flex gap-2 text-sm font-sans font-medium text-gray-700">
                          <strong>Problema:</strong> {data.problema.descricao}
                        </p>

                        <p className="flex items-center gap-2 text-sm font-sans font-medium text-gray-700">
                          <FaExclamationTriangle className="text-red-500" />
                          <strong>Críticidade:</strong> {data.criticidade}
                        </p>

                        {data.problema.tipo === "buraco" ? (
                          <p className="flex items-center gap-2 text-sm font-sans font-medium text-gray-700">
                            <FaRulerCombined className="text-purple-500 text-xl" />
                            <strong>Dimensões:</strong> {data.problema.largura}m
                            (largura) x {data.problema.comprimento}m
                            (comprimento) x {data.problema.profundidade}m
                            (profundidade)
                          </p>
                        ) : (
                          <p className="flex items-center gap-2 text-xm font-sans font-medium text-gray-700">
                            <FaLightbulb className="text-yellow-500" />
                            <strong>Status do problema:</strong>{" "}
                            {data.problema.status}
                          </p>
                        )}
                        <p className="flex items-center gap-2 text-xm font-sans font-medium text-gray-700">
                          <FaLightbulb className="text-yellow-500" />
                          <strong>Status da ocorrência:</strong> {data.status}
                        </p>

                        <p className="flex items-center text-sm gap-2 font-sans font-medium text-gray-700">
                          <FaCalendarAlt className="text-green-500" />
                          <strong>Data:</strong>{" "}
                          {new Date(data.timestamp).toLocaleString()}
                        </p>
                      </div>

                      {userId === occurrence.autor && (
                        <div className="mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditing(true);
                            }}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                          >
                            Editar Ocorrência
                          </button>
                        </div>
                      )}
                      <hr className="border-gray-300 w-full mt-4" />
                      <CommentsSection occurrenceId={occurrence.id} />
                    </div>
                  )}

                  {/* Botão Fechar */}
                  <button
                    onClick={(e) => handleClick(e)}
                    className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    Voltar
                  </button>
                </div>
              ) : (
                <div>
                  {/* Título e Status */}
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {occurrence.titulo}
                  </h3>
                  <p className="text-gray-700">
                    <strong>Tipo:</strong>{" "}
                    {occurrence.tipo === "buraco"
                      ? "Buraco"
                      : "Iluminação Pública"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Status:</strong> {occurrence.status}
                  </p>

                  {/* Botão Detalhes */}
                  <button
                    onClick={(e) => handleClick(e)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                  >
                    Detalhes
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default OccurrenceDetails;
