import express from "express";
import Generate_Form from "../API_google_forms/generate_form.js";
const router = express.Router();

router.post("/", async function (request, response) {
  const data = JSON.stringify(request.body, null, 4);

  const generate_form_reponse = await Generate_Form(data);

  // Enviar una respuesta
  response.send({message: generate_form_reponse});
});

export default router;
