import "@styles/special_input_text.css";

function Special_Input_Text({
  input_label,
  input_value = "",
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
  input_background = "transparent",
  events = {},
  fixed_value = "",
}) {

  const input_style = {
    width: input_width,
    height: input_height,
    "--input-font-size": input_font_size,
    "--input-focus-color": input_focus_color,
    "--input-no-focus-color": input_no_focus_color,
    "--bar-thickness": bar_thickness,

    "--fix-label-position": fix_label_position,
    "--input-background": input_background,
  };

  const value_param = input_value ? {
    defaultValue: input_value,
  }: fixed_value ? {
    value: fixed_value,
  } : {};

  return (
    <div className="input-container" style={input_style}>
      <input required type="text" className={`${input_class}`} autoComplete="no" {...events} 
      {...value_param}
      />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label className={label_class}>
        {input_icon_class != "false" && <i className={input_icon_class}></i>}
        <span> {input_label}</span>
        {input_icon_right_class != "false" && <i className={input_icon_right_class}></i>}
      </label>
    </div>
  );
}
export default Special_Input_Text;
