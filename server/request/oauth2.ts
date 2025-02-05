import { google, oauth2_v2 } from "googleapis";
import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Execute_Query } from "../database/db.js";
import { Verify_Session_Token } from "../handlers/verify_session_token.js";
import Report_Status from "../../util/report_status.js";
dotenv.config();

const router = express.Router();

// OAuth 2.0 configuration
const oauth2Client = new google.auth.OAuth2(
   process.env.OAUTH_CLIENT_ID,
   process.env.OAUTH_CLIENT_SECRET,
   process.env.OAUTH_REDIRECT_URIS
);

const jwt_secret = process.env.JWT_SECRET as string;

router.post("/", async (request, response) => {
   const oauth2_code = request.body.code;

   if (!oauth2_code) {
      return response.status(400).json({ error: "Missing authorization code" });
   }

   try {
      const { tokens } = await oauth2Client.getToken(oauth2_code);
      oauth2Client.setCredentials(tokens);
      const access_token = tokens.access_token as string;
      const refresh_token = tokens.refresh_token as string;

      // In milliseconds
      const expiry_date = tokens.expiry_date as number;

      const user_info = await google.oauth2("v2").userinfo.get({ auth: oauth2Client });

      const { success, error_message } = await Save_User_Data(user_info.data, access_token, refresh_token, expiry_date);

      if (!success) throw new Error(error_message);

      const jwt_token = Generate_JWT(user_info.data);

      response.cookie("session_token", jwt_token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax",
         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      });
      
      response.status(200).json({ success: true });

      Report_Status("success", `User ${user_info.data.email} logged in`);
      Report_Status("divider");
   } catch (err) {
      console.error("Error exchanging code for tokens:", err);
      response.status(500).json({ error: "Failed to exchange code for tokens" });
   }
});

router.get("/user_data", Verify_Session_Token, async (request: any, response: Response) => {

   const user_data = request.user_data || null;

   response.status(200).send({ success: true, user_data });
});

router.post("/logout", (request, response) => {
   response.clearCookie("session_token");
   response.status(200).send({ success: true });
});

function Generate_JWT(user_data: oauth2_v2.Schema$Userinfo) {
   const payload = { email: user_data.email, name: user_data.given_name, last_name: user_data.family_name };

   const jwt_token = jwt.sign(payload, jwt_secret, { expiresIn: "7d" });

   return jwt_token;
}

async function Save_User_Data(
   user_data: oauth2_v2.Schema$Userinfo,
   access_token: string,
   refresh_token: string,
   expiry_date: number
) {
   const google_id = user_data.id;
   const email = user_data.email;
   const name = user_data.given_name;
   const last_name = user_data.family_name;
   const expiry_date_seconds = Math.floor(expiry_date / 1000);

   const query = /*sql*/ ` CALL $SAVE_TEACHER(?, ?, ?, ?, ?, ?, ?)`;

   const [[db_response]]: any = await Execute_Query(query, [
      google_id,
      email,
      name,
      last_name,
      access_token,
      refresh_token,
      expiry_date_seconds,
   ]);

   return db_response;
}

export default router;
