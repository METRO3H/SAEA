import express from "express";
import Print_JSON_Table from "../../util/print_json_table.js";
import Generate_Form from "../API_google_forms/generate_form.js";
import { Save_Form } from "../database/request/save_form.js";
/* import test from "../API_google_forms/test.js"; */

const router = express.Router();
router.post("/", async function (request, response) {
  const data = request.body;
  Print_JSON_Table(data);

  response.status(200).send({ message: "BOB XD" });
  try {
    /* const form_URL = (await Generate_Form(data)) || "Bob"; */
    const save_form_result = await Save_Form(data);
    console.log(save_form_result);
    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    // Enviar una respuesta
    return response.status(200).send({ message: "Cuestionario guardado con éxito!", URL: form_URL });
  } catch (error) {
    console.error(error.message);
    return response.status(400).send({ message: "Error al ingresar los datos" });
  }
});

export default router;
