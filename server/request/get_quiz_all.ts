import express from "express";
import Report_Status from "../../util/report_status.js";
import { Execute_Query } from "../database/db.js"; // Asegúrate de importar la función de cierre del pool
import { Process_Request } from "./handle_request.js";
const router = express.Router();

router.get("/", async function (request, response) {
  
  await Process_Request(response, async () => {
      const query:string = /*sql*/ `CALL $GET_QUIZZES()`;
      
      const db_response: any =  await Execute_Query(query);

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
