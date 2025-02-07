import express from "express";
import Report_Status from "../../util/report_status.js";
import { Fetch_Data } from "../database/db.js"; // Asegúrate de importar la función de cierre del pool
import { Process_Request } from "./handle_request.js";
import { Verify_Session_Token } from "../handlers/verify_session_token.js";
const router = express.Router();

router.get("/", Verify_Session_Token, async function (request:any, response) {
  
  await Process_Request(response, async () => {

      const teacher_id = request.user_data.teacher_id;

      const query:string = /*sql*/ `CALL $GET_QUIZZES(?)`;
      
      const db_response: any =  await Fetch_Data(query, [teacher_id]);

      const [drafts, performed] = db_response;
      
      const quizzes = {
         drafts: drafts,
         performed: performed
      }

      Report_Status("success", "User quizzes have been sent!");
      Report_Status("divider");
     response.status(200).send(quizzes);

  });

});

export default router;
