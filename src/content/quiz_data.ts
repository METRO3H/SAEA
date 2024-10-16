import { atom } from "nanostores";

export interface Quiz {
  quiz_title: string;
  created_by: number;
  quiz_subject: string;

  specifications_table: {
    total_questions: number;
    quiz_skills: string[];
    items: {
      thematic_area: string;
      content: string;
      objective: string;
      performed_classes: string;
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
  quiz_title: "",
  created_by: -1,
  quiz_subject: "",
  specifications_table: {
    total_questions: 0,
    quiz_skills: [],
    items: [],
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

