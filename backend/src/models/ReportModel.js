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

const validStatus = [
  "Pendente",
  "Em manutenção",
  "Manutenção concluída",
  "Validada",
  "Cancelada",
];

const FilterSchema = Joi.object({
  status: Joi.string()
    .valid(...validStatus)
    .optional()
    .allow(null),
  days: Joi.number().integer().min(1).optional().allow(null),
}).or("status", "days");

const UpdateReportSchema = Joi.object({
  titulo: Joi.string().optional(),
  status: Joi.string()
    .valid("Pendente", "Em manutenção", "Manutenção concluída", "Cancelada")
    .optional(),
  problema: Joi.object({
    descricao: Joi.string().optional(),
    largura: Joi.number().min(0).optional(),
    comprimento: Joi.number().min(0).optional(),
    profundidade: Joi.number().min(0).optional(),
    status: Joi.string()
      .valid(
        "Funcionando",
        "Apagado",
        "Piscando",
        "Danificado",
        "Em manutenção"
      )
      .optional(),
  }).optional(),
}).or("titulo", "status", "problema");

const validStatusCidadao = ["Validada"];
const validStatusPublico = [
  "Em manutenção",
  "Manutenção concluída",
  "Validada",
];

const UpdateStatusSchema = Joi.object({
  status: Joi.string()
    .when("$userType", {
      is: "cidadao",
      then: Joi.string()
        .valid(...validStatusCidadao)
        .required(),
      otherwise: Joi.string()
        .valid(...validStatusPublico)
        .required(),
    })
    .messages({
      "any.only": "Status inválido para o tipo de usuário",
    }),
});

export { ReportSchema, FilterSchema, UpdateReportSchema, UpdateStatusSchema };
