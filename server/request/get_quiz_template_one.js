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

    const user_id = 1;
    db.serialize(async () => {
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
        SELECT
            test_question_answer.question_number,
            question.text AS question,
            answer.text AS answer,
            test_question_answer.is_correct
        FROM
            test
            JOIN test_question_answer ON test_question_answer.test_id = test.id
            JOIN question ON question.id = test_question_answer.question_id
            JOIN answer ON answer.id = test_question_answer.answer_id
        WHERE
            test.unique_id = ?;
        `);

      try {
        const [{ test_title, test_subject }] = await Get_All_Query(title_subject_query, [test_id]);
        let skills_list_query_data = await Get_All_Query(skills_list_query, [test_id]);
        const specifications_table_query_data = await Get_All_Query(specifications_table_query, [
          test_id,
        ]);

        skills_list_query_data = skills_list_query_data
          .sort((a, b) => a.index - b.index)
          .map((item) => item.skill);

        const questions_query_data = await Get_All_Query(questions_query, [test_id]);

        const questions_map = {};

        questions_query_data.forEach((question_item) => {
          const { question_number, question, answer, is_correct } = question_item;

          if (!questions_map[question_number]) {
            questions_map[question_number] = {
              question: question,
              answers: [],
              correct_answer_index: null,
            };
          }
          questions_map[question_number].answers.push(answer);

          if (is_correct) {
            questions_map[question_number].correct_answer_index =
              questions_map[question_number].answers.length - 1;
          }
        });

        const questions_list = Object.keys(questions_map).map((key) => questions_map[key]);

        const data = {
          quiz_title: test_title,
          created_by: 1,
          quiz_subject: test_subject,
          specifications_table: {
            total_questions: questions_list.length,
            quiz_skills: skills_list_query_data,
            items: specifications_table_query_data,
          },
          questions: questions_list,
        };

        // console.log(data);

        title_subject_query.finalize();
        skills_list_query.finalize();
        specifications_table_query.finalize();
        questions_query.finalize();
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
