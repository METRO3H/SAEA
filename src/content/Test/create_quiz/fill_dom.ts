import { data_test_1 } from "./data_test_1.ts";

const data = data_test_1;

export function fill_data_table() {
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
  quiz_total_questions.value = data.questions.length.toString();

  quiz_skills.forEach((skill, index) => (skill.value = data.specifications_table.quiz_skills[index]));

  const tr_all = table?.querySelectorAll("tbody tr") as NodeListOf<HTMLElement>;

  tr_all.forEach((tr, index) => {
    let thematic_area = tr.querySelector(".item-thematic-area") as HTMLInputElement;
    let content = tr.querySelector(".item-content") as HTMLInputElement;
    let objective = tr.querySelector(".item-objetive") as HTMLInputElement;
    let performed_classes = tr.querySelector(".item-class") as HTMLInputElement;
    let skills = tr.querySelectorAll(".item-skill") as NodeListOf<HTMLInputElement>;

    if (thematic_area) thematic_area.value = data.specifications_table.items[index].thematic_area;
    if (content) content.value = data.specifications_table.items[index].Content;
    if (objective) objective.value = data.specifications_table.items[index].Objective;

    performed_classes.value = data.specifications_table.items[index].performed_classes;
    skills[data.specifications_table.items[index].Skill_index].value = data.specifications_table.items[index].skill_content;
  });
}

export function Fill_Questions() {
  const question_content_items = document.querySelectorAll(".question-content-item");
  const questions = data.questions

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
