import { Fetch_Data } from "../database/db.js";

export async function Get_Quiz_Performed_Metadata(teacher_id: number, performed_id: string) {
    const query = /*sql*/ `
       SELECT quiz.uuid AS quiz_uuid, google_form_url
       FROM quiz_performed
       JOIN quiz ON quiz.id = quiz_performed.quiz_id 
       WHERE teacher_id = ? AND quiz_performed.google_form_id = ?
       `;
    const [db_response]: any = await Fetch_Data(query, [teacher_id, performed_id]);
 
    if (!db_response) throw new Error(`Quiz performed with id ${performed_id} not found`);
 
    return db_response;
 }