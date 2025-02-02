import type { Quiz } from "@QuizTypes";
import { google } from "googleapis";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// OAuth 2.0 configuration
const oauth2Client = new google.auth.OAuth2(
   process.env.OAUTH_CLIENT_ID,
   process.env.OAUTH_CLIENT_SECRET,
   process.env.OAUTH_REDIRECT_URIS
);

router.post("/", async (request, response) => {
   const oauth2_code = request.body.code;

   if (!oauth2_code) {
      return response.status(400).json({ error: "Missing authorization code" });
   }

   try {
      const { tokens } = await oauth2Client.getToken(oauth2_code);

      oauth2Client.setCredentials(tokens);

      // const resultoso = await generate_google_form(oauth2Client, test_quiz);

      console.log(tokens);

      response.status(200).send({ success: true });
   } catch (err) {
      console.error("Error exchanging code for tokens:", err);
      response.status(500).json({ error: "Failed to exchange code for tokens" });
   }
});


export default router;
