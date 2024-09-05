

export const data_test_1 = {
  quiz_title: "Test "+ (Math.floor(Math.random() * (1000 - 2 + 1)) + 2),
  quiz_subject: "Matemáticas",
  quiz_total_questions: "15",
  quiz_skills: ["Comprensión", "Aplicación", "Evaluación"],
  items: [
    {
      thematic_area: "Números",
      Content: "Números naturales",
      Objective: "Identificar números naturales",
      performed_classes: "3",
      Skill_index: 0,
      skill_content: "1-2",
      questions: [
        {
          question: "¿Cuál de los siguientes es un número natural?",
          options: ["3", "-2"],
          correct_answer_index: 0,
        },
        {
          question: "¿Cuál de los siguientes no es un número natural?",
          options: ["9", "-1"],
          correct_answer_index: 1,
        },
      ],
    },
    {
      thematic_area: "Números",
      Content: "Números enteros",
      Objective: "Identificar números enteros",
      performed_classes: "3",
      Skill_index: 0,
      skill_content: "3-4",
      questions: [
        {
          question: "¿Cuál de los siguientes es un número entero?",
          options: ["2.5", "-3"],
          correct_answer_index: 1,
        },
        {
          question: "¿Cuál de los siguientes no es un número entero?",
          options: ["1/2", "-8"],
          correct_answer_index: 0,
        },
      ],
    },
    {
      thematic_area: "Números",
      Content: "Números enteros",
      Objective: "Realizar operaciones con números enteros",
      performed_classes: "4",
      Skill_index: 1,
      skill_content: "5-7",
      questions: [
        {
          question: "¿Cuál es el resultado de la operación -3 + 2?",
          options: ["-1", "1"],
          correct_answer_index: 0,
        },
        {
          question: "¿Cuál es el resultado de la operación -2 - 3?",
          options: ["-5", "5"],
          correct_answer_index: 0,
        },
        {
          question: "¿Cuál es el resultado de la operación -2 * -3?",
          options: ["6", "-6"],
          correct_answer_index: 0,
        },
      ],
    },
    {
      thematic_area: "Álgebra",
      Content: "Expresiones algebraicas",
      Objective: "Simplificar expresiones algebraicas",
      performed_classes: "5",
      Skill_index: 1,
      skill_content: "8-11",
      questions: [
        {
          question: "¿Cuál es la simplificación de la expresión algebraica 2x + 3x?",
          options: ["5x", "6x"],
          correct_answer_index: 0,
        },
        {
          question: "¿Cuál es la simplificación de la expresión algebraica 4x - 2x?",
          options: ["2x", "6x"],
          correct_answer_index: 0,
        },
        {
          question: "¿Cuál es la simplificación de la expresión algebraica x * x?",
          options: ["x^2", "2x"],
          correct_answer_index: 0,
        },
        {
          question: "¿Cuál es la simplificación de la expresión algebraica x / x?",
          options: ["1", "x^2"],
          correct_answer_index: 0,
        },
      ],
    },
    {
      thematic_area: "Álgebra",
      Content: "Ecuaciones",
      Objective: "Resolver ecuaciones",
      performed_classes: "5",
      Skill_index: 2,
      skill_content: "12-15",
      questions: [
        {
          question: "Si la ecuación es x + 3 = 5, ¿cuál es el valor de x?",
          options: ["2", "8"],
          correct_answer_index: 0,
        },
        {
          question: "Si la ecuación es 2x = 6, ¿cuál es el valor de x?",
          options: ["3", "4"],
          correct_answer_index: 0,
        },
        {
          question: "Si la ecuación es x - 2 = 3, ¿cuál es el valor de x?",
          options: ["5", "1"],
          correct_answer_index: 0,
        },
        {
          question: "Si la ecuación es x / 2 = 4, ¿cuál es el valor de x?",
          options: ["8", "2"],
          correct_answer_index: 0,
        },
      ],
    },
  ],
};
