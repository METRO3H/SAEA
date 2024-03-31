import sqlite3 from "sqlite3";
import path from "path";
import moment from "moment";
/* import { data } from "../data_test.js"; */
sqlite3.verbose();

export async function Save_Form(data_form) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");
  const created_by = data_form.created_by;
  const db = new sqlite3.Database(data_base_path);
  try {
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const sql = new Query(db);

        db.run("BEGIN TRANSACTION");

        try {
          await Run_Query(sql.Insert.test, [data_form.title, created_by, date_time]);
          const test_id = (
            await Get_Query(sql.Get.test_id, [data_form.title, created_by, date_time])
          ).id;
          const metadata = data_form.questions.metadata;
          for (const [index, question] of data_form.questions.content.entries()) {
            const { thematic_area, content, objective, skill } = metadata[index];
            await Run_Query(sql.Insert.question, [question.text, created_by, date_time]);
            await Run_Query(sql.Insert.thematic_area, [thematic_area, created_by, date_time]);
            await Run_Query(sql.Insert.content_area, [content, created_by, date_time]);
            await Run_Query(sql.Insert.objective, [objective, created_by, date_time]);
            await Run_Query(sql.Insert.skill, [skill, created_by, date_time]);

            const question_id = (await Get_Query(sql.Get.question_id, [question.text, created_by]))
              .id;
            const thematic_area_id = (await Get_Query(sql.Get.axis_id, [thematic_area, created_by]))
              .id;
            const content_id = (await Get_Query(sql.Get.content_id, [content, created_by])).id;
            const objetive_id = (await Get_Query(sql.Get.objetive_id, [objective, created_by])).id;
            const skill_id = (await Get_Query(sql.Get.skill_id, [skill, created_by])).id;

            await Run_Query(sql.Insert.test_question, [
              test_id,
              question_id,
              thematic_area_id,
              content_id,
              objetive_id,
              skill_id,
            ]);

            for (let answer of question.answers) {
              await Run_Query(sql.Insert.answer, [answer.text, created_by, date_time]);
              const answer_id = (await Get_Query(sql.Get.answer_id, [answer.text, created_by])).id;
              await Run_Query(sql.Insert.test_question_answer, [
                test_id,
                question_id,
                answer_id,
                answer.is_correct,
              ]);
            }
          }

          sql.Finalize();

          db.run("COMMIT");
          db.close();
          resolve("Form guardado en la base de datos con éxito!!");
        } catch (error) {
          console.error(error);
          db.run("ROLLBACK");
          db.close();
          reject("Error al guardar form en la base de datos!!");
        }
      });
    });
  } catch (error) {
    db.close();
    console.error(error);
    return "Error al guardar form en la base de datos!!";
  }
}

function Run_Query(query, parameters = []) {
  return new Promise((resolve, reject) => {
    query.run(parameters, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve("Correcto");
      }
    });
  });
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

class Query {
  Insert = {};
  Get = {};
  constructor(db) {
    this.prepare(db);
    return;
  }
  prepare(db) {
    this.Insert = {
      test: db.prepare(/*sql*/ `
      INSERT OR IGNORE INTO test (title, created_by, creation_date) 
      VALUES (?, ?, ?);
      `),
      question: db.prepare(this.Frequent_Insertion("question")),
      answer: db.prepare(this.Frequent_Insertion("answer")),
      thematic_area: db.prepare(this.Frequent_Insertion("question_thematic_area")),
      content_area: db.prepare(this.Frequent_Insertion("question_content_area")),
      objective: db.prepare(this.Frequent_Insertion("question_objetive")),
      skill: db.prepare(this.Frequent_Insertion("question_skill")),
      test_question: db.prepare(/*sql*/ `
      INSERT OR IGNORE 
      INTO test_question (test_id, question_id, thematic_area_id, content_id, objetive_id, skill_id) 
      VALUES (?, ?, ?, ?, ?, ?);
      `),
      test_question_answer: db.prepare(/*sql*/ `
      INSERT OR IGNORE INTO test_question_answer (test_id, question_id, answer_id, is_correct)
      VALUES (?, ?, ?, ?)
      `),
    };

    this.Get = {
      test_id: db.prepare(
        /*sql*/ `SELECT id FROM test WHERE title = ? AND created_by = ? AND creation_date = ?`
      ),
      question_id: db.prepare(this.Frequent_Get("question")),
      answer_id: db.prepare(this.Frequent_Get("answer")),
      axis_id: db.prepare(this.Frequent_Get("question_thematic_area")),
      content_id: db.prepare(this.Frequent_Get("question_content_area")),
      objetive_id: db.prepare(this.Frequent_Get("question_objetive")),
      skill_id: db.prepare(this.Frequent_Get("question_skill")),
    };
    return;
  }

  Finalize() {
    for (let key in this.Insert) {
      if (this.Insert.hasOwnProperty(key)) {
        this.Insert[key].finalize();
      }
    }

    for (let key in this.Get) {
      if (this.Get.hasOwnProperty(key)) {
        this.Get[key].finalize();
      }
    }
    return;
  }
  Frequent_Insertion(table) {
    return /*sql*/ `
    INSERT OR IGNORE INTO ${table} (text, created_by, creation_date) VALUES (?, ?, ?);
    `;
  }
  Frequent_Get(table) {
    return /*sql*/ `SELECT id FROM ${table} WHERE text = ? AND created_by = ?`;
  }
}
