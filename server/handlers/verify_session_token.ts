
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function Verify_Session_Token(request: any , response : Response, next : NextFunction) {
    const token = request.cookies.session_token;
    if (!token) return response.status(401).json({ error: "Unauthorized" });
    try {
       const jwt_secret = process.env.JWT_SECRET as string;
       const decoded = jwt.verify(token, jwt_secret);
       request.user_data = decoded; 
       next();
    } catch (err) {
       return response.status(403).json({ error: "Invalid token" });
    }
 }
 