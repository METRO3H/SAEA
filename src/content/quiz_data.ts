import { atom } from "nanostores";

import { type Quiz, type QuizListLengthType } from "@content/types";




export let quiz_data_store = atom<Quiz>({
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

export const search_input_store = atom<string>("");

export const quiz_type_store = atom<boolean>(true);

export const quiz_list_length_store = atom<QuizListLengthType>({
  draft: 0,
  performed: 0,
});

export const update_spect_store = atom<boolean>(false);