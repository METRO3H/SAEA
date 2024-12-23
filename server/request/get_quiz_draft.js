import express from "express";
import Report_Status from "../../util/report_status.js";
import Get_Draft_Data from "../handlers/get_quiz_one.js";

const router = express.Router();

router.get("/:test_id", async function (request, response) {
  try {
    const test_id = request.params.test_id;
    const specifications_table_data = await Get_Draft_Data(test_id);

    Report_Status("success", "User quiz have been sent!");
    Report_Status("divider");

    return response
      .status(200)
      .send({ message: "Datos encontrados con exito!", data: specifications_table_data });
  } catch (error) {
    Report_Status("divider");
    return response.status(400).send({ message: "Error al buscar datos..." });
  }
});



export default router;
