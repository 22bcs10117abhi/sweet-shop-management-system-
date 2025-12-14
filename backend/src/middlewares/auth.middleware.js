import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

const verifyToken = asynchandler(async (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "No token provided");
  }

  console.log(token)
  
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});


// const verifyAdminToken = asynchandler(async (req, res, next) => {
//   const token =
//     req.cookies?.token ||
//     req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     throw new ApiError(401, "No token provided");
//   }
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "admin") {
//       throw new ApiError(403, "Forbidden: Admins only");
//     }
//     req.user = decoded;
//     next();
//   } catch (error) {
//     throw new ApiError(401, "Invalid token");
//   }
// });

export {verifyToken};