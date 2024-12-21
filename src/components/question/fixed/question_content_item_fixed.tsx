import { type Question_Item } from "@content/quiz_data";
import Special_Input_Text from "@components/special_input_text.tsx";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "@styles/question_content_item.css";
import "@styles/hint.css";

function Question_Content_Item({
  question_content_item_number,
  add_class = "",
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
          <li className="hint--bottom hint--rounded" aria-label={metadata.thematic_area || ""}>
            <span className="badge rounded-pill badge-primary">{metadata.thematic_area || ""}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={metadata.content || ""}>
            <span className="badge rounded-pill badge-warning">{metadata.content || ""}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={metadata.objective || ""}>
            <span className="badge rounded-pill badge-danger">{metadata.objective || ""}</span>
          </li>
          <li className="hint--bottom hint--rounded" aria-label={metadata.skill || ""}>
            <span className="badge rounded-pill badge-success">{metadata.skill || ""}</span>
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
            fixed_value={question_item_data.question}
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
                  checked={index === question_item_data.correct_answer_index ? true : false}
                  onChange={() => {}}
                  autoComplete="off"
                />

                <Special_Input_Text
                  input_label={`Respuesta ${index + 1}`}
                  input_font_size="1.15rem"
                  bar_thickness="2px"
                  input_width="18rem"
                  input_class="answer-input-text"
                  fix_label_position="2px"
                  fixed_value={item}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Question_Content_Item;
