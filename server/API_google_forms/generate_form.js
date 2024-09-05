"use strict";
import path from "path";
import google from "@googleapis/forms";
import { authenticate } from "@google-cloud/local-auth";
import sqlite3 from "sqlite3";
import moment from "moment";
sqlite3.verbose();
export default async function (data) {
  try {
    const access_form_response = await User_Authentication();
    const create_form_response = await Create_Form(access_form_response, data.quiz_data.title);
    await Fill_Form(access_form_response, create_form_response, data.quiz_data);
    console.log(create_form_response.data);
    const quiz_URL = create_form_response.data.responderUri;

    Save_Performed_Test(data.test_id, create_form_response.data);

    return { status: true, message: "Quiz generado con éxito!", data: quiz_URL };
  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: error,
    };
  }
}

async function User_Authentication() {
  const main_folder = process.cwd();
  const authClient = await authenticate({
    keyfilePath: path.join(main_folder, "credentials.json"),
    scopes: "https://www.googleapis.com/auth/drive",
  });

  const forms = google.forms({
    version: "v1",
    auth: authClient,
  });

  return forms;
}
async function Create_Form(form_access, form_title) {
  const newForm = {
    info: {
      title: form_title,
    },
  };

  const create_form_response = await form_access.forms.create({
    requestBody: newForm,
  });

  // Request body to convert form to a quiz
  const updateRequest = {
    requests: [
      {
        updateSettings: {
          settings: {
            quizSettings: {
              isQuiz: true,
            },
          },
          updateMask: "quizSettings.isQuiz",
        },
      },
    ],
  };

  await form_access.forms.batchUpdate({
    formId: create_form_response.data.formId,
    requestBody: updateRequest,
  });

  return create_form_response;
}

async function Fill_Form(access_form_response, create_form_response, quiz_data) {
  const questions = quiz_data.questions.content;
  for (let i = 0; i < questions.length; i++) {
    const answers = [];
    const correct_answers = [];

    questions[i].answers.forEach((answer) => {
      answers.push({ value: answer.text });

      if (answer.is_correct == true) {
        correct_answers.push({ value: answer.text });
      }
    });

    const new_item = await Create_Item(questions[i].text, answers, correct_answers, i);

    await access_form_response.forms.batchUpdate({
      formId: create_form_response.data.formId,
      requestBody: new_item,
    });

    console.log(` ▶ Pregunta ${i + 1} agregada...`);
  }

  return;
}

async function Create_Item(question, answers_map, correct_answers_map, position) {
  const new_item = {
    requests: [
      {
        createItem: {
          item: {
            title: question,
            questionItem: {
              question: {
                required: true,
                grading: {
                  pointValue: 2,
                  correctAnswers: {
                    answers: correct_answers_map,
                  },
                  whenRight: { text: "You got it!" },
                  whenWrong: { text: "Sorry, that's wrong" },
                },
                choiceQuestion: {
                  type: "RADIO",
                  options: answers_map,
                },
              },
            },
          },

          location: {
            index: position,
          },
        },
      },
    ],
  };

  return new_item;
}

async function Save_Performed_Test(test_id, google_form_data) {
  const data_base_path = path.join(process.cwd(), "server", "database", "database.db");
  const date_time = moment().format("YYYY-MM-DD HH:mm:ss");
  const db = new sqlite3.Database(data_base_path);
  const save_generated_data = db.prepare(/*sql*/ `
    INSERT OR IGNORE INTO test_performed (test_id, form_id, form_url, date) 
    VALUES (?, ?, ?, ?)
  `);
  save_generated_data.run(
    [test_id, google_form_data.formId, google_form_data.responderUri, date_time],
    (error) => {
      if (error) {
        throw new Error("Error al ejecutar la sentencia SQL");
      }
      console.log("El Quiz generado fue guardado con exito!");

      save_generated_data.finalize();
      db.close();
    }
  );
}

// function Run_Query(query, parameters = []) {
//   return new Promise((resolve, reject) => {
//     query.run(parameters, (error) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve("Correcto");
//       }
//     });
//   });
// }
