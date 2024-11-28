import express from "express";
import Report_Status from "../../util/report_status.js";
import sqlite3 from "sqlite3";
import path from "path";
import { create } from "domain";

const router = express.Router();

router.get("/:test_id", async function (request, response) {
  try {
    const test_id = request.params.test_id;
    const specifications_table_data = await Get_Template_Data(test_id);

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

async function Get_Template_Data(test_id) {
  return new Promise((resolve, reject) => {
    const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
    const db = new sqlite3.Database(data_base_path);

    db.serialize(async () => {
      const google_form_url_query = db.prepare(/*sql*/ `
        SELECT form_url FROM test_performed WHERE test_id = ?;
        `);

      const title_subject_query = db.prepare(/*sql*/ `
        SELECT
            test.title as test_title,
            subject.text AS test_subject
        FROM
            test
            JOIN subject ON subject.id = test.subject_id
        WHERE
            unique_id = ?;
        `);

      const skills_list_query = db.prepare(/*sql*/ `
        SELECT
          question_skill.text AS skill,
          specifications_table_skill.position AS "index"
        FROM
            test
            JOIN specifications_table ON specifications_table.test_id = test.id
            JOIN specifications_table_skill ON specifications_table_skill.specifications_table_id = specifications_table.id
            JOIN question_skill ON question_skill.id = specifications_table_skill.question_skill_id
        WHERE
            unique_id = ?
        GROUP BY
            position;
        `);

      const specifications_table_query = db.prepare(/*sql*/ ` 
        SELECT
            question_thematic_area.text AS thematic_area,
            question_content_area.text AS content,
            question_objective.text as objective,
            specifications_table.performed_classes,
            specifications_table_skill.position AS skill_index,
            specifications_table_skill.questions_range AS skill_content
        FROM
            test
            JOIN specifications_table ON specifications_table.test_id = test.id
            JOIN question_thematic_area ON question_thematic_area.id = specifications_table.thematic_area_id
            JOIN question_content_area ON question_content_area.id = specifications_table.content_id
            JOIN question_objective ON question_objective.id = specifications_table.objective_id
            JOIN specifications_table_skill ON specifications_table_skill.specifications_table_id = specifications_table.id
        WHERE
            Test.unique_id = ?;
        
        `);

      const questions_query = db.prepare(/*sql*/ `
          SELECT question.text AS question, test_question.correct_answer_index, test_question.id AS test_question_id
          FROM test
          JOIN test_question ON test_question.test_id = test.id
          JOIN question ON question.id = test_question.question_id
          WHERE test.unique_id = ?
          ORDER BY test_question.question_number ASC
        `);

      const answers_query = db.prepare(/*sql*/ `
          SELECT answer.text AS answer
          FROM test
          JOIN test_question ON test_question.test_id = test.id
          JOIN test_question_answer ON test_question_answer.test_question_id = test_question.id
          JOIN question ON question.id = test_question.question_id
          JOIN answer ON answer.id = test_question_answer.answer_id
          WHERE 
          test.unique_id = ? AND test_question.id = ?
          ORDER BY test_question_answer.answer_number ASC
        `);

      try {

        const google_form_url = (await Get_Query(google_form_url_query, [test_id])).form_url;

        console.log(google_form_url)

        const [{ test_title, test_subject }] = await Get_All_Query(title_subject_query, [test_id]);
        let skills_list_query_data = await Get_All_Query(skills_list_query, [test_id]);
        const specifications_table_query_data = await Get_All_Query(specifications_table_query, [
          test_id,
        ]);

        skills_list_query_data = skills_list_query_data
          .sort((a, b) => a.index - b.index)
          .map((item) => item.skill);

        const questions_query_data = await Get_All_Query(questions_query, [test_id]);


        const question_list = await Promise.all(
          questions_query_data.map(async (question_data) => {
            const { question, correct_answer_index, test_question_id } = question_data;
        
            const answer_list = (
              await Get_All_Query(answers_query, [test_id, test_question_id])
            ).map((item) => item.answer);
        
            return {
              question: question,
              answers: answer_list,
              correct_answer_index: correct_answer_index,
            };
          })
        );

        const data = {
          quiz_id: test_id,
          google_form_url: google_form_url,
          quiz_title: test_title,
          created_by: 1,
          quiz_subject: test_subject,
          specifications_table: {
            total_questions: 15,
            quiz_skills: skills_list_query_data,
            items: specifications_table_query_data,
          },
          questions: question_list,
        };

        // console.log(data);
        google_form_url_query.finalize();
        title_subject_query.finalize();
        skills_list_query.finalize();
        specifications_table_query.finalize();
        questions_query.finalize();
        answers_query.finalize();
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
