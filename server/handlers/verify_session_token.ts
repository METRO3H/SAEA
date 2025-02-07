
import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export function Verify_Session_Token(request: any , response : Response, next : NextFunction) {
    const token = request.cookies.session_token;
    if (!token) return response.status(401).json({ error: "Unauthorized" });

    try {
       const decoded:any = jwt.verify(token, JWT_SECRET);


       if (!decoded || !decoded.teacher_id) throw new Error();
       
       request.user_data = decoded; 
      
       next();
    } catch (err) {
      console.error(err);
       return response.status(403).json({ error: "Invalid token" });
    }
 }
 