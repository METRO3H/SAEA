"use strict";
import type { Quiz } from "@QuizTypes";
import google from "@googleapis/forms";
import Report_Status from "../../util/report_status.js";

export default async function (oauth2Client: any, data: Quiz) {
    if (!data.quiz_id.trim()) throw new Error("No se ha especificado el ID del Quiz");

    const access_form_response = await User_Authentication(oauth2Client);
    const create_form_response = await Create_Form(access_form_response, data.quiz_title);
    await Fill_Form(access_form_response, create_form_response, data);
    // console.log(create_form_response.data);
    const quiz_url = create_form_response.data.responderUri;


    Report_Status("success", "Quiz generado con éxito!");

    return {
        google_form_url: quiz_url,
        google_form_id: create_form_response.data.formId,
    
    };
}

async function User_Authentication(oauth2Client:any) {
  // const main_folder = process.cwd();
  // const authClient = await authenticate({
  //   keyfilePath: path.join(main_folder, "credentials.json"),
  //   scopes: "https://www.googleapis.com/auth/drive",
  // });

  const forms = google.forms({
    version: "v1",
    auth: oauth2Client,
  });

  return forms;
}
async function Create_Form(form_access: any, form_title: string) {
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

async function Fill_Form(access_form_response: google.forms_v1.Forms, create_form_response: any, quiz_data: Quiz) {
  const questions = quiz_data.questions;
  const new_items: { requests: any[] } = {
    requests: [],
  }

  for (let i = 0; i < questions.length; i++) {
    const question_item = questions[i];
    const answers = question_item.answers.map((answer) => ({ value: answer }));
    const correct_answers = [answers[question_item.correct_answer_index]];

    const new_item = await Create_Item(question_item.question, answers, correct_answers, i);
    new_items.requests.push(new_item);
  }

  await access_form_response.forms.batchUpdate({
    formId: create_form_response.data.formId,
    requestBody: new_items,
  });

}

async function Create_Item(question: string, answers_map: object[], correct_answers_map: object[], position: number) {
  const new_item =   {
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
  };

  return new_item;
}
