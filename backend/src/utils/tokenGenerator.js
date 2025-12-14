import jsonwebtoken from "jsonwebtoken";
import { ApiError } from "./ApiError.js";

const generateToken = (user) => {
    const {address,contractAddress} = user;
    if(!address || !contractAddress){
        throw new ApiError(400,"all fields are required")
    }
    const token = jsonwebtoken.sign({ address, contractAddress }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRY
    });
    return token;
};

export { generateToken };
