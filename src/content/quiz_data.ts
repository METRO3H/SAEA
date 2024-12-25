import { atom } from "nanostores";

export interface Quiz {
  quiz_id: string;
  google_form_url: string;
  quiz_title: string;
  created_by: number;
  quiz_subject: string;
  quiz_creation_date: string;
  specifications_table: {
    total_questions: number;
    quiz_skills: string[];
    items: {
      thematic_area: string;
      content: string;
      objective: string;
      performed_classes: number;
      skill_index: number;
      skill_content: string;
    }[];
  };
  questions: {
    question: string;
    answers: string[];
    correct_answer_index: number;
  }[];
}

// Crear el store usando atom
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
        skill_index: 0,
        skill_content: "",
      },
      {
        thematic_area: "",
        content: "",
        objective: "",
        performed_classes: 0,
        skill_index: 0,
        skill_content: "",
      },
      {
        thematic_area: "",
        content: "",
        objective: "",
        performed_classes: 0,
        skill_index: 0,
        skill_content: "",
      },
      {
        thematic_area: "",
        content: "",
        objective: "",
        performed_classes: 0,
        skill_index: 0,
        skill_content: "",
      },
    ],
  },
  questions: [],
});

export interface RowSpan {
  thematic_area: { [key: string]: number };
  content: { [key: string]: number };
}
export interface Question_Item {
  question: string;
  answers: string[];
  correct_answer_index: number;
}


export const search_input_store = atom<string>("");

export const quiz_type_store = atom<boolean>(true);

export interface Draft_List_Type {
  id: number;
  unique_id: string;
  test_title: string;
  subject: string;
  creation_date: string;
}

export interface Performed_List_Type {
  id: number;
  unique_id: string;
  test_title: string;
  subject: string;
  creation_date: string;
  draft_id: number;
  form_id: string;
  form_url: string;
  generated_date: string;
}

interface quiz_list_length_type {
  draft: number;
  performed: number;
}

export const quiz_list_length_store = atom<quiz_list_length_type>({
  draft: 0,
  performed: 0,
});


//TENGO QUE DECIDIR COMO MANEJAR LOS DATOS DE NANOSTORES
