import sqlite3 from "sqlite3";
import path from "path";
import moment from "moment";
import { randomUUID } from "crypto";
import Query from "../database/querys/Query.js";

/* import { data } from "../data_test.js"; */

sqlite3.verbose();

export async function Save_Form(data_form) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");
  const UNIQUE_ID = randomUUID();
  const title = data_form.title;
  const created_by = data_form.created_by;
  const subject = data_form.specifications_table.subject;

  const skills = data_form.specifications_table.skills;
  const table_body = data_form.specifications_table.table_body;

  const metadata = data_form.questions.metadata;
  const db = new sqlite3.Database(data_base_path);
  try {
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const sql = new Query(db);

        db.run("BEGIN TRANSACTION");

        try {
          await Run_Query(sql.Insert.subject, [subject, created_by, date_time]);
          const subject_id = (await Get_Query(sql.Get.subject_id, [subject, created_by])).id;

          await Run_Query(sql.Insert.test, [UNIQUE_ID, title, subject_id, created_by, date_time]);
          const test_id = (await Get_Query(sql.Get.test_id, [title, created_by, date_time])).id;

          skills.forEach(
            async (skill) => await Run_Query(sql.Insert.skill, [skill, created_by, date_time])
          );

          table_body.forEach(async (row) => {
            await Run_Query(sql.Insert.thematic_area, [row.thematic_area, created_by, date_time]);
            await Run_Query(sql.Insert.content_area, [row.content, created_by, date_time]);
            await Run_Query(sql.Insert.objective, [row.objective, created_by, date_time]);

            await Run_Query(sql.Insert.specifications_table, [
              test_id,
              row.thematic_area,
              row.content,
              row.objective,
              row.performed_classes,
            ]);

            row.skills.forEach(async (question_range, index) => {
              if (question_range.trim() !== "") {
                await Run_Query(sql.Insert.specifications_table_skill, [
                  test_id,
                  row.thematic_area,
                  row.content,
                  row.objective,
                  skills[index],
                  index,
                  question_range,
                ]);
              }
            });
          });

          for (const [index, question] of data_form.questions.content.entries()) {
            const { thematic_area, content, objective, skill } = metadata[index];

            await Run_Query(sql.Insert.question, [question.text, created_by, date_time]);

            const question_id = (await Get_Query(sql.Get.question_id, [question.text, created_by]))
              .id;

            await Run_Query(sql.Insert.test_question_metadata_2, [
              test_id,
              question_id,
              thematic_area,
              content,
              objective,
              skill,
            ]);

            await Run_Query(sql.Insert.test_question_metadata, [
              test_id,
              question_id,
              test_id,
              thematic_area,
              content,
              objective,
              (index + 1)
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

          db.run("COMMIT");
          sql.Finalize();
          db.close();
          resolve({
            status: true,
            message: "Form guardado en la base de datos con éxito!!",
            data: UNIQUE_ID,
          });
        } catch (error) {
          console.error(error);
          db.run("ROLLBACK");
          sql.Finalize();
          db.close();
          reject({ status: false, message: "Error al guardar form en la base de datos!!" });
        }
      });
    });
  } catch (error) {
    db.close();
    console.error(error);
    return { status: false, message: "Error al guardar form en la base de datos!!" };
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
