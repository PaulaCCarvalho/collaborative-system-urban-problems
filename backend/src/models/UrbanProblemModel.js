import Joi from "joi";

const UrbanProblemSchema = Joi.object({
  tipo: Joi.string().valid("buraco", "iluminacao_publica").required().messages({
    "any.only":
      "Tipo de problema inválido. Valores permitidos: buraco, iluminacao_publica",
  }),
  descricao: Joi.string().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});

const PotholeSchema = UrbanProblemSchema.append({
  tipo: Joi.string().valid("buraco").required(),
  largura: Joi.number().min(0).allow(null),
  comprimento: Joi.number().min(0).allow(null),
  profundidade: Joi.number().min(0).allow(null),
});

const LightingSchema = UrbanProblemSchema.append({
  tipo: Joi.string().valid("iluminacao_publica").required(),
  status: Joi.string()
    .valid("funcionando", "apagado", "piscando", "danificado", "manutencao")
    .required()
    .messages({
      "any.only": "Status inválido para iluminação pública",
    }),
});

export { PotholeSchema, LightingSchema };
