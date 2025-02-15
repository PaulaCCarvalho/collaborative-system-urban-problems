// src/routes/institutionRouter.js
import express from "express";
import InstitutionController from "../controllers/InstitutionController.js";

const router = express.Router(); // Cria o router diretamente

router
  .get(
    "/instituicoes-ensino/proximas",
    InstitutionController.getNearbyEducationalInstitutions
  )
  .get(
    "/instituicoes-saude/proximas",
    InstitutionController.getNearbyHealthcareInstitutions
  )
  .get("/instituicoes/proximas", InstitutionController.getNearbyInstitutions);

export default router; // Exporta o router diretamente
