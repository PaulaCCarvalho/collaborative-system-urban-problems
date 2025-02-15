import Joi from "joi";
import { LightingSchema, PotholeSchema } from "./UrbanProblemModel.js";

const ReportSchema = Joi.object({
  titulo: Joi.string().max(100).required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  problema: Joi.alternatives()
    .try(PotholeSchema, LightingSchema)
    .required()
    .messages({
      "alternatives.types":
        "O objeto problema não corresponde a um tipo válido",
    }),
});
export default ReportSchema;
