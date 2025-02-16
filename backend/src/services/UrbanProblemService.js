import { LightingSchema, PotholeSchema } from "../models/UrbanProblemModel.js";
import UrbanProblemRepository from "../repositories/UrbanProblemRepository.js";

class UrbanProblemService {
  static async registerUrbanProblem(problemData) {
    const {
      descricao,
      latitude,
      longitude,
      tipo,
      largura,
      comprimento,
      profundidade,
      status,
    } = problemData;

    if (tipo === "buraco") {
      const pothole = {
        tipo,
        descricao,
        latitude,
        longitude,
        largura,
        comprimento,
        profundidade,
      };

      const { error } = PotholeSchema.validate(pothole);
      if (error) throw new Error(error.details[0].message);

      return await UrbanProblemRepository.registerPotholeProblem(pothole);
    }

    if (tipo === "iluminacao_publica") {
      const lighting = {
        tipo,
        descricao,
        latitude,
        longitude,
        status,
      };

      const { error } = LightingSchema.validate(lighting);
      if (error) throw new Error(error.details[0].message);

      return await UrbanProblemRepository.registerPublicLightingProblem(
        lighting
      );
    }
  }

  static async getRegionsByProblemType() {
    return UrbanProblemRepository.getRegionsByProblemType();
  }
}

export default UrbanProblemService;
