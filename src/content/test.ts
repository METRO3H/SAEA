export function test_1() {
  const data = data_1();
  const table = document.querySelector(".custom-container");

  const quiz_title = table?.querySelector("#quiz-title div input")! as HTMLInputElement;
  const quiz_subject = table?.querySelector("#table-subject input")! as HTMLInputElement;
  const quiz_total_questions = table?.querySelector(
    "#item-total-all-questions input"
  )! as HTMLInputElement;

  const quiz_skills = table?.querySelectorAll(
    ".thead-input input"
  )! as NodeListOf<HTMLInputElement>;

  quiz_title.value = data.quiz_title;
  quiz_subject.value = data.quiz_subject;
  quiz_total_questions.value = data.quiz_total_questions;

  quiz_skills.forEach((skill, index) => (skill.value = data.quiz_skills[index]));

  const tr_all = table?.querySelectorAll("tbody tr") as NodeListOf<HTMLElement>;

  tr_all.forEach((tr, index) => {
    let thematic_area = tr.querySelector(".item-thematic-area") as HTMLInputElement;
    let content = tr.querySelector(".item-content") as HTMLInputElement;
    let objective = tr.querySelector(".item-objetive") as HTMLInputElement;
    let performed_classes = tr.querySelector(".item-class") as HTMLInputElement;
    let skills = tr.querySelectorAll(".item-skill") as NodeListOf<HTMLInputElement>;

    if (thematic_area) thematic_area.value = data.items[index].thematic_area;
    if (content) content.value = data.items[index].Content;
    if (objective) objective.value = data.items[index].Objective;

    performed_classes.value = data.items[index].performed_classes;
    skills[data.items[index].Skill_index].value = data.items[index].skill_content;
  });

  const question_content_items = document.querySelectorAll(".question-content-item");
  const questions = data.items.flatMap((item) => item.questions);

  question_content_items.forEach((question_content_item, index) => {
    const question_data = questions[index];
    const question_title = question_content_item.querySelector(
      ".question-content-title-container input"
    ) as HTMLInputElement;

    question_title.value = question_data.question;

    const answer_items = question_content_item.querySelectorAll(".answer-item");
    
    answer_items.forEach((answer_item, index_2) => {
      if (index_2 == question_data.correct_answer_index) {
        const answer_input_checkbox = answer_item.querySelector(
          ".answer-input-checkbox"
        ) as HTMLInputElement;
        answer_input_checkbox.checked = true;
      }
      
      const answer_input_text = answer_item.querySelector(".answer-input-text") as HTMLInputElement;
      
      answer_input_text.value = question_data.options[index_2];
    });
  });
}

function data_1() {
  return {
    quiz_title: "Test 1",
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
}
