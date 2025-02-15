import express from "express";
import Report_Status from "../../util/report_status.js";
import { Process_Request } from "./handle_request.js";

import { Get_Quiz } from "../handlers/get_quiz.js";
import { Quiz } from "@QuizTypes";
import { Verify_Session_Token } from "../handlers/verify_session_token.js";
import { Get_Quiz_Performed_Metadata } from "../handlers/get_quiz_performed_metadata.js";
const router = express.Router();

router.get("/:performed_id", Verify_Session_Token, async function (request:any, response) {
   let message: string = "";
   await Process_Request(response, async () => {
      const teacher_id = request.user_data.teacher_id;
      const performed_id = request.params.performed_id;

      const { quiz_uuid, google_form_url } = await Get_Quiz_Performed_Metadata(teacher_id, performed_id);

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



export default router;
