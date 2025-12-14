import { ApiResponse } from "../utils/ApiResponse.js";

const errorHandler = async (err, req, res, _) => {
  console.error("handling error",err);
  res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode || 500, null,err.message));
};

export {errorHandler}