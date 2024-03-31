import sqlite3 from "sqlite3";
import path from "path";
import moment from "moment";
/* import { data } from "../data_test.js"; */
sqlite3.verbose();

export async function Save_Form(data_form) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");
  const db = new sqlite3.Database(data_base_path);
  try {
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const sql = new Query(db);

        db.run("BEGIN TRANSACTION");

        try {
          await Run_Query(sql.Insert.test, [data_form.title, data_form.created_by, date_time]);
          const test_id = (
            await Get_Query(sql.Get.test_id, [data_form.title, data_form.created_by])
          ).id;

          for (let question of data_form.questions.content) {
            await Run_Query(sql.Insert.question, [question.text, data_form.created_by, date_time]);

            const question_id = (
              await Get_Query(sql.Get.question_id, [question.text, data_form.created_by])
            ).id;

            await Run_Query(sql.Insert.test_question, [test_id, question_id]);

            for (let answer of question.answers) {
              await Run_Query(sql.Insert.answer, [answer.text, data_form.created_by, date_time]);
              const answer_id = (
                await Get_Query(sql.Get.answer_id, [answer.text, data_form.created_by])
              ).id;
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
      question: db.prepare(/*sql*/ `
      INSERT OR IGNORE INTO question (text, created_by, creation_date) VALUES (?, ?, ?);
      `),
      test_question: db.prepare(/*sql*/ `
      INSERT OR IGNORE INTO test_question (test_id, question_id) 
      VALUES (?, ?);
      `),
      answer: db.prepare(/*sql*/ `
      INSERT OR IGNORE INTO answer (text, created_by, creation_date)
      VALUES (?, ?, ?)
      `),
      test_question_answer: db.prepare(/*sql*/ `
      INSERT OR IGNORE INTO test_question_answer (test_id, question_id, answer_id, is_correct)
      VALUES (?, ?, ?, ?)
      `),
    };

    this.Get = {
      test_id: db.prepare(/*sql*/ `SELECT id FROM test WHERE title = ? AND created_by = ?`),
      question_id: db.prepare(/*sql*/ `SELECT id FROM question WHERE text = ? AND created_by = ?`),
      answer_id: db.prepare(/*sql*/ `SELECT id FROM answer WHERE text = ? AND created_by = ?`),
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
}
