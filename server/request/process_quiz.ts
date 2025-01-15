import express from "express";
import Report_Status from "../../util/report_status.js";
import type { Quiz } from "@QuizTypes";
import { Execute_Query } from "../database/db.js"; // Asegúrate de importar la función de cierre del pool
import { Process_Request } from "./handle_request.js";
const router = express.Router();

router.post("/save", async (request, response) => {
   await Process_Request(response, async () => {
      const quiz_data: Quiz = request.body;

      const quiz_data_json = JSON.stringify(quiz_data);

      const query = /*sql*/ ` CALL $PROCESS_QUIZ(?)`;

      await Execute_Query(query, [quiz_data_json]);

      const message = "Quiz '" + quiz_data.quiz_title + "' guardado con exito";
      Report_Status("success", message);

      response.status(200).send({ message });
   });
});

export default router;
