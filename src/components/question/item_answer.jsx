import SpecialInputText from "../special_input_text.jsx";
function CheckboxComponent({ check_box_key, check_box_id, check_box_label, handleItemDelete }) {
  return (
    <div className="form-check">
      <input
        className="form-check-input answer-input-box"
        type="checkbox"
        value=""
        id={check_box_id}
      />
      <SpecialInputText
        input_label={check_box_label}
        input_width="300px"
        input_height="45px"
        input_font_size="21px"
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

export default CheckboxComponent;
