import "../styles/item_answer.css";
function Special_Input_Text({ input_label, input_width = "auto", input_height = "auto", input_font_size = "16px" }) {
  const input_style = {
    width: input_width,
    height: input_height,
    fontSize: input_font_size
  };
  return (
    <div className="group" style={input_style}>
      <input required type="text" className="input answer-input-text" autoComplete="no" />
      <span className="highlight"></span>
      <span className="bar"></span>
      <label>{input_label}</label>
    </div>
  );
}
export default Special_Input_Text;
