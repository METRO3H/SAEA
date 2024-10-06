import SpecialInputText from "../special_input_text.tsx";
function Item_Answer({
  answer_key,
  check_box_id,
  answer_input_label,
  Remove_Answer,
  add_style = {},
  add_class = "",
}) {
  return (
    <div className={`answer-item ${add_class}`} style={add_style}>
      <input
        className="answer-input-checkbox answer-input-box form-check-input"
        type="checkbox"
        value=""
        id={check_box_id}
      />
      <SpecialInputText
        input_label={answer_input_label}
        input_width="300px"
        input_font_size="18px"
        input_class="answer-input-text"
        
        /* input_focus_color="var(--main-color-blue)" */
      />
      <button
        type="button"
        className="btn btn-secondary btn-floating btn-sm remove-button"
        data-mdb-ripple-init
      >
        <i className="fas fa-trash-can" onClick={() => Remove_Answer(answer_key)}></i>
      </button>
    </div>
  );
}

export default Item_Answer;
