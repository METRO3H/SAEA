import { Fetch_Data } from "../database/db.js";
import { google } from "googleapis";

// OAuth 2.0 configuration
export const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URIS,
 );

export async function Get_Authorization(teacher_id: number){
    const query = /*sql*/ ` 
            SELECT refresh_token FROM teacher WHERE teacher.id = ?
        `;
    
       const [db_response]: any = await Fetch_Data(query, [teacher_id]);
       const refresh_token = db_response.refresh_token;

       oauth2Client.setCredentials({refresh_token});

       return oauth2Client;

}