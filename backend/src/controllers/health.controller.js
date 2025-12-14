import { asynchandler } from "../utils/asynchandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const healthCheck = asynchandler(async (req, res, next) => {
    res.status(200).json(new ApiResponse(200, { status: "healthy" }, "Health check successful"));
});

export { healthCheck}