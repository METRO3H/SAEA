import "@styles/quiz_table_list.css";
import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import Quiz_Table_List_Item from "./quiz_table_list_item";
import { search_input_store, quiz_type_store, quiz_list_length_store } from "@content/quiz_data";
import type { DraftListType, PerformedListType, QuizzesList } from "@content/types";

export default function quiz_table_list() {
   const $search_input_value: string = useStore(search_input_store);
   const $quiz_type: boolean = useStore(quiz_type_store);
   const [data_list, set_data_list] = useState<QuizzesList>({
      draft: [],
      performed: [],
   });

   useEffect(() => {
      async function Fetch_Data() {
         const response = await fetch("/request/get/quiz/all");
         const data = await response.json();
         console.log(data);
         set_data_list(data);
      }
      Fetch_Data();
   }, []);

   const draft_filtered_data: DraftListType[] = (data_list["drafts"] || []).filter((item) =>
      $search_input_value === "" ? item : item.title.toLowerCase().includes($search_input_value)
   );

   const performed_filtered_data: PerformedListType[] = (data_list["performed"] || []).filter((item) =>
      $search_input_value === "" ? item : item.title.toLowerCase().includes($search_input_value)
   );

   quiz_list_length_store.set({
      draft: draft_filtered_data.length,
      performed: performed_filtered_data.length,
   });
   

   return (
      <table className="table table-sm table-hover align-middle mb-0 bg-white">
         <thead id="table-head">
            <tr>
               <th className="text-center fw-bold">#</th>
               <th className="fw-bold">Titulo</th>
               <th className="text-center fw-bold">Asignatura</th>
               {!$quiz_type ? <th className="text-center fw-bold">Estado</th> : ""}
               <th className="text-center fw-bold">Fecha</th>
               <th className="text-center fw-bold">Acciones</th>
            </tr>
         </thead>
         <tbody>
            {$quiz_type ? (
               draft_filtered_data.length ? (
                  draft_filtered_data.map((item) => (
                     <Quiz_Table_List_Item
                        key={item.uuid}
                        title={item.title}
                        subject={item.subject}
                        quiz_url={"../create/draft/" + item.uuid}
                        date={item.creation_date}
                        quiz_type={$quiz_type}
                     />
                  ))
               ) : (
                  <tr>
                     <td colSpan={5} className="text-center">
                        <span className="text-center empty-table">No se encontraron cuestionarios</span>
                     </td>
                  </tr>
               )
            ) : performed_filtered_data.length ? (
               performed_filtered_data.map((item) => (
                  <Quiz_Table_List_Item
                     key={item.google_form_id}
                     title={item.title}
                     subject={item.subject}
                     quiz_url={"performed/" + item.google_form_id}
                     date={item.creation_date}
                     quiz_type={$quiz_type}
                  />
               ))
            ) : (
               <tr>
                  <td colSpan={6} className="text-center empty-table">
                     <span>No se encontraron cuestionarios</span>
                  </td>
               </tr>
            )}
         </tbody>
      </table>
   );
}
