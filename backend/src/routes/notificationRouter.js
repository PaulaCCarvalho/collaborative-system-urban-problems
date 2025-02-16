import express from "express";
import NotificationController from "../controllers/NotificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const notificationRouter = express.Router();

notificationRouter
  .get("/notificacoes", authMiddleware, NotificationController.list)
  .put(
    "/notificacoes/:id/marcar-como-lida",
    authMiddleware,
    NotificationController.markAsRead
  );

export default notificationRouter;
