import type {  Quiz, SpecTable, QuestionItem } from "@content/types";
import { $quiz_store } from "@content/shared/quiz_data";

export function Update_Quiz_ID(quiz_id: string) {
  $quiz_store.set({
    ...$quiz_store.get(),
    quiz_id: quiz_id,
  });
}

export function Update_Quiz_Google_Form_URL(google_form_url: string) {
  $quiz_store.set({
    ...$quiz_store.get(),
    google_form_url: google_form_url,
  });
}

export function Update_Quiz_Title(quiz_title: string) {
  $quiz_store.set({
    ...$quiz_store.get(),
    quiz_title: quiz_title,
  });
}

export function Update_Created_By(created_by: number) {
  $quiz_store.set({
    ...$quiz_store.get(),
    created_by: created_by,
  });
}

export function Update_Quiz_Subject(quiz_subject: string) {
  $quiz_store.set({
    ...$quiz_store.get(),
    quiz_subject: quiz_subject,
  });
}

export function Update_Quiz_Creation_Date(quiz_creation_date: string) {
  $quiz_store.set({
    ...$quiz_store.get(),
    quiz_creation_date: quiz_creation_date,
  });
}

export function Update_Spec_Table(specifications_table: SpecTable) {
  $quiz_store.set({
    ...$quiz_store.get(),
    specifications_table: specifications_table,
  });
}

export function Update_Questions(questions: QuestionItem[]) {
  $quiz_store.set({
    ...$quiz_store.get(),
    questions: questions,
  });
}