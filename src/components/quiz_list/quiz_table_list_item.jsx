import "@styles/quiz_table_list_item.css";
import { useState } from "react";


export default function quiz_table_list_item({ title, subject, quiz_url, date, quiz_type }) {
  const [is_checked, set_is_checked] = useState(false);

  function Handle_Checkbox_Click() {
    set_is_checked(!is_checked);
  }
  function Handle_Checkbox_Direct_Click(event){
    // Detener la propagación del evento para evitar que llegue al contenedor padre
    event.stopPropagation();
  };

  function Handle_Link_button(){
    let btn_class = "btn btn-primary btn-floating edit-button"
    if(!quiz_url) btn_class = btn_class + " disabled"

    return btn_class
  }
  

  return (
    <tr>
      <th className="checkbox-item" scope="row" onClick={Handle_Checkbox_Click}>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={is_checked}
            id="flexCheckDefault"
            onChange={Handle_Checkbox_Direct_Click}
          />
        </div>
      </th>
      <td onDoubleClick={Handle_Checkbox_Click}>
        <div className="d-flex align-items-center">
          <div>
            <p className="mb-1">{title}</p>
          </div>
        </div>
      </td>
      <td onDoubleClick={Handle_Checkbox_Click}>
        <div className="align-items-center text-center mb-1">{subject}</div>
      </td>
      {!quiz_type ? <td className="status" onDoubleClick={Handle_Checkbox_Click}>
        <div className="mb-1">
          <span className="badge badge-success rounded-pill d-inline text-center">Active</span>
        </div>
      </td> : ""}
      <td onDoubleClick={Handle_Checkbox_Click}>
        <div className="creation_date_item align-items-center text-center mb-1">
          {date}
        </div>
      </td>
      <td>
        <div className="actions-container">
          <a
            href={quiz_url}
            className={Handle_Link_button()}
            tabIndex={-1}
            role="button"
            aria-disabled="true"

          >
            <i className="far fa-pen-to-square"></i>
          </a>
          <button type="button" className="btn btn-danger btn-floating remove-button" disabled>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}
