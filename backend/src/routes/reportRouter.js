import express from "express";
import ReportController from "../controllers/ReportController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .post("/ocorrencias", authMiddleware, ReportController.create)
  .get("/ocorrencias", ReportController.listByFilters)
  .get("/ocorrencias/bairro/:id", ReportController.getReportsByNeighborhood)
  .get(
    "/ocorrencias/densidade/bairros",
    ReportController.getDensityByNeighborhood
  )
  .get("/ocorrencias/media-distancia", ReportController.getAverageDistance)
  .get("/ocorrencias/contagem-por-tipo", ReportController.getCountByType)
  .get(
    "/ocorrencias/bairros/raio",
    ReportController.getNeighborhoodsWithReports
  )
  .get(
    "/ocorrencias/densidade/regioes/",
    ReportController.getRegionDensityReport
  )
  .get("/ocorrencias/regioes/ranking", ReportController.getRegionsRanking)
  .get("/ocorrencias/proximas", ReportController.getNearestReports)
  .get("/ocorrencias/:id", ReportController.getReportDetails)
  .put("/ocorrencias/:id", authMiddleware, ReportController.update)
  .put(
    "/ocorrencias/:id/status",
    authMiddleware,
    ReportController.updateStatus
  );

export default router;
