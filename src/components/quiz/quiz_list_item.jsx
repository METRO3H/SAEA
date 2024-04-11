import "@styles/quiz_list_item.css";
export default function quiz_list_item({ title, subject, creation_date }) {
  return (
    <tr>
      <th className="checkbox-item" scope="row">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
        </div>
      </th>
      <td>
        <div className="d-flex align-items-center">
          <div>
            <p className="mb-1">{title}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="align-items-center text-center mb-1">{subject}</div>
      </td>
      <td className="status">
        <div className="mb-1">
          <span className="badge badge-success rounded-pill d-inline text-center">Active</span>
        </div>
      </td>
      <td>
        <div className="creation_date_item align-items-center text-center mb-1">
          {creation_date}
        </div>
      </td>
      <td>
        <div className="actions-container">
          <button type="button" className="btn btn-primary btn-floating" data-mdb-ripple-init>
            <i className="far fa-pen-to-square"></i>
          </button>
          <button type="button" className="btn btn-danger btn-floating" data-mdb-ripple-init>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
}
