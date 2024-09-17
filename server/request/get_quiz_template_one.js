import express from "express";
import Report_Status from "../../util/report_status.js";
import sqlite3 from "sqlite3";
import path from "path";

const router = express.Router();

router.get("/:test_id", async function (request, response) {
  try {
    const test_id = request.params.test_id;
    const specifications_table_data = await Get_Template_Data(test_id);

    Report_Status("success", "User quiz have been sent!");
    Report_Status("divider");

    return response.status(200).send({ message: "Datos encontrados con exito!", data: specifications_table_data });
  } catch (error) {
    Report_Status("divider");
    return response.status(400).send({ message: "Error al buscar datos..." });
  }
});

async function Get_Template_Data(test_id) {
  return new Promise((resolve, reject) => {
    const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
    const db = new sqlite3.Database(data_base_path);

    const user_id = 1;
    db.serialize(async () => {
      const specifications_table_query = db.prepare(/*sql*/ `
SELECT
    test.title as test_title,
    subject.text AS test_subject,
    question_thematic_area.text AS question_thematic_area,
    question_content_area.text AS question_content_area,
    question_objetive.text as question_objetive,
    specifications_table.performed_classes
FROM
    test
    JOIN subject ON subject.id = test.subject_id
    JOIN specifications_table ON specifications_table.test_id = test.id
    JOIN question_thematic_area ON question_thematic_area.id = specifications_table.thematic_area_id
    JOIN question_content_area ON question_content_area.id = specifications_table.content_id
    JOIN question_objetive ON question_objetive.id = specifications_table.objective_id
WHERE test.created_by = ? AND test.unique_id = ?;	
        `);

      // const questions_query = db.prepare(/*sql*/ `

      //     `);

      try {
        const data = {
          specifications_table: await Get_All_Query(specifications_table_query, [user_id, test_id]),
          // performed: await Get_All_Query(get_all_performed, [user_id]),
        };
        specifications_table_query.finalize();
        // get_all_performed.finalize();
        db.close();
        resolve(data);
      } catch (error) {
        Report_Status("error", error.message);
        specifications_table_query.finalize();
        db.close();
        reject();
      }
    });
  });
}

function Get_All_Query(query, parameters = []) {
  return new Promise((resolve, reject) => {
    query.all(parameters, function (error, row) {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}

export default router;
