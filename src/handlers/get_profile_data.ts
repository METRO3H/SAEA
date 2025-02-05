
import type { ProfileData } from "../content/types";



export async function Get_Profile_Data(session_token: string) {

    let profile_data: ProfileData = {
        name: "",
        last_name: "",
        email: "",
     };
     
     // Obtener datos del usuario autenticado
     const response = await fetch("http://localhost:4321/request/oauth2/google/user_data", {
        method: "GET",
        credentials: "include",
        headers: {
           Cookie: "session_token=" + session_token,
        },
     });
     
     if (response.ok) {
        const data = await response.json();
        if (data.success) {
           profile_data = data.user_data;
        }
     } else {
        console.error("Error fetching user data:", response.statusText);
     }

     return profile_data;
}