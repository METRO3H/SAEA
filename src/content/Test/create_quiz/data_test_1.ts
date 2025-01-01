import type { Quiz } from "@content/quiz_data";
export const data_test_1 = {
  quiz_title: "Test " + (Math.floor(Math.random() * (1000 - 2 + 1)) + 2),
  quiz_subject: "Matemáticas",
  specifications_table: {
    quiz_skills: ["Comprensión", "Aplicación", "Evaluación"],
    items: [
      {
        thematic_area: "Números",
        content: "Números naturales",
        objective: "Identificar números naturales",
        performed_classes: "3",
        skill_index: 0,
        skill_content: "1-2",
      },
      {
        thematic_area: "Números",
        content: "Números enteros",
        objective: "Identificar números enteros",
        performed_classes: "3",
        skill_index: 0,
        skill_content: "3-4",
      },
      {
        thematic_area: "Números",
        content: "Números enteros",
        objective: "Realizar operaciones con números enteros",
        performed_classes: "4",
        skill_index: 1,
        skill_content: "5-7",
      },
      {
        thematic_area: "Álgebra",
        content: "Expresiones algebraicas",
        objective: "Simplificar expresiones algebraicas",
        performed_classes: "5",
        skill_index: 1,
        skill_content: "8-11",
      },
      {
        thematic_area: "Álgebra",
        content: "Ecuaciones",
        objective: "Resolver ecuaciones",
        performed_classes: "5",
        skill_index: 2,
        skill_content: "12-15",
      },
    ],
  },
  questions: [
    {
      question: "¿Cuál de los siguientes es un número natural?",
      answers: ["3", "-2"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál de los siguientes no es un número natural?",
      answers: ["9", "-1"],
      correct_answer_index: 1,
    },
    {
      question: "¿Cuál de los siguientes es un número entero?",
      answers: ["2.5", "-3"],
      correct_answer_index: 1,
    },
    {
      question: "¿Cuál de los siguientes no es un número entero?",
      answers: ["1/2", "-8"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -3 + 2?",
      answers: ["-1", "1"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -2 - 3?",
      answers: ["-5", "5"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -2 * -3?",
      answers: ["6", "-6"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica 2x + 3x?",
      answers: ["5x", "6x"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica 4x - 2x?",
      answers: ["2x", "6x"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica x * x?",
      answers: ["x^2", "2x"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica x / x?",
      answers: ["1", "x^2"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es x + 3 = 5, ¿cuál es el valor de x?",
      answers: ["2", "8"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es 2x = 6, ¿cuál es el valor de x?",
      answers: ["3", "4"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es x - 2 = 3, ¿cuál es el valor de x?",
      answers: ["5", "1"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es x / 2 = 4, ¿cuál es el valor de x?",
      answers: ["8", "2"],
      correct_answer_index: 0,
    },
  ],
};

export const data_test_2 = {
  quiz_title: "Ya veremos dijo el ciego",
  quiz_subject: "Matemáticas",
  specifications_table: {
    quiz_skills: ["Aplicación", "Evaluación", "Comprension"],

    items: [
      {
        thematic_area: "Algebra lineal",
        content: "Espacios vectoriales",
        objective: "Identificar espacios vectoriales",
        performed_classes: "3",
        skill_index: 0,
        skill_content: "1-3",
      },
      {
        thematic_area: "Algebra lineal",
        content: "Matrices",
        objective: "Identificar matrices",
        performed_classes: "3",
        skill_index: 0,
        skill_content: "4-6",
      },
      {
        thematic_area: "Algebra lineal",
        content: "Matrices",
        objective: "Realizar operaciones con matrices",
        performed_classes: "4",
        skill_index: 1,
        skill_content: "7-10",
      },
      {
        thematic_area: "Calculo",
        content: "Teorema fundamental del calculo",
        objective: "Rolver problemas clasicos del teorema fundamental del calculo",
        performed_classes: "5",
        skill_index: 1,
        skill_content: "11-15",
      },
      {
        thematic_area: "Calculo",
        content: "Integral definida",
        objective: "Realizar cambios de variables en integral definida",
        performed_classes: "5",
        skill_index: 2,
        skill_content: "16-20",
      },
    ],
  },
  questions: [
    {
      question: "¿Cuál de los siguientes es un número natural?",
      answers: ["3", "-2"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál de los siguientes no es un número natural?",
      answers: ["9", "-1"],
      correct_answer_index: 1,
    },
    {
      question: "¿Cuál de los siguientes es un número entero?",
      answers: ["2.5", "-3"],
      correct_answer_index: 1,
    },
    {
      question: "¿Cuál de los siguientes no es un número entero?",
      answers: ["1/2", "-8"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -3 + 2?",
      answers: ["-1", "1"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -2 - 3?",
      answers: ["-5", "5"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -2 * -3?",
      answers: ["6", "-6"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica 2x + 3x?",
      answers: ["5x", "6x"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica 4x - 2x?",
      answers: ["2x", "6x"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica x * x?",
      answers: ["x^2", "2x"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica x / x?",
      answers: ["1", "x^2"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es x + 3 = 5, ¿cuál es el valor de x?",
      answers: ["2", "8"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es 2x = 6, ¿cuál es el valor de x?",
      answers: ["3", "4"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es x - 2 = 3, ¿cuál es el valor de x?",
      answers: ["5", "1"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es x / 2 = 4, ¿cuál es el valor de x?",
      answers: ["8", "2"],
      correct_answer_index: 0,
    },
    {
      question: "Energia nuclear o renovable",
      answers: ["Nuclear", "Renovable", "No se XD"],
      correct_answer_index: 0,
    },
    {
      question: "¿A que hace referencia TTGL?",
      answers: ["No se XD", "TENGEN TOPPA GURREN LAGANN", "Teta globo"],
      correct_answer_index: 1,
    },
    {
      question: "¿Pregunta?",
      answers: ["What is bro even asking? lol", "No se XD", "Si"],
      Correct_answer_index: 0,
    },
    {
      question: "¿One piece tiene mas de 1000 capitulos?",
      answers: ["No se XD", "No", "Si"],
      Correct_answer_index: 2,
    },
    {
      question: "¿Es bob el constructor un dios?",
      answers: ["SI", "No", "XD"],
      Correct_answer_index: 2,
    },
  ],
};


export const data_test_3: Quiz = {
  quiz_id: "",
  quiz_title: "Test " + (Math.floor(Math.random() * (1000 - 2 + 1)) + 2),
  created_by: 1,
  quiz_subject: "Matemáticas",
  specifications_table: {
    total_questions: 15,
    quiz_skills: ["Comprensión", "Aplicación", "Evaluación"],
    items: [
      {
        thematic_area: "Números",
        content: "Números naturales",
        objective: "Identificar números naturales",
        performed_classes: 3,
        row_skills: ["1-2", "", ""],
      },
      {
        thematic_area: "Números",
        content: "Números enteros",
        objective: "Identificar números enteros",
        performed_classes: 3,
        row_skills: ["3-4", "", ""],

      },
      {
        thematic_area: "Números",
        content: "Números enteros",
        objective: "Realizar operaciones con números enteros",
        performed_classes: 4,
        row_skills: ["", "5-7", ""],
      },
      {
        thematic_area: "Álgebra",
        content: "Expresiones algebraicas",
        objective: "Simplificar expresiones algebraicas",
        performed_classes: 5,
        row_skills: ["", "8-11", ""],
      },
      {
        thematic_area: "Álgebra",
        content: "Ecuaciones",
        objective: "Resolver ecuaciones",
        performed_classes: 5,
        row_skills: ["", "", "12-15"],
      },
    ],
  },
  questions: [
    {
      question: "¿Cuál de los siguientes es un número natural?",
      answers: ["3", "-2"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál de los siguientes no es un número natural?",
      answers: ["9", "-1"],
      correct_answer_index: 1,
    },
    {
      question: "¿Cuál de los siguientes es un número entero?",
      answers: ["2.5", "-3"],
      correct_answer_index: 1,
    },
    {
      question: "¿Cuál de los siguientes no es un número entero?",
      answers: ["1/2", "-8"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -3 + 2?",
      answers: ["-1", "1"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -2 - 3?",
      answers: ["-5", "5"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es el resultado de la operación -2 * -3?",
      answers: ["6", "-6"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica 2x + 3x?",
      answers: ["5x", "6x"],
      correct_answer_index: 0,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica 4x - 2x?",
      answers: ["6x", "2x"],
      correct_answer_index: 1,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica x * x?",
      answers: ["2x", "x^2"],
      correct_answer_index: 1,
    },
    {
      question: "¿Cuál es la simplificación de la expresión algebraica x / x?",
      answers: ["1", "x^2"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es x + 3 = 5, ¿cuál es el valor de x?",
      answers: ["2", "8"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es 2x = 6, ¿cuál es el valor de x?",
      answers: ["3", "4"],
      correct_answer_index: 0,
    },
    {
      question: "Si la ecuación es x - 2 = 3, ¿cuál es el valor de x?",
      answers: ["1", "5"],
      correct_answer_index: 1,
    },
    {
      question: "Si la ecuación es x / 2 = 4, ¿cuál es el valor de x?",
      answers: ["2", "8"],
      correct_answer_index: 1,
    },
  ],
  google_form_url: "",
  quiz_creation_date: ""
};
