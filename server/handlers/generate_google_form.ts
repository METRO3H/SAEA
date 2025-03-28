"use strict";
import type { QuestionItem2Generate } from "@QuizTypes";
import google from "@googleapis/forms";

export default async function (
   oauth2Client: any,
   quiz_id: string,
   quiz_title: string,
   quiz_questions: QuestionItem2Generate[]
): Promise<{ google_form_url: string; google_form_id: string }> {
   
   if (!quiz_id.trim()) throw new Error("No se ha especificado el ID del Quiz");

   const google_access = await User_Authentication(oauth2Client);
   const create_form_response = await Create_Form(google_access, quiz_title);

   await Fill_Form(google_access, create_form_response, quiz_questions);
   const quiz_url = create_form_response.data.responderUri;

   return {
      google_form_url: quiz_url,
      google_form_id: create_form_response.data.formId,
   };
}

async function User_Authentication(oauth2Client: any) {
   const access = google.forms({
      version: "v1",
      auth: oauth2Client,
   });

   return access;
}
async function Create_Form(form_access: any, form_title: string) {
   const newForm = {
      info: {
         title: form_title,
         documentTitle: form_title,
      },
   };

   const create_form_response = await form_access.forms.create({
      requestBody: newForm,
   });
   return create_form_response;
}

async function Fill_Form(
   google_access: google.forms_v1.Forms,
   create_form_response: any,
   questions: QuestionItem2Generate[]
) {
   const update_request: any = {
      requests: [
         {
            updateFormInfo: {
               info: {
                  description: "Quiz creado por SAEA",
               },
               updateMask: "description",
            },
         },
         {
            updateSettings: {
               settings: {
                  quizSettings: {
                     isQuiz: true,
                  },
                  emailCollectionType: "VERIFIED",
               },
               updateMask: "quizSettings.isQuiz, emailCollectionType",
            },
         },
      ],
   };

   for (let i = 0; i < questions.length; i++) {
      const question_item = questions[i];
      console.log(question_item);
      const answers = question_item.answers.map((answer) => ({ value: answer }));
      const correct_answers = [answers[question_item.correct_answer_index]];

      const new_item = await Create_Item(
         question_item.question,
         answers,
         correct_answers,
         question_item.question_position
      );

      update_request.requests.push(new_item);
   }

   await google_access.forms.batchUpdate({
      formId: create_form_response.data.formId,
      requestBody: update_request,
   });
}

async function Create_Item(question: string, answers_map: object[], correct_answers_map: object[], position: number) {
   const new_item = {
      createItem: {
         item: {
            title: question,
            questionItem: {
               question: {
                  questionId: position.toString(),
                  required: true,
                  grading: {
                     pointValue: 1,
                     correctAnswers: {
                        answers: correct_answers_map,
                     },
                     whenRight: { text: "Bien hecho! 👍" },
                     whenWrong: { text: "Lo siento, eso es incorrecto 😔" },
                  },
                  choiceQuestion: {
                     type: "RADIO",
                     options: answers_map,
                  },
               },
            },
         },

         location: {
            index: position - 1,
         },
      },
   };

   return new_item;
}
