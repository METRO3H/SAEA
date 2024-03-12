import "@styles/special_input_text.css";
function Special_Input_Text({
  input_label,
  label_class = "",
  input_width = "auto",
  input_height = "auto",
  input_font_size = "16px",
  input_focus_color = "#2337ff",
  input_no_focus_color = "#bdbdbd",
  bar_thickness = "1px",
  input_class = "",
  input_icon_class = "false",
  input_icon_right_class = "false",
  fix_label_position = "0px",
}) {
  const input_style = {
    width: input_width,
    height: input_height,
    "--input-font-size": input_font_size,
    "--input-focus-color": input_focus_color,
    "--input-no-focus-color": input_no_focus_color,
    "--bar-thickness": bar_thickness,

    "--fix-label-position": fix_label_position,
  };
  return (
    <div className="input-container" style={input_style}>
      <input required type="text" className={`input ${input_class}`} autoComplete="no" />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className={label_class}>
        {input_icon_class && <i className={input_icon_class}></i>}
        <span> {input_label}</span>
        {input_icon_right_class && <i className={input_icon_right_class}></i>}
      </label>
    </div>
  );
}
export default Special_Input_Text;
