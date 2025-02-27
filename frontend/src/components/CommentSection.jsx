import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import {
  addComment,
  deleteComment,
  editComment,
  getComments,
} from "../core/requests";
import { useAuth } from "../core/AuthContext";

const CommentsSection = ({ occurrenceId }) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const { getUserId } = useAuth();
  const userId = getUserId();

  const {
    data: comments,
    isFetching: isFetchingComments,
    isError: isCommentsError,
  } = useQuery({
    queryKey: ["comments", occurrenceId],
    queryFn: () => getComments(occurrenceId),
  });

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", occurrenceId]);
      setNewComment("");
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: editComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", occurrenceId]);
      setEditingCommentId(null);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", occurrenceId]);
    },
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addCommentMutation.mutate({
        ocorrencia_id: occurrenceId,
        texto: newComment,
      });
    }
  };

  const startEditing = (e, commentId, texto) => {
    e.stopPropagation();
    setEditingCommentId(commentId);
    setEditingText(texto);
  };

  const handleEditComment = (e) => {
    e.preventDefault();
    if (editingText.trim()) {
      editCommentMutation.mutate({
        commentId: editingCommentId,
        texto: editingText,
      });
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Comentários</h3>

      {/* Lista de Comentários */}
      {isFetchingComments ? (
        <p className="text-gray-500">Carregando comentários...</p>
      ) : isCommentsError ? (
        <p className="text-red-500">Erro ao carregar comentários.</p>
      ) : comments.data?.length > 0 ? (
        <div className="space-y-4">
          {comments.data.map((comment) => (
            <div
              key={comment.id}
              className="bg-zinc-50 px-4 py-2 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center ">
                  <FaUserCircle className="mr-1 text-gray-500 text-2xl" />
                  <p className="font-semibold text-gray-800">
                    {comment.usuario_nome}
                  </p>
                </div>
                <span className="text-xs font-sans text-gray-500">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>

              {editingCommentId === comment.id ? (
                <form onSubmit={handleEditComment} className="mt-2">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="2"
                  />
                  <div className="flex space-x-2 mt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCommentId(null);
                      }}
                      className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="">
                  <p className="text-gray-700 text-md font-sans">
                    {comment.texto}
                  </p>

                  {userId === comment.usuario_id && (
                    <div className="flex space-x-2 justify-end">
                      <button
                        title="Editar comentário"
                        onClick={(e) =>
                          startEditing(e, comment.id, comment.texto)
                        }
                        className="text-gray-600 text-sm hover:text-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        title="Apagar comentário"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCommentMutation.mutate(comment.id);
                        }}
                        className="text-gray-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nenhum comentário encontrado.</p>
      )}

      {/* Formulário para Adicionar Comentário */}
      <form onSubmit={handleAddComment} className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="3"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Enviar Comentário
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
