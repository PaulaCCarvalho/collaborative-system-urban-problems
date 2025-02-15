// src/controllers/InstitutionController.js
import InstitutionService from "../services/InstitutionService.js";

class InstitutionController {
  static async getNearbyEducationalInstitutions(req, res) {
    try {
      const { longitude, latitude, raio } = req.query;
      const parsedLng = parseFloat(longitude);
      const parsedLat = parseFloat(latitude);
      let parsedRaio = parseFloat(raio);

      if (Number.isNaN(parsedLng) || Number.isNaN(parsedLat)) {
        throw new Error("Coordenadas inválidas");
      }

      if (Number.isNaN(parsedRaio)) {
        parsedRaio = undefined;
      }

      const institutions =
        await InstitutionService.getNearbyEducationalInstitutions(
          parsedLng,
          parsedLat,
          parsedRaio
        );
      return res.json(institutions);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getNearbyHealthcareInstitutions(req, res) {
    try {
      const { longitude, latitude, raio } = req.query;
      const parsedLng = parseFloat(longitude);
      const parsedLat = parseFloat(latitude);
      let parsedRaio = parseFloat(raio);

      if (Number.isNaN(parsedLng) || Number.isNaN(parsedLat)) {
        throw new Error("Coordenadas inválidas");
      }

      if (Number.isNaN(parsedRaio)) {
        parsedRaio = undefined;
      }

      const institutions =
        await InstitutionService.getNearbyHealthcareInstitutions(
          parsedLng,
          parsedLat,
          parsedRaio
        );
      return res.json(institutions);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  static async getNearbyInstitutions(req, res) {
    try {
      const { longitude, latitude, raio } = req.query;
      const parsedLng = parseFloat(longitude);
      const parsedLat = parseFloat(latitude);
      let parsedRaio = parseFloat(raio);

      if (Number.isNaN(parsedLng) || Number.isNaN(parsedLat)) {
        throw new Error("Coordenadas inválidas");
      }

      if (Number.isNaN(parsedRaio)) {
        parsedRaio = undefined;
      }

      const institutions = await InstitutionService.getNearbyAllInstitutions(
        parsedLng,
        parsedLat,
        parsedRaio
      );
      return res.json(institutions);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default InstitutionController;
