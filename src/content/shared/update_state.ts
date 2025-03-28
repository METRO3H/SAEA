import type { SpecTable, QuestionItem } from "@content/types";
import { $quiz_store } from "@content/shared/quiz_data";

export function Update_Quiz_ID(quiz_id: string) {
   $quiz_store.set({
      ...$quiz_store.get(),
      quiz_id,
   });
}

export function Update_Quiz_Google_Form_URL(google_form_url: string) {
   $quiz_store.set({
      ...$quiz_store.get(),
      google_form_url,
   });
}

export function Update_Quiz_Title(quiz_title: string) {
   $quiz_store.set({
      ...$quiz_store.get(),
      quiz_title,
   });
}

export function Update_Quiz_Subject(quiz_subject: string) {
   $quiz_store.set({
      ...$quiz_store.get(),
      quiz_subject,
   });
}

export function Update_Quiz_Creation_Date(creation_date: string) {
   $quiz_store.set({
      ...$quiz_store.get(),
      creation_date,
   });
}

export function Update_Spec_Table(specifications_table: SpecTable) {
   $quiz_store.set({
      ...$quiz_store.get(),
      specifications_table,
   });
}

export function Update_Questions(questions: QuestionItem[]) {
   $quiz_store.set({
      ...$quiz_store.get(),
      questions,
   });
}
