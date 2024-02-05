import express from "express";
import Generate_Form from "../API_google_forms/generate_form.js";
import test from "../API_google_forms/main.js";
const router = express.Router();

router.post("/", async function (request, response) {
  const data = request.body;
  const form_URL = await Generate_Form(data);

  // Enviar una respuesta
  response.send({message: form_URL});
});

export default router;
