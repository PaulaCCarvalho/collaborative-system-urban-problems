// src/routes/index.js
import express from "express";
import userRouter from "./userRouter.js";
import institutionRouter from "./institutionRouter.js";
import reportRouter from "./reportRouter.js";
import ErrorHandler from "../middlewares/ErrorHandler.js";

const router = express.Router();

router
  .use("/api", institutionRouter)
  .use("/api", userRouter)
  .use("/api", reportRouter)
  .use(ErrorHandler);

export default router;
