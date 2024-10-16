import { type Question_Item } from "@content/quiz_data";
import Special_Input_Text from "@components/special_input_text.tsx";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "@styles/question_content_item.css";
import "@styles/hint.css";

function Question_Content_Item({
  question_content_item_number,
  add_class = "",
  update_question_item,
  question_item_index,
  data,
  metadata,
}) {
  const question_item_data: Question_Item = data || {
    question: "",
    answers: ["", ""],
    correct_answer_index: -1,
  };

  const [scroll_container, set_scroll_container] = useState(false);

  const answer_items_section_ref = useRef<HTMLDivElement>(null);

  function Update_Question_Title(event) {
    const old_value = question_item_data.question;
    const new_value = event.target.value.trim() || " - ";
    if (new_value === old_value) return;

    update_question_item(question_item_index, { ...question_item_data, question: new_value });
  }
  function Add_Answer() {
    update_question_item(question_item_index, {
      ...question_item_data,
      answers: [...question_item_data.answers, ""],
    });
    set_scroll_container(!scroll_container);
  }

  function Remove_Answer(index) {
    update_question_item(question_item_index, {
      ...question_item_data,
      answers: question_item_data.answers.filter((_, i) => i !== index),
      correct_answer_index:
        question_item_data.correct_answer_index === index
          ? -1
          : question_item_data.correct_answer_index,
    });
  }

  function Update_Answer(event, index) {
    const old_value = question_item_data.answers[index];
    const new_value = event.target.value.trim() || "";

    if (new_value === old_value) return;

    update_question_item(question_item_index, {
      ...question_item_data,
      answers: question_item_data.answers.map((item, item_index) =>
        item_index === index ? new_value : item
      ),
    });
  }
  function Update_Checkbox(index) {
    update_question_item(question_item_index, {
      ...question_item_data,
      correct_answer_index: index,
    });
  }

  useEffect(() => {
    if (!answer_items_section_ref.current) return;
    answer_items_section_ref.current.scrollTop = answer_items_section_ref.current.scrollHeight;
  }, [scroll_container]);

  const question_id = uuidv4();

  return (
    <div
      className={`tab-pane show question-content-item ${add_class}`}
      id={`question-content-item-${question_content_item_number}`}
      role="tabpanel"
      aria-label={`question-list-item-${question_content_item_number}`}
    >
      <div className="question-content-item-main">
        <ul className="badge-container">
          <li className="hint--bottom hint--rounded" aria-label={metadata.thematic_area}>
            <span className="badge rounded-pill badge-primary">{metadata.thematic_area}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={metadata.content}>
            <span className="badge rounded-pill badge-warning">{metadata.content}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={metadata.objective}>
            <span className="badge rounded-pill badge-danger">{metadata.objective}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={metadata.skill}>
            <span className="badge rounded-pill badge-success">{metadata.skill}</span>
          </li>
        </ul>

        <div className="question-content-title-container">
          <Special_Input_Text
            input_label={`Pregunta ${question_content_item_number}`}
            label_class="fw-bold"
            bar_thickness="3px"
            input_width="95%"
            input_font_size="25px"
            input_focus_color="var(--main-color-google-form)"
            input_class="fw-bold"
            input_icon_class="fas fa-circle-question trailing"
            fix_label_position="5px"
            input_value={question_item_data.question}
            events={{
              onBlur: Update_Question_Title,
            }}
          />
          <i className="fas fa-pencil"></i>
        </div>

        <div className="answer-items-section" ref={answer_items_section_ref}>
          {question_item_data.answers.map((item, index) => {
            return (
              <div className="answer-item" key={index}>
                <input
                  id={"Checkbox-" + question_id + (index + 1)}
                  className="answer-input-checkbox form-check-input"
                  name={"checkbox-" + question_id}
                  aria-label="radio item"
                  type="radio"
                  value=""
                  defaultChecked={index === question_item_data.correct_answer_index ? true : false}
                  autoComplete="off"
                  onChange={() => Update_Checkbox(index)}
                />

                <Special_Input_Text
                  input_value={item}
                  input_label={`Respuesta ${index + 1}`}
                  input_font_size="1.15rem"
                  bar_thickness="2px"
                  input_width="18rem"
                  input_class="answer-input-text"
                  fix_label_position="2px"
                  events={{
                    onBlur: (event) => Update_Answer(event, index),
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-floating btn-sm remove-button"
                  data-mdb-ripple-init
                >
                  <i className="fas fa-trash-can" onClick={() => Remove_Answer(index)}></i>
                </button>
              </div>
            );
          })}

          <button
            type="button"
            className="btn btn-lg btn-outline-primary btn-rounded  add-item"
            onClick={Add_Answer}
          >
            <i className="fas fa-plus"></i>
            <span> Añadir respuesta</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Question_Content_Item;
