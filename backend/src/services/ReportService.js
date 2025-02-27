import { FilterSchema } from "../models/ReportModel.js";
import ReportRepository from "../repositories/ReportRepository.js";
import UrbanProblemRepository from "../repositories/UrbanProblemRepository.js";
import CriticalAreaService from "./CriticalAreaService.js";
import NotificationService from "./NotificationService.js";
import UrbanProblemService from "./UrbanProblemService.js";

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

    await NotificationService.notifyPublicUsers({
      tipo: "nova_ocorrencia",
      assunto: `Nova ocorrência: ${titulo}`,
      ocorrencia_id: reportResult.id,
      autor_id: usuario_id,
    });

    return { ...reportResult, nivel: criticidade.nivel, tipo: problema.tipo };
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

  static async getDensityByNeighborhood() {
    return ReportRepository.getReportDensityByNeighborhood();
  }

  static async getNearestReports({ longitude, latitude, limit }) {
    if (isNaN(longitude) || isNaN(latitude)) {
      throw new Error("Coordenadas inválidas.");
    }
    if (isNaN(limit) || limit <= 0) {
      throw new Error("O limite deve ser um número positivo.");
    }
    return ReportRepository.getNearestReports({
      longitude,
      latitude,
      limit,
    });
  }

  static async getRegionDensityReport() {
    return ReportRepository.getReportDensityByRegion();
  }

  static async getNeighborhoodsWithReports({ longitude, latitude, raio, min }) {
    if (!longitude || !latitude || !raio || !min) {
      throw new Error("Todos os parâmetros são obrigatórios");
    }

    return ReportRepository.getNeighborhoodsWithReports({
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      raio: parseInt(raio),
      min: parseInt(min),
    });
  }

  static async getAverageDistanceByType() {
    return ReportRepository.getAverageDistanceByType();
  }

  static async getCountByType() {
    return ReportRepository.countByType();
  }

  static async listByFilters(filters) {
    const { error } = FilterSchema.validateAsync(filters, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) throw new Error(error.details[0].message);

    return await ReportRepository.findByFilters(filters);
  }

  static async updateReport(id, updateData) {
    const { titulo, status, problema } = updateData;

    if (titulo || status) {
      await ReportRepository.updateOccurrence(id, { titulo, status });
    }

    if (problema) {
      const ocorrencia = await ReportRepository.findById(id);
      await UrbanProblemRepository.updateProblem(
        ocorrencia.problema_id,
        problema
      );
    }

    return await ReportRepository.findById(id);
  }

  static async updateStatus(id, status) {
    const updatedReport = await ReportRepository.updateOccurrenceStatus(
      id,
      status
    );

    if (!updatedReport) {
      throw new Error("Falha ao atualizar o status da ocorrência");
    }

    await NotificationService.notifyUser({
      usuario_id: updatedReport.usuario_id,
      tipo: "status_atualizado",
      assunto: `Status da ocorrência atualizado para: ${status}`,
      ocorrencia_id: id,
    });

    return updatedReport;
  }
}

export default ReportService;
