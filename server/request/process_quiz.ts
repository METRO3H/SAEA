import type { Quiz } from "@QuizTypes";
import express from "express";
import Report_Status from "../../util/report_status.js";
import Generate_Google_Form from "../handlers/generate_google_form.js";
import { Execute_Query } from "../database/db.js";
import { Process_Request } from "./handle_request.js";
import { Is_Drafted } from "../handlers/is_drafted.js";
import { Get_Quiz } from "../handlers/get_quiz.js";
import { Verify_Session_Token } from "../handlers/verify_session_token.js";
import { Get_Authorization } from "../handlers/oauth2_client.js";


const router = express.Router();

router.post("/save", Verify_Session_Token, async (request:any, response) => {
   await Process_Request(response, async () => {
      const teacher_id = request.user_data.teacher_id;
      const quiz_data: Quiz = request.body;

      const quiz_data_json = JSON.stringify(quiz_data);

      const query = /*sql*/ ` CALL $SAVE_QUIZ(?, ?)`;

      const [[db_response]]: any = await Execute_Query(query, [teacher_id, quiz_data_json]);
      const quiz_uuid = db_response.quiz_uuid;

      const message = "Quiz '" + quiz_data.quiz_title + "' guardado con exito";
      Report_Status("success", message);
      Report_Status("divider");

      response.status(200).send({ message, data: quiz_uuid });
   });
});

router.put("/update",Verify_Session_Token, async (request:any, response) => {
   await Process_Request(response, async () => {
      const teacher_id = request.user_data.teacher_id;
      const quiz_data: Quiz = request.body;
      const quiz_uuid = quiz_data.quiz_id;
      const creation_date = quiz_data.creation_date;

      const quiz_data_json = JSON.stringify(quiz_data);

      const query = /*sql*/ ` CALL $UPDATE_QUIZ(?, ?, ?, ?)`;

      await Execute_Query(query, [teacher_id, quiz_uuid, creation_date, quiz_data_json]);

      const message = "Quiz '" + quiz_data.quiz_title + "' actualizado con exito";
      Report_Status("success", message);

      response.status(200).send({ message });
   });
});

router.post("/generate",Verify_Session_Token, async (request:any, response) => {
   let message: string = "";
   await Process_Request(response, async () => {
      const teacher_id = request.user_data.teacher_id;
      const quiz_uuid = request.body.quiz_uuid;

      const is_drafted = await Is_Drafted(teacher_id, quiz_uuid);

      if (!is_drafted) {
         message = "Quiz not found!";
         response.status(404).send({ message });
         Report_Status("error", message);
         Report_Status("divider");
         return;
      }

      const quiz_data: Quiz = await Get_Quiz(quiz_uuid);

      const oauth2_client = await Get_Authorization(teacher_id);

      const { google_form_url, google_form_id } = await Generate_Google_Form(oauth2_client, quiz_data);

      const query = /*sql*/ ` CALL $SAVE_PERFORMED_QUIZ(?, ?, ?)`;

      const [db_response]: any = await Execute_Query(query, [quiz_uuid, google_form_id, google_form_url]);

      const [success, error_message] = db_response;

      if (!success) throw new Error(error_message);

      message = "Google Form '"+ quiz_data.quiz_title + "' generado con exito";
      Report_Status("success", message);
      Report_Status("divider");

      response.status(200).send({ message, data: { google_form_url, google_form_id } });
   });
});

export default router;
