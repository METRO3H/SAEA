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
    text: String;
    answers: {
      text: String;
      is_correct: boolean;
    }[];
  }[];
}

export let quiz_data: Quiz = {
  title: "",
  created_by: 1,
  specifications_table: {
    subject: "",
    skills: [],
    total_questions: "",
    table_body: [
      {
        thematic_area: "",
        content: "",
        objective: "",
        performed_classes: "",
        skills: [],
      },
    ],
  },
  questions: [
    {
      text: "",
      answers: [],
    },
  ],
};
