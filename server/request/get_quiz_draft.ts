import express from "express";
import { Process_Request } from "./handle_request.js";
import { Fetch_Data } from "../database/db.js";
import Report_Status from "../../util/report_status.js";
import { Quiz } from "@QuizTypes";

const router = express.Router();

router.get("/:quiz_uuid", async function (request, response) {
   let message: string = "";
   await Process_Request(response, async () => {
      const quiz_uuid = request.params.quiz_uuid;
      const is_drafted: boolean = await Is_Drafted(quiz_uuid);

      if (!is_drafted) {
         message = "Quiz not found!";
         response.status(404).send({ message });
         Report_Status("error", message);
         Report_Status("divider");
         return;
      }

      const quiz_data: Quiz = await Get_Quiz_Draft(quiz_uuid);

      message = "Quiz found!";
      const server_response = {
         message: message,
         data: quiz_data,
      };

      response.status(200).send(server_response);

      Report_Status("success", message);
      Report_Status("divider");
   });
});

async function Is_Drafted(quiz_uuid: string): Promise<boolean> {
   const query = /*sql*/ ` 
        SELECT 
        NOT EXISTS (
            SELECT 1 
            FROM quiz_performed 
            JOIN quiz 
            ON quiz.id = quiz_performed.quiz_id
            WHERE quiz.uuid = ?
        ) AS is_drafted
    `;

   const [db_response]: any = await Fetch_Data(query, [quiz_uuid]);

   const is_drafted = db_response.is_drafted;

   return is_drafted;
}

async function Get_Quiz_Draft(quiz_uuid: string) {
   const query = /*sql*/ `SELECT Get_Quiz(?) AS quiz_data`;
   const [db_response]: any = await Fetch_Data(query, [quiz_uuid]);
   const quiz_data: Quiz = db_response.quiz_data;
   return quiz_data;
}

export default router;
