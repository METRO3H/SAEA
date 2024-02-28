import "../styles/item_answer.css";
function Special_Input_Text({
  input_label,
  input_width = "auto",
  input_height = "auto",
  input_font_size = "16px",
  input_focus_color = "#2337ff",
  input_no_focus_color = "#bdbdbd",
  label_font_size = "18px",
  label_class = "",
  bar_thickness = "1px",
  input_class = "",
  input_min_width = "0px",
}) {
  const input_style = {
    width: input_width,
    minWidth: input_min_width,
    height: input_height,
    fontSize: input_font_size,
    "--input-focus-color": input_focus_color,
    "--input-no-focus-color": input_no_focus_color,
    "--label-font-size": label_font_size,
    "--bar-thickness": bar_thickness,
  };
  return (
    <div className="group" style={input_style}>
      <input
        required
        type="text"
        className={`input answer-input-text ${input_class}`}
        autoComplete="no"
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className={label_class}>
        <i className="fas fa-book"></i>
        {input_label}
      </label>
    </div>
  );
}
export default Special_Input_Text;
