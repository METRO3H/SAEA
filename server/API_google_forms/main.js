"use strict";

const path = require("path");
const google = require("@googleapis/forms");
const { authenticate } = require("@google-cloud/local-auth");

async function runSample(query) {
  const authClient = await authenticate({
    keyfilePath: path.join(__dirname, "credentials.json"),
    scopes: "https://www.googleapis.com/auth/drive",
  });
  const forms = google.forms({
    version: "v1",
    auth: authClient,
  });
  const newForm = {
    info: {
      title: "TEST 1 Google forms API",
    },
  };
  const createResponse = await forms.forms.create({
    requestBody: newForm,
  });
  console.log("Link : " + createResponse.data.responderUri);

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

  const res = await forms.forms.batchUpdate({
    formId: createResponse.data.formId,
    requestBody: updateRequest,
  });

  for (let i = 0; i < 4; i++) {

    const question =
      "Which of these singers was not a member of Destiny's Child?";
    const answers = [
      "Kelly Rowland",
      "Beyoncé",
      "Rihanna",
      "Michelle Williams",
    ];
    const correct_answers = ["Rihanna"]
    const answers_map = answers.map((name) => ({ value: name }));
    const correct_answers_map = correct_answers.map((name) => ({value: name}))

    const request_new_item = Create_Item(question, answers_map, correct_answers_map, i);

    await Add_New_Item(forms, createResponse, request_new_item);
  }

  return
}

if (module === require.main) {
  runSample().catch(console.error);
}
module.exports = runSample;

async function Add_New_Item(forms, createResponse, request_new_item) {
  const response_add_item = await forms.forms.batchUpdate({
    formId: createResponse.data.formId,
    requestBody: request_new_item,
  });

  return response_add_item.data;
}

function Create_Item(question, answers_map, correct_answers_map, position) {
  console.log(position)
  const request_new_item = {
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
                    answers: correct_answers_map
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

  return request_new_item;
}
