import express from "express";
import Report_Status from "../../util/report_status.js";
import sqlite3 from "sqlite3";
import path from "path";
import { Process_Request } from "./handle_request.js";
import { Fetch_Data } from "../database/db.js";
import { Get_Quiz } from "../handlers/get_quiz.js";
import { Quiz } from "@QuizTypes";
const router = express.Router();

router.get("/:performed_id", async function (request, response) {
   let message: string = "";
   await Process_Request(response, async () => {
      const performed_id = request.params.performed_id;

      const { quiz_uuid, google_form_url } = await Get_Related_Data(performed_id);

      if (!quiz_uuid || !google_form_url)
        throw new Error(`Data related to quiz performed with id ${performed_id} not found`);

      const quiz_data: Quiz = await Get_Quiz(quiz_uuid);

      const data = {
         ...quiz_data,
         google_form_url,
      };

      message = "Quiz performed found!";
      
      response.status(200).send({ message, data });

      Report_Status("success", message);
      Report_Status("divider");
   });
});

async function Get_Related_Data(performed_id: string) {
   const query = /*sql*/ `
      SELECT quiz.uuid AS quiz_uuid, google_form_url FROM quiz_performed
      JOIN quiz ON quiz.id = quiz_performed.quiz_id 
      WHERE google_form_id = ?
      `;
   const [db_response]: any = await Fetch_Data(query, [performed_id]);

   if (!db_response) throw new Error(`Quiz performed with id ${performed_id} not found`);

   return db_response;
}

export default router;
