import express from "express";
import Report_Status from "../../util/report_status.js";
import Generate_Form from "../API_google_forms/generate_form.js";
import { Save_Quiz } from "../handlers/save_quiz.js";
import { randomUUID } from "crypto";
import moment from "moment";

const router = express.Router();
router.post("/save", async (request, response) => {
  Report_Status("status", "Guardando Form en la base de datos...");

  const quiz_data = request.body;
  const unique_id = randomUUID();
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");
  await Process_Form(response, () => Save_Quiz(quiz_data, unique_id, date_time));
});

router.post("/update", async (request, response) => {
  Report_Status("status", "Actualizando Form en la base de datos...");
  const quiz_data = request.body;
  const unique_id = quiz_data.quiz_id;
  const date_time = quiz_data.quiz_creation_date;
  await Process_Form(response, () => Save_Quiz(quiz_data, unique_id, date_time));
});

router.post("/generate", async (request, response) => {
  Report_Status("status", "Generando Google Form...");
  const quiz_data = request.body;
  await Process_Form(response, () => Generate_Form(quiz_data));
});


async function Process_Form(response, Process) {

  try {
    const process_result = await Process();

    const response_data = process_result.data ? process_result.data : ""

    return response.status(200).send({ data: response_data });
  } catch (error) {
    console.error(error);
    return response.status(400).send({ message: "Error al procesar los datos" });
  }
}

export default router;
