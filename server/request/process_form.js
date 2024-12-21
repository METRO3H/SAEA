import express from "express";
import Report_Status from "../../util/report_status.js";
import Generate_Form from "../API_google_forms/generate_form.js";
import { Save_Quiz } from "../handlers/save_quiz.js";


// import test from "../API_google_forms/test.js";

const router = express.Router();
router.post("/save", async (request, response) => {
  Report_Status("status", "Guardando Form en la base de datos...");
  await Process_Form(request, response, Save_Quiz);
});
router.post("/generate", async (request, response) => {
  Report_Status("status", "Generando Google Form...");
  await Process_Form(request, response, Generate_Form);
});

async function Process_Form(request, response, Process) {
  const data = request.body;

  try {
    const process_result = await Process(data);

    const response_data = process_result.data ? process_result.data : ""

    return response.status(200).send({ data: response_data });
  } catch (error) {
    console.error(error);
    return response.status(400).send({ message: "Error al procesar los datos" });
  }
}

export default router;
