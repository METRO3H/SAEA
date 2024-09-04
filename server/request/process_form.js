import express from "express";
import Report_Status from "../../util/report_status.js";
import Generate_Form from "../API_google_forms/generate_form.js";
import { Save_Form } from "../handlers/save_form.js";
import chalk from "chalk";

// import test from "../API_google_forms/test.js";

const router = express.Router();
router.post("/save", async (request, response) => {
  Report_Status("status", "Guardando Form en la base de datos...");
  await Process_Form(request, response, Save_Form, "Guardado");
});
router.post("/generate", async (request, response) => {
  Report_Status("status", "Generando Google Form...");
  await Process_Form(request, response, Generate_Form, "Generado");
});

async function Process_Form(request, response, Process, success_message) {
  const data = request.body;
  try {
    /* const form_URL = (await Generate_Form(data)) || "Bob"; */

    const process_result = await Process(data);

    if (process_result.status == false) throw new Error("Error al procesar los datos.");
    

    Report_Status("success", process_result.message);

    const message = `Quiz ${success_message} con éxito!`;

    if (process_result.data) Report_Status("success", chalk.blueBright(process_result.data));
    Report_Status("divider");
    return response.status(200).send({ message: message, data: process_result.data || "" });
  } catch (error) {
    Report_Status("error", error.message);
    Report_Status("divider");
    return response.status(400).send({ message: "Error al procesar los datos" });
  }
}

export default router;
