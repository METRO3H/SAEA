import express from "express";
import Report_Status from "../../util/report_status.js";
import { Quiz } from "@QuizTypes";
import { Process_Request } from "./handle_request.js";
import { Is_Drafted } from "../handlers/is_drafted.js";
import { Get_Quiz } from "../handlers/get_quiz.js";
import { Verify_Session_Token } from "../handlers/verify_session_token.js";

const router = express.Router();

router.get("/:quiz_uuid", Verify_Session_Token,async function (request:any, response) {
   let message: string = "";

   await Process_Request(response, async () => {
      const teacher_id = request.user_data.teacher_id;
      const quiz_uuid = request.params.quiz_uuid;
      const is_drafted = await Is_Drafted(teacher_id, quiz_uuid);

      if (!is_drafted) {
         message = "Quiz not found!";
         response.status(404).send({ message });
         Report_Status("error", message);
         Report_Status("divider");
         return;
      }

      const quiz_data: Quiz = await Get_Quiz(quiz_uuid);

      message = "Quiz draft found!";
      const server_response = {
         message: message,
         data: JSON.stringify(quiz_data),
      };

      response.status(200).send(server_response);

      Report_Status("success", message);
      Report_Status("divider");
   });
});

export default router;
