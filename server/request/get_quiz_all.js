import express from "express";
import Report_Status from "../../util/report_status.js";
import get_quiz_all from "../handlers/get_quiz_all.js";
const router = express.Router();

router.get("/", async function (request, response) {
  try {
    const get_quiz_all_result = await get_quiz_all();
    /* console.log(get_quiz_all_result); */
    /* Print_JSON_Table(get_quiz_all_result) */
    Report_Status("success", "User quizzes have been sent!");
    Report_Status("divider");

    return response.status(200).send(get_quiz_all_result);
  } catch (error) {
    Report_Status("error", error.message);
    Report_Status("divider");
    return response.status(400).send({ message: "Error al buscar datos..." });
  }
});

export default router;
