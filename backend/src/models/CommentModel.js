import Joi from "joi";

const CommentSchema = Joi.object({
  texto: Joi.string().required(),
  ocorrencia_id: Joi.number().integer().required(),
});

const UpdateCommentSchema = Joi.object({
  texto: Joi.string().required(),
});

export { CommentSchema, UpdateCommentSchema };
