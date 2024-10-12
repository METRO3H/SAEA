import { type Question_Item } from "@content/quiz_data";
import Answer_Item_Layout from "@components/question/answer_item_layout_2.tsx";

import Special_Input_Text from "@components/special_input_text.tsx";
import Item_Answer from "./item_answer.jsx";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "@styles/question_content_item.css";
import "@styles/hint.css";

function Question_Content_Item({
  question_content_item_number,
  add_class = "",
  thematic_area = " - ",
  content = " - ",
  objective = " - ",
  skill = " - ",
  data,
}) {
  // const question_item_data: Question_Item = data;
  const [question_item_data, set_question_item_data] = useState<Question_Item>(
    data || {
      question: "",
      answers: ["", ""],
      correct_answer_index: 0,
    }
  );

  function Update_Question_Title(event) {
    const old_value = question_item_data.question;
    const new_value = event.target.value.trim() || " - ";
    if (new_value === old_value) return;

    set_question_item_data((prev_question_item_data) => ({
      ...prev_question_item_data,
      question: new_value,
    }));
  }
  function Add_Answer() {
    set_question_item_data((prev_question_item_data) => ({
      ...prev_question_item_data,
      answers: [...prev_question_item_data.answers, ""],
    }));
  }

  function Remove_Answer(index) {
    console.log("Index : ", index);

    console.log(
      "filter",
      question_item_data.answers.filter((_, i) => i !== index)
    );

    set_question_item_data((prev_question_item_data) => ({
      ...prev_question_item_data,
      answers: prev_question_item_data.answers.filter((_, i) => i !== index),
    }));
  }

  function Update_Answer(event, index){ 
    const old_value = question_item_data.answers[index];
    const new_value = event.target.value.trim() || " - ";

    if (new_value === old_value) return;

    set_question_item_data((prev_question_item_data) => ({
      ...prev_question_item_data,
      answers: prev_question_item_data.answers.map((item, item_index) =>
        item_index === index ? new_value : item
      ),
    }));
  }

  console.log(question_item_data);

  return (
    <div
      className={`tab-pane show question-content-item ${add_class}`}
      id={`question-content-item-${question_content_item_number}`}
      role="tabpanel"
      aria-label={`question-list-item-${question_content_item_number}`}
    >
      <div className="question-content-item-main">
        <ul className="badge-container">
          <li className="hint--bottom hint--rounded" aria-label={thematic_area}>
            <span className="badge rounded-pill badge-primary">{thematic_area}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={content}>
            <span className="badge rounded-pill badge-warning">{content}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={objective}>
            <span className="badge rounded-pill badge-danger">{objective}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={skill}>
            <span className="badge rounded-pill badge-success">{skill}</span>
          </li>
        </ul>

        <div className="question-content-title-container">
          <Special_Input_Text
            input_label={`Pregunta ${question_content_item_number}`}
            label_class="fw-bold"
            bar_thickness="1px"
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

        <div className="answer-items-section">
          {question_item_data.answers.map((item, index) => (
            // const add_class = show_answer_items.includes(item.key) ? "show-answer-item" : "";

            <div className="answer-item show-answer-item" key={uuidv4()}>
              <input
                className="answer-input-checkbox answer-input-box form-check-input"
                type="checkbox"
                value=""
                id={`Checkbox-${index + 1}`}
                defaultChecked={index === question_item_data.correct_answer_index ? true : false}
              />
              <Special_Input_Text
                input_value={item}
                input_label={`Respuesta ${index + 1}`}
                input_width="300px"
                input_font_size="18px"
                input_class="answer-input-text"
                events={{
                  onBlur: (event) => Update_Answer(event, index),
                }}
                /* input_focus_color="var(--main-color-blue)" */
              />
              <button
                type="button"
                className="btn btn-secondary btn-floating btn-sm remove-button"
                data-mdb-ripple-init
              >
                <i className="fas fa-trash-can" onClick={() => Remove_Answer(index)}></i>
                {/* <i className="fas fa-trash-can"></i> */}
              </button>
            </div>
          ))}

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
