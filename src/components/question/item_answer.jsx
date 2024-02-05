import "../../styles/item_answer.css";

function CheckboxComponent({
  check_box_key,
  check_box_id,
  check_box_label,
  handleItemDelete,
}) {
  return (
    <div className="form-check">
      <input
        className="form-check-input input-box"
        type="checkbox"
        value=""
        id={check_box_id}
      />

      <div className="group">
        <input required type="text" className="input input-text" autoComplete="no" />
        <span className="highlight"></span>
        <span className="bar"></span>
        <label htmlFor={check_box_key}>{check_box_label}</label>
      </div>

      <button
        type="button"
        className="btn btn-secondary btn-floating btn-sm remove-button"
        data-mdb-ripple-init
      >
        <i
          className="fas fa-trash-can"
          onClick={() => handleItemDelete(check_box_key)}
        ></i>
      </button>
    </div>
  );
}

export default CheckboxComponent;
