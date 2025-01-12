import express from "express";
import Report_Status from "../../util/report_status.js";
import { Execute_Query } from "../database/db.js"; // Asegúrate de importar la función de cierre del pool
import { Process_Request } from "./handle_request.js";
import type { Quiz } from "@QuizTypes";
const router = express.Router();

router.get("/", async function (request, response) {
  
  await Process_Request(response, async () => {
      const query:string = /*sql*/ `SELECT Get_Quiz_All_Draft() AS "result"`;
      
      const db_response: any =  await Execute_Query(query);

      const quizzes = db_response[0]?.result;

      const result = JSON.stringify(quizzes, null, 2);
       
      console.log(quizzes);

      Report_Status("success", "User quizzes have been sent!");
      Report_Status("divider");
     response.status(200).send(quizzes);

  });

});

export default router;
