import express from "express";
import CommentController from "../controllers/CommentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const commentRouter = express.Router();

commentRouter
  .post("/comentarios", authMiddleware, CommentController.create)
  .get("/comentarios/ocorrencias/:id", CommentController.getRecent)
  .put("/comentarios/:id", authMiddleware, CommentController.update)
  .delete("/comentarios/:id", authMiddleware, CommentController.delete);

export default commentRouter;
