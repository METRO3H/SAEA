import express from "express";
import Report_Status from "../../util/report_status.js";
import get_quiz_all from "../request/get_quiz_all.js";
import Print_JSON_Table from "../../util/print_json_table.js";
const router = express.Router();

router.get("/", async function (request, response) {
  try {
    // const get_quiz_all_result = await get_quiz_all();
    console.log(request.params)

    Report_Status("success", "User quiz have been sent!");
    Report_Status("divider");

    return response.status(200).send(get_quiz_all_result);
  } catch (error) {
    Report_Status("error", error.message);
    Report_Status("divider");
    return response.status(400).send({ message: "Error al buscar datos..." });
  }
});

function Get_Specifications_Table_Data(){

}

export default router;
