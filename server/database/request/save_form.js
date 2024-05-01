import sqlite3 from "sqlite3";
import path from "path";
import moment from "moment";
import { randomUUID } from "crypto";
import Query from "../querys/Query.js";

/* import { data } from "../data_test.js"; */

sqlite3.verbose();

export async function Save_Form(data_form) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");
  let metadata_map = {
    thematic_area_id: {},
    content_id: {},
    objetive_id: {},
    skills_id: {},
  };
  const UNIQUE_ID = randomUUID()
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

          skills.forEach(async (skill) => {
            await Run_Query(sql.Insert.skill, [skill, created_by, date_time]);
            metadata_map.skills_id[skill] = (
              await Get_Query(sql.Get.skill_id, [skill, created_by])
            ).id;
          });

          table_body.forEach(async (row) => {
            await Run_Query(sql.Insert.thematic_area, [row.thematic_area, created_by, date_time]);
            await Run_Query(sql.Insert.content_area, [row.content, created_by, date_time]);
            await Run_Query(sql.Insert.objective, [row.objective, created_by, date_time]);

            const thematic_area_id = (
              await Get_Query(sql.Get.axis_id, [row.thematic_area, created_by])
            ).id;
            const content_id = (await Get_Query(sql.Get.content_id, [row.content, created_by])).id;
            const objetive_id = (await Get_Query(sql.Get.objetive_id, [row.objective, created_by]))
              .id;

            await Run_Query(sql.Insert.specifications_table, [
              test_id,
              thematic_area_id,
              content_id,
              objetive_id,
              row.performed_classes,
            ]);
            const specifications_table_id = (
              await Get_Query(sql.Get.specifications_table_id, [
                test_id,
                thematic_area_id,
                content_id,
                objetive_id,
                row.performed_classes,
              ])
            ).id;

            metadata_map.thematic_area_id[row.thematic_area] = thematic_area_id;
            metadata_map.content_id[row.content] = content_id;
            metadata_map.objetive_id[row.objetive] = objetive_id;

            row.skills.forEach(async (question_range, index) => {
              if (question_range.trim() !== "") {
                const question_skill_id = metadata_map.skills_id[skills[index]];
                await Run_Query(sql.Insert.specifications_table_skill, [
                  specifications_table_id,
                  question_skill_id,
                  index,
                  question_range,
                ]);
              }
            });
          });

          for (const [index, question] of data_form.questions.content.entries()) {
            const { thematic_area, content, objective, skill } = metadata[index];
            const thematic_area_id = metadata_map.thematic_area_id[thematic_area];
            const content_id = metadata_map.thematic_area_id[content];
            const objetive_id = metadata_map.thematic_area_id[objective];
            const skill_id = metadata_map.thematic_area_id[skill];

            await Run_Query(sql.Insert.question, [question.text, created_by, date_time]);

            const question_id = (await Get_Query(sql.Get.question_id, [question.text, created_by]))
              .id;

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

          db.run("COMMIT");
          sql.Finalize();
          db.close();
          resolve("Form guardado en la base de datos con éxito!!");
        } catch (error) {
          console.error(error);
          db.run("ROLLBACK");
          sql.Finalize();
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
