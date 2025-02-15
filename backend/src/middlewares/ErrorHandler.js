import ApplicationError from "../Error/ApplicationError.js";

const ErrorHandler = (err, req, res, next) => {
  const { error } = req;
  if (error === undefined) {
    return res.status(500).send("Unknown error");
  }
  if (error instanceof ApplicationError) {
    return res.status(error.code).send(error.message);
  }
  return res.status(500).send("Internal service error");
};

export default ErrorHandler;
