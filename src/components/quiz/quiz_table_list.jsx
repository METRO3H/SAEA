import "@styles/quiz_table_list.css";
import { useEffect, useState } from "react";
import Quiz_Table_List_Item from "./quiz_table_list_item";

export default function quiz_table_list() {
  const [data_list, set_data_list] = useState({ templates: [], performed: [] });
  const [input_value, set_input_value] = useState("");
  const [quiz_type, set_quiz_type] = useState("templates");

  function Filter_Data(event) {
    set_input_value(event.target.value.toLowerCase());
  }
  function Filter_Type(type) {
    set_quiz_type(type);
  }
  useEffect(() => {
    async function Fetch_Data() {
      const response = await fetch("/request/get/quiz/all");
      const data = await response.json();
      set_data_list(data);
    }
    Fetch_Data();
  }, []);

  useEffect(() => {
    const search_input = document.querySelector("#input-search");
    const templates_element = document.querySelector("#templates");
    const perform_element = document.querySelector("#perform");

    templates_element.addEventListener("click", () => Filter_Type("templates"));
    perform_element.addEventListener("click", () => Filter_Type("performed"));
    search_input.addEventListener("input", Filter_Data);

    return () => {
      templates_element.removeEventListener("click", () => Filter_Type("templates"));
      perform_element.removeEventListener("click", () => Filter_Type("perform"));
      search_input.removeEventListener("input", Filter_Data);
    };
  }, []);

  const filtered_data = (data_list[quiz_type] || []).filter((item) =>
      input_value === "" ? item : item.test_title.toLowerCase().includes(input_value)
    );
  

  const templates_length = data_list["templates"].length;

  const perform_length = data_list["performed"].length;

  useEffect(() => {
    const templates_element = document.querySelector("#templates");
    const perform_element = document.querySelector("#perform");

    if(templates_length) templates_element.querySelector(".type-counter").textContent = templates_length;
    if(perform_length) perform_element.querySelector(".type-counter").textContent = perform_length;

  }, [templates_length, perform_length])

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
        {filtered_data.map((item) => (
          <Quiz_Table_List_Item
            key={item.unique_id + (item.form_id || "")}
            title={item.test_title}
            subject={item.subject}
            form_url={item.form_url}
            creation_date={item.creation_date}
            quiz_type={quiz_type}
            generated_date={item.generated_date}
          />
        ))}
      </tbody>
    </table>
  );
}
