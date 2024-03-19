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
    let thematic_area = (tr.querySelector(".item-thematic-area") as HTMLInputElement);
    let content = tr.querySelector(".item-content") as HTMLInputElement;
    let objective = tr.querySelector(".item-objetive") as HTMLInputElement;
    let performed_classes = tr.querySelector(".item-class") as HTMLInputElement;
    let skills = tr.querySelectorAll(".item-skill") as NodeListOf<HTMLInputElement>;

    if (thematic_area) thematic_area.value = data.items[index].Axis;
    if (content) content.value = data.items[index].Content;
    if (objective) objective.value = data.items[index].Objective;
    
    performed_classes.value = data.items[index].performed_classes;
    skills[data.items[index].Skill_index].value = data.items[index].skill_content
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
        Axis: "Numeros",
        Content: "Números naturales",
        Objective: "Identificar números naturales",
        performed_classes: "3",
        Skill_index: 0,
        skill_content: "1-2",
      },
      {
        Axis: "Numeros",
        Content: "Números enteros",
        Objective: "Identificar números enteros",
        performed_classes: "3",
        Skill_index: 0,
        skill_content: "3-4",
      },
      {
        Axis: "Numeros",
        Content: "Números enteros",
        Objective: "Realizar operaciones con números enteros",
        performed_classes: "4",
        Skill_index: 1,
        skill_content: "5-7",
      },
      {
        Axis: "Álgebra",
        Content: "Expresiones algebraicas",
        Objective: "Simplificar expresiones algebraicas",
        performed_classes: "5",
        Skill_index: 1,
        skill_content: "8-11",
      },
      {
        Axis: "Álgebra",
        Content: "Ecuaciones",
        Objective: "Resolver ecuaciones",
        performed_classes: "5",
        Skill_index: 2,
        skill_content: "12-15",
      },
    ],
  };
}
