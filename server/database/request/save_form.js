import sqlite3 from "sqlite3";
import path from "path";
import moment from "moment";
/* import { data } from "../data_test.js"; */
sqlite3.verbose();

export async function Save_Form(data_form) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");
  const db = new sqlite3.Database(data_base_path);
  console.log("\nGuardando Form en la base de datos...")
  try {
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const insert_test = db.prepare(query.insert_test);
        const insert_question = db.prepare(query.insert_question);
        const insert_test_question = db.prepare(query.insert_test_question);
        const insert_answer = db.prepare(query.insert_answer);
        const insert_test_question_answer = db.prepare(query.insert_test_question_answer);
        const get_test_id = db.prepare(query.select_test_id);
        const get_question_id = db.prepare(query.select_question_id);
        const get_answer_id = db.prepare(query.select_answer_id);

        db.run("BEGIN TRANSACTION");

        try {
          await Run_Query(insert_test, [data_form.title, data_form.created_by, date_time]);
          const test_id = (await Get_Query(get_test_id, [data_form.title, data_form.created_by]))
            .id;

          for (let question of data_form.questions) {
            await Run_Query(insert_question, [question.text, data_form.created_by, date_time]);

            const question_id = (
              await Get_Query(get_question_id, [question.text, data_form.created_by])
            ).id;

            await Run_Query(insert_test_question, [test_id, question_id]);

            for (let answer of question.answers) {
              await Run_Query(insert_answer, [answer.text, data_form.created_by, date_time]);
              const answer_id = (
                await Get_Query(get_answer_id, [answer.text, data_form.created_by])
              ).id;
              await Run_Query(insert_test_question_answer, [
                test_id,
                question_id,
                answer_id,
                answer.is_correct,
              ]);
            }
          }

          insert_test.finalize();
          insert_question.finalize();
          insert_test_question.finalize();
          insert_answer.finalize();
          insert_test_question_answer.finalize();
          get_test_id.finalize();
          get_question_id.finalize();
          get_answer_id.finalize();

          db.run("COMMIT");
          db.close();
          resolve("\nForm guardado en la base de datos con éxito!!");
        } catch (error) {
          console.error(error);
          db.run("ROLLBACK");
          db.close();
          resolve("\nError al guardar form en la base de datos!!");
        }
      });
    });
  } catch (error) {
    db.close();
    console.error(error);
    return "\nError al guardar form en la base de datos!!";
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

const query = {
  insert_test: /*sql*/ `
  INSERT OR IGNORE INTO test (title, created_by, creation_date) 
  VALUES (?, ?, ?);
  `,

  insert_question: /*sql*/ `
  INSERT OR IGNORE INTO question (text, created_by, creation_date) VALUES (?, ?, ?);
  `,

  insert_answer: /*sql*/ `
  INSERT OR IGNORE INTO answer (text, created_by, creation_date)
  VALUES (?, ?, ?)
  `,

  select_test_id: /*sql*/ `SELECT id FROM test WHERE title = ? AND created_by = ?`,
  select_question_id: /*sql*/ `SELECT id FROM question WHERE text = ? AND created_by = ?`,
  select_answer_id: /*sql*/ `SELECT id FROM answer WHERE text = ? AND created_by = ?`,

  insert_test_question: /*sql*/ `
  INSERT OR IGNORE INTO test_question (test_id, question_id) 
  VALUES (?, ?);
  `,

  insert_test_question_answer: /*sql*/ `
  INSERT OR IGNORE INTO test_question_answer (test_id, question_id, answer_id, is_correct)
  VALUES (?, ?, ?, ?)
  `,
};
