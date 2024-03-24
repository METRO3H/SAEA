import express from "express";
import Print_JSON_Table from "../../util/print_json_table.js";
import Report_Status from "../../util/report_status.js";
import Generate_Form from "../API_google_forms/generate_form.js";
import { Save_Form } from "../database/request/save_form.js";
/* import test from "../API_google_forms/test.js"; */

const router = express.Router();
router.post("/", async function (request, response) {
  const data = request.body;
  /*   Print_JSON_Table(data); */

  try {
    /* const form_URL = (await Generate_Form(data)) || "Bob"; */
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    Report_Status("Guardando Form en la base de datos...");
    const save_form_result = await Save_Form(data);
    Report_Status(save_form_result);

    // Enviar una respuesta
    return response.status(200).send({ message: "Cuestionario guardado con éxito!" });
  } catch (error) {
    Report_Status(error.message);
    return response.status(400).send({ message: "Error al ingresar los datos" });
  }
});

export default router;
