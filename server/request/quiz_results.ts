import Express from "express";

import { Process_Request } from "./handle_request.js";
import Report_Status from "../../util/report_status.js";
import { Verify_Session_Token } from "../handlers/verify_session_token.js";
import { Get_Authorization } from "../handlers/oauth2_client.js";
import { Update_Quiz_Results } from "../handlers/update_quiz_results.js";
import { Execute_Query } from "@Database/db.js";
import Fix_Answers_Format from "../handlers/fix_answers_format.js";
import { Get_Quiz_Performed_Metadata } from "../handlers/get_quiz_performed_metadata.js";
const router = Express.Router();

router.get("/get/:performed_id", Verify_Session_Token, async function (request: any, response) {
   let message: string = "";
   await Process_Request(response, async () => {
      const teacher_id = request.user_data.teacher_id;
      const performed_id = request.params.performed_id;
      const { student_results, quiz_data } = await Retrieve_Quiz_Results_From_DB(performed_id);

      if (student_results.length === 0) {
         const oauth2_client = await Get_Authorization(teacher_id);
         const update_result = await Update_Quiz_Results(oauth2_client, performed_id);
         if (update_result) Report_Status("success", "Quiz performed results updated!");
      }

      quiz_data.questions = Fix_Answers_Format(quiz_data.questions);

      const { quiz_uuid, google_form_url } = await Get_Quiz_Performed_Metadata(teacher_id, performed_id);

      if (!quiz_uuid || !google_form_url)
         throw new Error(`Data related to quiz performed with id ${performed_id} not found`);


      message = "Quiz performed results retrieved!";

      response.status(200).send({ message, student_results, quiz_data: { ...quiz_data, google_form_url } });
      Report_Status("success", message);
      Report_Status("divider");
   });
});

router.post("/update/:performed_id", Verify_Session_Token, async function (request: any, response) {
   let message: string = "";
   await Process_Request(response, async () => {
      const teacher_id = request.user_data.teacher_id;
      const performed_id = request.params.performed_id;

      const oauth2_client = await Get_Authorization(teacher_id);
      const update_result = await Update_Quiz_Results(oauth2_client, performed_id);

      if (!update_result) throw new Error("Error al actualizar los resultados del quiz");

      message = "Quiz performed results updated!";
      response.status(200).send({ message });

      Report_Status("success", message);
      Report_Status("divider");
   });
});

async function Retrieve_Quiz_Results_From_DB(performed_id: string) {
   const query = /*sql*/ ` CALL $GET_QUIZ_RESULT_ALL(?)`;

   const [[db_result]]: any = await Execute_Query(query, [performed_id]);

   return db_result;
}

export default router;
