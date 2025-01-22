import { Fetch_Data } from "../database/db";
import { Quiz } from "@QuizTypes";

export async function Get_Quiz(quiz_uuid: string) {
   const query = /*sql*/ `SELECT Get_Quiz(?) AS quiz_data`;
   const [db_response]: any = await Fetch_Data(query, [quiz_uuid]);
   const quiz_data: Quiz = db_response.quiz_data;
   return quiz_data;
}
