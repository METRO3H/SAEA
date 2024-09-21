import { atom } from 'nanostores';

interface Quiz {
  title: string;
  created_by: number;
  specifications_table: {
    subject: string;
    skills: string[];
    total_questions: string;
    table_body: {
      thematic_area: string;
      content: string;
      objective: string;
      performed_classes: string;
      skills: string[];
    }[];
  };
  questions: {
    metadata: {
      thematic_area: string;
      content: string;
      objective: string;
      skill: string;
    }[];
    content: {
      text: string;
      answers: {
        text: string;
        is_correct: boolean;
      }[];
    }[];
  };
}

// Crear el store usando atom
export const quizDataStore = atom<Quiz>({
  title: "",
  created_by: 1,
  specifications_table: {
    subject: "",
    skills: [],
    total_questions: "",
    table_body: [],
  },
  questions: {
    metadata: [],
    content: [],
  },
});
