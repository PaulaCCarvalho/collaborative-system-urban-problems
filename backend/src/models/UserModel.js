import Joi from "joi";

const UserSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  tipo: Joi.string().valid("admin", "publico", "cidadao").required(),
  senha: Joi.string().min(6).required(),
});

const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
});

export { UserSchema, LoginSchema };
