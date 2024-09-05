import "@styles/quiz_table_list.css";
import { useEffect, useState } from "react";
import Quiz_Table_List_Item from "./quiz_table_list_item";

export default function quiz_table_list() {
  const [data_list, set_data_list] = useState([]);
  const [input_value, set_input_value] = useState("");
  async function Fetch_Data() {
    const response = await fetch("/request/get/quiz/all");
    const data = await response.json();
    set_data_list(data);
  }
  function Filter_Data(event) {
    set_input_value(event.target.value.toLowerCase());
  }
  useEffect(() => {
    Fetch_Data();
    const search_input = document.querySelector("#input-search");
    search_input.addEventListener("input", Filter_Data);

    return () => {
      document.removeEventListener("input", Filter_Data);
    };
  }, []);

  return (
    <table className="table table-sm table-hover align-middle mb-0 bg-white">
      <thead id="table-head">
        <tr>
          <th className="text-center fw-bold">#</th>
          <th className="fw-bold">Titulo</th>
          <th className="text-center fw-bold">Asignatura</th>
          <th className="text-center fw-bold">Estado</th>
          <th className="text-center fw-bold">Fecha</th>
          <th className="text-center fw-bold">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data_list
          .filter((item) => {
            return input_value === "" ? item : item.test_title.toLowerCase().includes(input_value);
          })
          .map((item) => (
            <Quiz_Table_List_Item
              key={item.test_id}
              title={item.test_title}
              subject={item.subject}
              form_url={item.form_url}
              creation_date={item.creation_date}
            />
          ))}
      </tbody>
    </table>
  );
}
