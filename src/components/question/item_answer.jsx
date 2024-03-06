import SpecialInputText from "../special_input_text.jsx";
function Item_Answer({
  check_box_key,
  check_box_id,
  check_box_label,
  handleItemDelete,
  add_style = {},
  add_class = "",
}) {
  return (
    <div className={`answer-item ${add_class}`} style={add_style}>
      <input
        className="answer-item-input answer-input-box form-check-input"
        type="checkbox"
        value=""
        id={check_box_id}
      />
      <SpecialInputText
        input_label={check_box_label}
        input_width="300px"
        input_font_size="21px"
        /* input_focus_color="var(--main-color-blue)" */
      />
      <button
        type="button"
        className="btn btn-secondary btn-floating btn-sm remove-button"
        data-mdb-ripple-init
      >
        <i className="fas fa-trash-can" onClick={() => handleItemDelete(check_box_key)}></i>
      </button>
    </div>
  );
}

export default Item_Answer;
