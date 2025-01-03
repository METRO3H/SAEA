import { atom, computed } from "nanostores";
import type { Quiz } from "@content/types";

export const $quiz_store = atom<Quiz>({
   quiz_id: "",
   google_form_url: "",
   quiz_title: "",
   created_by: -1,
   quiz_subject: "",
   quiz_creation_date: "",
   specifications_table: {
      total_questions: 0,
      quiz_skills: ["", "", ""],
      items: [
         {
            thematic_area: "",
            content: "",
            objective: "",
            performed_classes: 0,
            row_skills: [],
         },
         {
            thematic_area: "",
            content: "",
            objective: "",
            performed_classes: 0,
            row_skills: [],
         },
         {
            thematic_area: "",
            content: "",
            objective: "",
            performed_classes: 0,
            row_skills: [],
         },
         {
            thematic_area: "",
            content: "",
            objective: "",
            performed_classes: 0,
            row_skills: [],
         },
      ],
   },
   questions: [],
});

export const $update_spect_flag = atom(false);

export const $quiz_id = computed($quiz_store, ($quiz_store) => $quiz_store.quiz_id);
export const $quiz_google_form_url = computed($quiz_store, ($quiz_store) => $quiz_store.google_form_url);
export const $quiz_title = computed($quiz_store, ($quiz_store) => $quiz_store.quiz_title);
export const $created_by = computed($quiz_store, ($quiz_store) => $quiz_store.created_by);
export const $quiz_subject = computed($quiz_store, ($quiz_store) => $quiz_store.quiz_subject);
export const $quiz_creation_date = computed($quiz_store, ($quiz_store) => $quiz_store.quiz_creation_date);
export const $specifications_table = computed($quiz_store, ($quiz_store) => $quiz_store.specifications_table);
export const $questions = computed($quiz_store, ($quiz_store) => $quiz_store.questions);


export function Update_Spec_Table(specifications_table: Quiz["specifications_table"]) {
   console.log("llego el update a spec_table_store")
   $quiz_store.set({
     ...$quiz_store.get(),
     specifications_table: specifications_table,
   });
 }