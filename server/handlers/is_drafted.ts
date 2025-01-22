
import { Fetch_Data } from "../database/db.js";

export async function Is_Drafted(quiz_uuid: string): Promise<boolean> {
   const query = /*sql*/ ` 
        SELECT 
        NOT EXISTS (
            SELECT 1 
            FROM quiz_performed 
            JOIN quiz 
            ON quiz.id = quiz_performed.quiz_id
            WHERE quiz.uuid = ?
        ) AS is_drafted
    `;

   const [db_response]: any = await Fetch_Data(query, [quiz_uuid]);

   const is_drafted = db_response.is_drafted;

   return is_drafted;
}