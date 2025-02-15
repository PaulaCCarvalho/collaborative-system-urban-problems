import express from "express";
import UserController from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter
  .post("/usuarios/cadastrar", UserController.signUp)
  .post("/usuarios/login", UserController.login);

export default userRouter;
