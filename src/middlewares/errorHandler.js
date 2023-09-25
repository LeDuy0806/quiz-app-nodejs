import constants from "../constants/httpStatus.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  // console.log(statusCode);
  switch (statusCode) {
    case constants.UNPROCESSABLE_ENTITY:
      res.json({
        title: "UNPROCESSABLE_ENTITY",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.BAD_REQUEST:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      console.log(err);
      break;
  }
};

export default errorHandler;
