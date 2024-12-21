import express from "express";
import Report_Status from "../../util/report_status.js";
import Get_Quiz_Data from "../handlers/get_quiz_one.js";
import sqlite3 from "sqlite3";
import path from "path";
const router = express.Router();

router.get("/:performed_id", async function (request, response) {
  try {
    const performed_id = request.params.performed_id;
    
    const template_id = await Get_Template_ID(performed_id);
    const performed_quiz_data = await Get_Quiz_Data(template_id);

    Report_Status("success", "User quiz have been sent!");
    Report_Status("divider");

    return response
      .status(200)
      .send({ message: "Datos encontrados con exito!", data: performed_quiz_data });
  } catch (error) {
    Report_Status("divider");
    return response.status(400).send({ message: "Error al buscar datos..." });
  }
});

async function Get_Template_ID(performed_id) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const db = new sqlite3.Database(data_base_path);
  const template_id_query = db.prepare(/*sql*/ `
      SELECT test_id FROM test_performed WHERE form_id = ?;
      `);

  const template_id = (await Get_Query(template_id_query, [performed_id])).test_id;
  template_id_query.finalize();
  db.close();

  return template_id;
}

function Get_Query(query, parameters = []) {
  return new Promise((resolve, reject) => {
    query.get(parameters, function (error, row) {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}
export default router;
