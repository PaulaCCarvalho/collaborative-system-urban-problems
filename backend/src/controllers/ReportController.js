import ReportSchema from "../models/ReportModel.js";
import ReportService from "../services/ReportService.js";

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
}

export default ReportController;
