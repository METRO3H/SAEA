function CheckboxComponent({ check_box_key, check_box_id, check_box_label }) {
  return (
    <div className="form-check" key={check_box_key}>
      <input
        className="form-check-input"
        type="checkbox"
        value=""
        id={check_box_id}
      />
      <label
        className="form-check-label"
        htmlFor={check_box_key}
        for={check_box_id}
      >
        {check_box_label}
      </label>
    </div>
  );
}

export default CheckboxComponent;
