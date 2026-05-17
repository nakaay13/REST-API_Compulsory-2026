import { Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: jwt.JwtPayload;
}