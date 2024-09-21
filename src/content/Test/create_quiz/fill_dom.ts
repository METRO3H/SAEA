export function Fill_data_table(quiz_data) {
  const table = document.querySelector(".custom-container");
  const quiz_title = table?.querySelector("#quiz-title div input")! as HTMLInputElement;
  const quiz_subject = table?.querySelector("#table-subject input")! as HTMLInputElement;
  const quiz_total_questions = table?.querySelector(
    "#item-total-all-questions input"
  )! as HTMLInputElement;

  const quiz_skills = table?.querySelectorAll(
    ".thead-input input"
  )! as NodeListOf<HTMLInputElement>;

  quiz_title.value = quiz_data.quiz_title;
  quiz_subject.value = quiz_data.quiz_subject;
  quiz_total_questions.value = quiz_data.questions.length.toString();

  quiz_skills.forEach(
    (skill, index) => (skill.value = quiz_data.specifications_table.quiz_skills[index])
  );

  const tr_all = table?.querySelectorAll("tbody tr") as NodeListOf<HTMLElement>;

  tr_all.forEach((tr, index) => {
    let thematic_area = tr.querySelector(".item-thematic-area") as HTMLInputElement;
    let content = tr.querySelector(".item-content") as HTMLInputElement;
    let objective = tr.querySelector(".item-objective") as HTMLInputElement;
    let performed_classes = tr.querySelector(".item-class") as HTMLInputElement;
    let skills = tr.querySelectorAll(".item-skill") as NodeListOf<HTMLInputElement>;

    if (thematic_area)
      thematic_area.value = quiz_data.specifications_table.items[index].thematic_area;
    if (content) content.value = quiz_data.specifications_table.items[index].content;
    if (objective) objective.value = quiz_data.specifications_table.items[index].objective;

    performed_classes.value = quiz_data.specifications_table.items[index].performed_classes;
    skills[quiz_data.specifications_table.items[index].skill_index].value =
      quiz_data.specifications_table.items[index].skill_content;
  });
}

export function Fill_Questions(data) {
  const question_content_items = document.querySelectorAll(".question-content-item");
  const questions = data.questions;

  question_content_items.forEach((question_content_item, index) => {
    const question_data = questions[index];

    if (!question_data) return;

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

      answer_input_text.value = question_data.answers[index_2];
    });
  });
}
