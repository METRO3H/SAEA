import express from "express";
import Report_Status from "../../util/report_status.js";
import Get_Draft_Data from "../handlers/get_quiz_one.js";
import sqlite3 from "sqlite3";
import path from "path";
const router = express.Router();

router.get("/:test_id", async function (request, response) {
  try {
    const test_id = request.params.test_id;
    const is_drafted = await Is_Drafted(test_id);

    if(!is_drafted)
      return response.status(400).send({ message: "Datos no encontrados" });

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

async function Is_Drafted(test_id) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const db = new sqlite3.Database(data_base_path);
  const drafted_query = db.prepare(/*sql*/ `
      SELECT COUNT(*) FROM test 
      WHERE unique_id = ?
      AND NOT EXISTS (SELECT 1 FROM test_performed WHERE test_performed.test_id = test.unique_id)
      `);

  const drafted = await Get_Query(drafted_query, [test_id]);
  drafted_query.finalize();
  db.close();

  const drafted_count = Object.values(drafted)[0]

  return drafted_count;
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
