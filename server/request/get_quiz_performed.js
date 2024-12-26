import express from "express";
import Report_Status from "../../util/report_status.js";
import Get_Quiz_Data from "../handlers/get_quiz_one.js";
import sqlite3 from "sqlite3";
import path from "path";
const router = express.Router();

router.get("/:performed_id", async function (request, response) {
  try {
    const performed_id = request.params.performed_id;
    const is_performed = await Is_Performed(performed_id);
    if (!is_performed)
      return response.status(400).send({ message: "Datos no encontrados" });

    const { test_id, form_url } = await Get_Related_Data(performed_id);

    const performed_quiz_data = {
      ...(await Get_Quiz_Data(test_id)),
      google_form_url: form_url,
    };

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

async function Get_Related_Data(performed_id) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const db = new sqlite3.Database(data_base_path);
  const related_data_query = db.prepare(/*sql*/ `
      SELECT test_id, form_url FROM test_performed WHERE form_id = ?;
      `);

  const related_data = await Get_Query(related_data_query, [performed_id]);

  related_data_query.finalize();
  db.close();

  return related_data;
}

async function Is_Performed(form_id) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const db = new sqlite3.Database(data_base_path);
  const performed_query = db.prepare(/*sql*/ `
      SELECT COUNT(*) FROM test_performed WHERE form_id = ?;
      `);

  const performed = await Get_Query(performed_query, [form_id]);
  performed_query.finalize();
  db.close();

  const performed_count = Object.values(performed)[0]

  return performed_count;
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
