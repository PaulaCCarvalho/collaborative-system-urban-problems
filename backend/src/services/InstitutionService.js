import InstitutionRepository from "../repositories/InstitutionRepository.js";

class InstitutionService {
  static async getNearbyEducationalInstitutions(longitude, latitude, raio) {
    if (!longitude || !latitude) {
      throw new Error("Longitude e latitude são obrigatórias.");
    }

    const institutions =
      await InstitutionRepository.findNearbyEducationalInstitutions(
        longitude,
        latitude,
        raio
      );

    return institutions.map((inst) => ({
      nome: inst.nome,
      distancia: parseFloat(inst.distancia.toFixed(2)),
      coordenadas: JSON.parse(inst.coordenadas),
    }));
  }

  static async getNearbyHealthcareInstitutions(longitude, latitude, raio) {
    if (!longitude || !latitude) {
      throw new Error("Longitude e latitude são obrigatórias.");
    }

    const institutions =
      await InstitutionRepository.findNearbyHealthcareInstitutions(
        longitude,
        latitude,
        raio
      );

    return institutions.map((inst) => ({
      nome: inst.nome,
      distancia: parseFloat(inst.distancia.toFixed(2)),
      coordenadas: JSON.parse(inst.coordenadas),
    }));
  }

  static async getNearbyAllInstitutions(longitude, latitude, raio) {
    if (!longitude || !latitude) {
      throw new Error("Longitude e latitude são obrigatórias.");
    }

    const educationalInstitutions = await this.getNearbyEducationalInstitutions(
      longitude,
      latitude,
      raio
    );
    const healthcareInstitutions = await this.getNearbyHealthcareInstitutions(
      longitude,
      latitude,
      raio
    );

    const allInstitutions = {
      saude: [...educationalInstitutions],
      ensino: [...healthcareInstitutions],
    };
    return allInstitutions; 
  }
}

export default InstitutionService;
