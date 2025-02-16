import CommentService from "../services/CommentService.js";

class CommentController {
  static async create(req, res) {
    try {
      const usuario_id = req.user.id;
      const result = await CommentService.createComment(req.body, usuario_id);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getRecent(req, res) {
    try {
      const ocorrencia_id = parseInt(req.params.id);
      const result = await CommentService.getRecentComments(ocorrencia_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;
      const { texto } = req.body;

      const result = await CommentService.updateComment(id, texto, usuario_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;

      const result = await CommentService.deleteComment(id, usuario_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default CommentController;
