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

      const query = /*sql*/ ` CALL $SAVE_QUIZ(?)`;

      const [[db_response]]: any = await Execute_Query(query, [quiz_data_json]);
      const quiz_uuid = db_response.quiz_uuid; 


      const message = "Quiz '" + quiz_data.quiz_title + "' guardado con exito";
      Report_Status("success", message);
      Report_Status("divider");

      response.status(200).send({ message, data: quiz_uuid });
   });
});

router.put("/update", async (request, response) => {
   await Process_Request(response, async () => {
      const quiz_data: Quiz = request.body;
      const quiz_uuid = quiz_data.quiz_id;
      const creation_date = quiz_data.creation_date;

      const quiz_data_json = JSON.stringify(quiz_data);

      const query = /*sql*/ ` CALL $UPDATE_QUIZ(?, ?, ?)`;

      await Execute_Query(query, [quiz_uuid, creation_date, quiz_data_json]);

      const message = "Quiz '" + quiz_data.quiz_title + "' actualizado con exito";
      Report_Status("success", message);

      response.status(200).send({ message });
   });
});

router.post("/generate", async (request, response) => {
   await Process_Request(response, async () => {
      const quiz_data: Quiz = request.body;
      const quiz_uuid = quiz_data.quiz_id;


      const message = "Google Form generado con exito";
      Report_Status("success", message);
      Report_Status("divider");

      response.status(200).send({ message });
   });
});

export default router;
