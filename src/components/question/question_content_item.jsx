import "@styles/question_content_item.css";
import "@styles/hint.css";
import Answer_Item_Layout from "@components/question/answer_item_layout.jsx";
import Special_Input_Text from "@components/special_input_text";

function Question_Content_Item({
  question_content_item_number,
  add_class = "",
  subject,
  thematic_area,
  content,
  objective,
  skills,
}) {
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
          <li className="hint--bottom hint--rounded" aria-label={skills}>
            <span className="badge rounded-pill badge-success">{skills}</span>
          </li>
        </ul>
        
        <div className="question-content-title-container">
          <Special_Input_Text
            input_label={`Pregunta ${question_content_item_number}`}
            label_class="fw-bold"
            bar_thickness="1px"
            input_width="95%"
            input_font_size="31px"
            input_focus_color="var(--main-color-google-form)"
            input_class="fw-bold"
            input_icon_class="fas fa-circle-question trailing"
            fix_label_position="15px"
          />
          <i className="fas fa-pencil"></i>
        </div>

        <Answer_Item_Layout />
      </div>
    </div>
  );
}

export default Question_Content_Item;
