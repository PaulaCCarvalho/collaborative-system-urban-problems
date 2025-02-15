import express from "express";
import ReportController from "../controllers/ReportController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .post("/ocorrencias", authMiddleware, ReportController.create)
  .get("/ocorrencias/:id", ReportController.getReportDetails)
  .get("/ocorrencias/bairro/:id", ReportController.getReportsByNeighborhood);

export default router;
