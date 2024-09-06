import sqlite3 from "sqlite3";
import path from "path";
import Report_Status from "../../util/report_status.js";
export default async function get_quiz_all() {
  return new Promise((resolve, reject) => {
    const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
    const db = new sqlite3.Database(data_base_path);

    const user_id = 1;
    db.serialize(async () => {
      const get_all_test = db.prepare(/*sql*/ `
    SELECT 
        test.id, test.unique_id,test.title AS "test_title", subject.text AS "subject", test.creation_date AS "creation_date",  test_performed.test_id AS "template_id",  test_performed.form_id, test_performed.form_url,
        test_performed.date AS "generated_date"
    FROM test 
    JOIN subject ON subject.id = test.subject_id
    LEFT JOIN test_performed ON test_performed.test_id = test.unique_id 
    WHERE test.created_by = ?
    ORDER BY test.creation_date DESC;
        `);
      try {
        const data = await Get_All_Query(get_all_test, [user_id]);
        get_all_test.finalize();
        db.close();
        resolve(data)
      } catch (error) {
        Report_Status("error", error.message);
        get_all_test.finalize();
        db.close();
        reject()
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
