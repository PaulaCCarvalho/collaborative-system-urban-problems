import { CommentSchema, UpdateCommentSchema } from "../models/CommentModel.js";
import CommentRepository from "../repositories/CommentRepository.js";
import ReportRepository from "../repositories/ReportRepository.js";
import NotificationService from "./NotificationService.js";

class CommentService {
  static async createComment(commentData, usuario_id) {
    const { error } = CommentSchema.validateAsync(commentData);
    if (error) throw new Error(error.details[0].message);

    const comment = await CommentRepository.create({
      ...commentData,
      usuario_id,
    });

    if (!comment) {
      throw new Error("Falha ao adicionar comentário na ocorrência");
    }

    const ocorrencia = await ReportRepository.findById(
      commentData.ocorrencia_id
    );
    if (ocorrencia.usuario_id !== usuario_id) {
      await NotificationService.notifyUser({
        usuario_id: ocorrencia.usuario_id,
        tipo: "novo_comentario",
        assunto: `Novo comentário na ocorrência: ${ocorrencia.titulo}`,
        ocorrencia_id: commentData.ocorrencia_id,
      });
    }

    return comment;
  }

  static async getRecentComments(ocorrencia_id) {
    if (!ocorrencia_id || isNaN(ocorrencia_id)) {
      throw new Error("ID da ocorrência inválido");
    }
    return await CommentRepository.getRecent(ocorrencia_id);
  }

  static async updateComment(id, texto, usuario_id) {
    const { error } = UpdateCommentSchema.validate({ texto });
    if (error) throw new Error(error.details[0].message);

    const comment = await CommentRepository.findById(id);
    if (!comment) throw new Error("Comentário não encontrado");
    if (comment.usuario_id !== usuario_id) {
      throw new Error("Apenas o autor pode editar o comentário");
    }

    return await CommentRepository.update(id, texto);
  }

  static async deleteComment(id, usuario_id) {
    const comment = await CommentRepository.findById(id);
    if (!comment) throw new Error("Comentário não encontrado");
    if (comment.usuario_id !== usuario_id) {
      throw new Error("Apenas o autor pode apagar o comentário");
    }

    return await CommentRepository.delete(id);
  }
}

export default CommentService;
