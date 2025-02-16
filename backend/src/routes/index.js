import express from "express";
import userRouter from "./userRouter.js";
import institutionRouter from "./institutionRouter.js";
import reportRouter from "./reportRouter.js";
import ErrorHandler from "../middlewares/ErrorHandler.js";
import commentRouter from "./commentRouter.js";
import notificationRouter from "./NotificationRouter.js";

const router = express.Router();

router
  .use("/api", institutionRouter)
  .use("/api", userRouter)
  .use("/api", reportRouter)
  .use("/api", commentRouter)
  .use("/api", notificationRouter)
  .use(ErrorHandler);

export default router;
