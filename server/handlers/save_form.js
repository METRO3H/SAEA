import sqlite3 from "sqlite3";
import path from "path";
import moment from "moment";
import { randomUUID } from "crypto";
import Query from "../database/querys/Query.js";
import Report_Status from "../../util/report_status.js";
sqlite3.verbose();

export async function Save_Form(data_form) {
  // console.log(data_form);
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");
  const UNIQUE_ID = randomUUID();
  const title = data_form.quiz_title;
  const created_by = data_form.created_by;
  const subject = data_form.quiz_subject;

  const skills = data_form.specifications_table.quiz_skills;
  const table_body = data_form.specifications_table.items;

  const db = new sqlite3.Database(data_base_path);
  try {
    return new Promise((resolve, reject) => {
      db.serialize(async () => {
        const sql = new Query(db);

        db.run("BEGIN TRANSACTION");

        try {
          // console.log(subject, created_by, date_time);
          await Run_Query(sql.Insert.subject, [subject, created_by, date_time]);

          const subject_id = (await Get_Query(sql.Get.subject_id, [subject, created_by])).id;
          // console.log(subject_id);

          await Run_Query(sql.Insert.test, [UNIQUE_ID, title, subject_id, created_by, date_time]);
          const test_id = (await Get_Query(sql.Get.test_id, [title, created_by, date_time])).id;

          skills.forEach(
            async (skill) => await Run_Query(sql.Insert.skill, [skill, created_by, date_time])
          );

          table_body.forEach(async (row) => {
            // console.log(row);
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

            await Run_Query(sql.Insert.specifications_table_skill, [
              test_id,
              row.thematic_area,
              row.content,
              row.objective,
              skills[row.skill_index],
              row.skill_index,
              row.skill_content,
            ]);
          });

          for (const [question_index, question_item] of data_form.questions.entries()) {
            await Run_Query(sql.Insert.question, [question_item.question, created_by, date_time]);

            const question_id = (
              await Get_Query(sql.Get.question_id, [question_item.question, created_by])
            ).id;

            await Run_Query(sql.Insert.test_question, [
              test_id,
              question_id,
              question_index + 1,
              question_item.correct_answer_index,
            ]);
            const test_question_id = (
              await Get_Query(sql.Get.test_question_id, [test_id, question_id])
            ).id;

            for (const [answer_index, answer] of question_item.answers.entries()) {
              await Run_Query(sql.Insert.answer, [answer, created_by, date_time]);

              const answer_id = (await Get_Query(sql.Get.answer_id, [answer, created_by])).id;

              await Run_Query(sql.Insert.test_question_answer, [
                test_question_id,
                answer_id,
                answer_index + 1,
              ]);
            }
          }

          db.run("COMMIT");
          sql.Finalize();
          db.close();
          
          Report_Status("success", "Form guardado en la base de datos con éxito!!");
          Report_Status("divider");

          resolve({
            data: UNIQUE_ID,
          });

        } catch (error) {
          Report_Status("error", error);
          Report_Status("divider");
          db.run("ROLLBACK");

          sql.Finalize();
          db.close();

          reject();
        }
      });
    });
  } catch (error) {
    db.close();
    console.error(error);
    reject();
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
