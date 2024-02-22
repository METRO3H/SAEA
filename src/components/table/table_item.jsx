
function Table_Item({
  row_span = 1,
  td_class = "",
  item_title,
  contains_input = false,
  input_class = "",
  input_placeholder = "input XD",
  Handle_Input_Change = () => {},
}) {
  
  return (
    <td rowSpan={row_span} className={td_class} title={item_title}>
      {contains_input ? (
        <input
          className={input_class}
          type="text"
          placeholder={input_placeholder}
          onChange={Handle_Input_Change}
          required
        />
      ) : (
        "-"
      )}
    </td>
  );
}

export default Table_Item;
