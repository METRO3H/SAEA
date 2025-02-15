import Express from "express";

import { Process_Request } from "./handle_request.js";
import Report_Status from "../../util/report_status.js";
import { Verify_Session_Token } from "../handlers/verify_session_token.js";
import { Get_Authorization } from "../handlers/oauth2_client.js";
import { Update_Quiz_Results } from "../handlers/update_quiz_results.js";

const router = Express.Router();

router.get("/:performed_id", Verify_Session_Token, async function (request: any, response) {
   let message: string = "";
   await Process_Request(response, async () => {
      const teacher_id = request.user_data.teacher_id;
      const performed_id = request.params.performed_id;

      const oauth2_client = await Get_Authorization(teacher_id);

      const update_result = await Update_Quiz_Results(oauth2_client, performed_id);
      if (update_result) message = "Quiz performed results updated!";

      Report_Status("success", message);
      
      message = "Quiz performed results retrieved!";

      response.status(200).send({ message, data: "ok" });

      Report_Status("success", message);
      Report_Status("divider");
   });
});

export default router;
