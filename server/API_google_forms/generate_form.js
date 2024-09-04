"use strict";
import path from "path";
import google from "@googleapis/forms";
import { authenticate } from "@google-cloud/local-auth";

export default async function (data_form) {
  try {
    const access_form_response = await User_Authentication();
    const create_form_response = await Create_Form(access_form_response, data_form.title);
    await Fill_Form(access_form_response, create_form_response, data_form);

    const quiz_URL = create_form_response.data.responderUri;

    return { status: true, message: "Quiz generado con éxito!", data: quiz_URL };

  } catch (error) {
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

async function Fill_Form(access_form_response, create_form_response, data_form) {
  const questions = data_form.questions.content;
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

    console.log(` Pregunta ${i + 1} agregada...`);
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
