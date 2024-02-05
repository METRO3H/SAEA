import express from "express";
import Generate_Form from "../API_google_forms/generate_form.js";
import test from "../API_google_forms/main.js";
const router = express.Router();

router.post("/", async function (request, response) {
  const data = request.body;
    console.log(data)
  try {
    const form_URL = await Generate_Form(data);
    // Enviar una respuesta
    return response.status(200).send({message: form_URL});
    
  } catch (error) {
    console.error(error);
    return response.status(400).send({message: "Error al ingresar los datos"});
  }
});

export default router;
