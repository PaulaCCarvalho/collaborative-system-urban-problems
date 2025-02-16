import {
  ReportSchema,
  UpdateReportSchema,
  UpdateStatusSchema,
} from "../models/ReportModel.js";
import ReportRepository from "../repositories/ReportRepository.js";
import ReportService from "../services/ReportService.js";
import UrbanProblemService from "../services/UrbanProblemService.js";

class ReportController {
  static async create(req, res) {
    try {
      const { error } = ReportSchema.validateAsync(req.body);
      if (error) throw new Error(error.details[0].message);
      const result = await ReportService.createReport({
        ...req.body,
        usuario_id: req.user.id,
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getReportDetails(req, res) {
    try {
      const reportId = req.params.id;
      const result = await ReportService.getReportWithDetails(reportId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getReportsByNeighborhood(req, res) {
    try {
      const neighborhoodId = req.params.id;
      const reports =
        await ReportService.getReportsByNeighborhood(neighborhoodId);
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDensityByNeighborhood(req, res) {
    try {
      const densityData = await ReportService.getDensityByNeighborhood();
      res.status(200).json(densityData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRegionsRanking(req, res) {
    try {
      const ranking = await UrbanProblemService.getRegionsByProblemType();
      res.status(200).json(ranking);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getNearestReports(req, res) {
    try {
      const { longitude, latitude, limit } = req.query;

      if (!longitude || !latitude) {
        throw new Error(
          "As coordenadas (longitude e latitude) são obrigatórias."
        );
      }

      const parsedLongitude = parseFloat(longitude);
      const parsedLatitude = parseFloat(latitude);
      const parsedLimit = limit ? parseInt(limit, 10) : 5;

      if (isNaN(parsedLongitude)) {
        throw new Error("Longitude inválida.");
      }
      if (isNaN(parsedLatitude)) {
        throw new Error("Latitude inválida.");
      }
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        throw new Error("O limite deve ser um número positivo.");
      }

      const reports = await ReportService.getNearestReports({
        longitude: parsedLongitude,
        latitude: parsedLatitude,
        limit: parsedLimit,
      });

      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRegionDensityReport(req, res) {
    try {
      const report = await ReportService.getRegionDensityReport();
      res.status(200).json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getNeighborhoodsWithReports(req, res) {
    try {
      const { longitude, latitude, raio, min } = req.query;

      const result = await ReportService.getNeighborhoodsWithReports({
        longitude,
        latitude,
        raio,
        min,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAverageDistance(req, res) {
    try {
      const result = await ReportService.getAverageDistanceByType();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCountByType(req, res) {
    try {
      const result = await ReportService.getCountByType();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async listByFilters(req, res) {
    try {
      const { status, days } = req.query;

      const filters = {
        status: status || null,
        days: days ? parseInt(days, 10) : null,
      };

      const reports = await ReportService.listByFilters(filters);
      res.status(200).json(reports);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;

      const { error } = UpdateReportSchema.validateAsync(req.body);
      if (error) throw new Error(error.details[0].message);

      const ocorrencia = await ReportRepository.findById(id);
      if (!ocorrencia) throw new Error("Ocorrência não encontrada");
      if (ocorrencia.usuario_id !== usuario_id) {
        throw new Error("Apenas o autor pode editar a ocorrência");
      }

      const updatedReport = await ReportService.updateReport(id, req.body);

      res.status(200).json(updatedReport);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const usuario_id = req.user.id;
      const userType = req.user.tipo;
      const { error } = UpdateStatusSchema.validateAsync(req.body, {
        context: { userType },
      });
      if (error) throw new Error(error.details[0].message);

      const ocorrencia = await ReportRepository.findById(id);
      if (!ocorrencia) throw new Error("Ocorrência não encontrada");

      if (ocorrencia.usuario_id === usuario_id) {
        throw new Error("O autor não pode alterar o status da ocorrência");
      }

      if (userType === "cidadao" && ocorrencia.status !== "Pendente") {
        throw new Error("Cidadão só pode validar ocorrências pendentes");
      }

      const updatedReport = await ReportService.updateStatus(
        id,
        req.body.status
      );

      res.status(200).json(updatedReport);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default ReportController;
