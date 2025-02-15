import ReportRepository from "../repositories/ReportRepository.js";
import UrbanProblemRepository from "../repositories/UrbanProblemRepository.js";
import CriticalAreaService from "./CriticalAreaService.js";

class ReportService {
  static async createReport(reportData) {
    const { titulo, latitude, longitude, problema, usuario_id } = reportData;

    const problema_id = await UrbanProblemService.registerUrbanProblem({
      ...problema,
      longitude,
      latitude,
    });

    const criticidade = await CriticalAreaService.registerCriticality({
      longitude,
      latitude,
    });

    const reportResult = await ReportRepository.create({
      titulo,
      latitude,
      longitude,
      usuario_id,
      problema_id,
      criticidade_id: criticidade.id,
    });

    return { ...reportResult, nivel: criticidade.nivel };
  }

  static async getReportWithDetails(id) {
    const report = await ReportRepository.getReportById(id);

    if (report.tipo === "buraco") {
      return UrbanProblemRepository.getPotholeDetails(id);
    }

    if (report.tipo === "iluminacao_publica") {
      return UrbanProblemRepository.getLightingDetails(id);
    }

    throw new Error("Tipo de ocorrência não suportado");
  }

  static async getReportsByNeighborhood(neighborhoodId) {
    if (!neighborhoodId) {
      throw new Error("ID do bairro é obrigatório");
    }
    return ReportRepository.getReportsByNeighborhood(neighborhoodId);
  }
}

export default ReportService;
