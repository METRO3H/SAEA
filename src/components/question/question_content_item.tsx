import "@styles/question_content_item.css";
import "@styles/hint.css";
import Answer_Item_Layout from "@components/question/answer_item_layout_2.tsx";
import Special_Input_Text from "@components/special_input_text.tsx";
import { type Question_Item } from "@content/quiz_data";

function Question_Content_Item({
  question_content_item_number,
  add_class = "",
  thematic_area = " - ",
  content = " - ",
  objective = " - ",
  skill = " - ",
  data,
}) {
  const question_item_data: Question_Item = data;

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
          />
          <i className="fas fa-pencil"></i>
        </div>

        <Answer_Item_Layout
          answers={question_item_data.answers}
          correct_answer_index={question_item_data.correct_answer_index}
        />
      </div>
    </div>
  );
}

export default Question_Content_Item;
