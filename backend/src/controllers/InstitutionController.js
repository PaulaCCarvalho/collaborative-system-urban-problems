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
      const { longitude, latitude, raio, tipo } = req.query;
      const parsedLng = parseFloat(longitude);
      const parsedLat = parseFloat(latitude);
      let parsedRaio = parseFloat(raio);

      if (Number.isNaN(parsedLng) || Number.isNaN(parsedLat)) {
        throw new Error("Coordenadas inválidas");
      }

      if (Number.isNaN(parsedRaio)) {
        parsedRaio = undefined;
      }

      const tiposValidos = ["saude", "ensino", "ambas"];
      if (tipo && !tiposValidos.includes(tipo)) {
        throw new Error(
          "Tipo de instituição inválido. Use 'saude', 'ensino' ou 'ambas'."
        );
      }

      let institutions;
      switch (tipo) {
        case "saude":
          institutions =
            await InstitutionService.getNearbyHealthcareInstitutions(
              parsedLng,
              parsedLat,
              parsedRaio
            );
          break;
        case "ensino":
          institutions =
            await InstitutionService.getNearbyEducationalInstitutions(
              parsedLng,
              parsedLat,
              parsedRaio
            );
          break;
        case "ambas":
        default:
          institutions = await InstitutionService.getNearbyAllInstitutions(
            parsedLng,
            parsedLat,
            parsedRaio
          );
          break;
      }

      return res.json(institutions);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default InstitutionController;
