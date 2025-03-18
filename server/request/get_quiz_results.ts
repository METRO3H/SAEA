import Express from "express";

import { Process_Request } from "./handle_request.js";
import Report_Status from "../../util/report_status.js";
import { Verify_Session_Token } from "../handlers/verify_session_token.js";
import { Get_Authorization } from "../handlers/oauth2_client.js";
import { Update_Quiz_Results } from "../handlers/update_quiz_results.js";
import { Execute_Query } from "@Database/db.js";
const router = Express.Router();

router.get("/:performed_id", Verify_Session_Token, async function (request: any, response) {
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

      message = "Quiz performed results retrieved!";

      response.status(200).send({ message, student_results, quiz_data });

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
