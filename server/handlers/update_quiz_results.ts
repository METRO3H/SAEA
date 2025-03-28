import type { OAuth2Client } from "google-auth-library";
import type { AnswerResult } from "@QuizTypes";
import { parseISO, format } from "date-fns";
import google from "@googleapis/forms";
import { Execute_Query } from "../database/db.js";

export async function Update_Quiz_Results(authorization: OAuth2Client, formId: string) {
   const retrieved_results = await Retrieve_Quiz_Results(authorization, formId);
   // console.dir(retrieved_results, { depth: null });
   const db_response = await Save_Quiz_Results(formId, retrieved_results);

   const { success, error_message } = db_response;

   if (!success) throw new Error(error_message);

   return success;
}
async function Retrieve_Quiz_Results(authorization: OAuth2Client, formId: string) {
   const google_quiz_access = google.forms({
      version: "v1",
      auth: authorization,
   });

   const quiz_responses = await google_quiz_access.forms.responses.list({ formId });


   const responses_map = Get_Responses_Map(quiz_responses.data);

   return responses_map;
}

function Get_Responses_Map(quiz_responses: google.forms_v1.Schema$ListFormResponsesResponse) {
   const responses_map = new Map();
   const { responses = [] } = quiz_responses;

   responses?.sort((a, b) => new Date(a.createTime as string).getTime() - new Date(b.createTime as string).getTime());

   for (const response of responses) {
      if (responses_map.has(response.respondentEmail)) continue;

      const response_answers = Object.values(response.answers || {});

      const results: AnswerResult[] = [];

      for (const answer of response_answers) {
         const question_position = parseInt(answer?.questionId || "-1") || -1;
         const answer_value = answer?.textAnswers?.answers?.[0]?.value || "";

         results.push({ question_position, answer_value });
      }

      const parsed_date = parseISO(response.createTime as string);
      const response_date = format(parsed_date, "yyyy-MM-dd HH:mm:ss");

      responses_map.set(response.respondentEmail, { response_date, results });
   }
   return responses_map;
}

async function Save_Quiz_Results(google_form_id: string, responses_map: Map<string, any>) {
   const student_emails = Array.from(responses_map.keys());
   const responses = Object.fromEntries(responses_map);

   const query = /*sql*/ ` CALL $SAVE_QUIZ_PERFORMED_RESULTS(?, ?, ?)`;

   const [[db_response]]: any = await Execute_Query(query, [
      google_form_id,
      JSON.stringify(student_emails),
      JSON.stringify(responses),
   ]);

  return db_response;
}
