import CriticalAreaRepository from "../repositories/CriticalAreaRepository.js";
import PopulationRepository from "../repositories/PopulationRepository.js";
import InstitutionService from "./InstitutionService.js";

class CriticalAreaService {
  static async calculateCriticality({ longitude, latitude }) {
    try {
      const institutions = await InstitutionService.getNearbyAllInstitutions(
        longitude,
        latitude
      );

      const totalInstitutions =
        institutions.saude.length + institutions.ensino.length;

      const populationResult =
        await PopulationRepository.getPopulationByCoordinatesOrderByDensity(
          longitude,
          latitude
        );

      return this.calculateCriticalityLevel(
        totalInstitutions,
        populationResult[0].populacao
      );
    } catch (error) {
      throw new Error(`Erro ao calcular criticidade: ${error.message}`);
    }
  }

  static calculateCriticalityLevel(institution, population) {
    const PESO_INSTITUTION = 0.6;
    const PESO_POPULATION = 0.4;
    const MAX_INSTITUTION = 2100;
    const MAX_POPULATION = 34395;

    const calcPopulation =
      Math.min(population / MAX_POPULATION, 1) * PESO_POPULATION;
    const calcInstitution =
      Math.min(institution / MAX_INSTITUTION, 1) * PESO_INSTITUTION;

    const rawScore = calcPopulation + calcInstitution;

    const score = Math.ceil(rawScore * 10);

    return Math.min(score, 10.0);
  }
  static async registerCriticality({ longitude, latitude }) {
    try {
      const nivel = await this.calculateCriticality({ longitude, latitude });
      return await CriticalAreaRepository.createCriticality({
        nivel,
        longitude,
        latitude,
      });
    } catch (error) {
      throw new Error(`Erro ao registrar criticidade: ${error.message}`);
    }
  }
}

export default CriticalAreaService;
