import express from "express";
import Generate_Form from "../API_google_forms/generate_form.js";
import { Save_Form } from "../database/request/save_form.js";
/* import test from "../API_google_forms/main.js"; */
const router = express.Router();

router.post("/", async function (request, response) {
  const data = request.body;
  console.log(JSON.stringify(data, null, 4));

/*   try {
    const form_URL = (await Generate_Form(data)) || "brufa";
    const save_form_result = await Save_Form(data);
    console.log(save_form_result)
    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    // Enviar una respuesta
    return response
      .status(200)
      .send({ message: "Cuestionario generado con éxito!", URL: form_URL });
  } catch (error) {
    console.error(error.message);
    return response.status(400).send({ message: "Error al ingresar los datos" });
  } */


});

export default router;
