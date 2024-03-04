import "../styles/item_answer.css";
function Special_Input_Text({
  input_label,
  input_width = "auto",
  input_height = "auto",
  input_font_size = "16px",
  input_focus_color = "#2337ff",
  input_no_focus_color = "#bdbdbd",
  label_class = "",
  bar_thickness = "1px",
  input_class = "",
  input_text_padding_bottom = "3px",
}) {
  const input_style = {
    width: input_width,
    height: input_height,
    "--input-font-size": input_font_size,
    "--input-focus-color": input_focus_color,
    "--input-no-focus-color": input_no_focus_color,
    "--bar-thickness": bar_thickness,
    "--input-text-padding-bottom": input_text_padding_bottom,
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
        <span> {input_label}</span>
      </label>
    </div>
  );
}
export default Special_Input_Text;
