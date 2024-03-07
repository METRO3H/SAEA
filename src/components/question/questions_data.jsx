import Question_Content_Item from "@components/question/question_content_item.jsx";
import Question_List_Item from "@components/question/question_list_item.jsx";
import { quiz_data } from "@content/quiz_data";
import { useState, useEffect } from "react";

function Questions_Data() {
  let items_number = 10;
  let items = Array.from({ length: items_number }, (_, i) => i + 1);

  /*   const [get_quiz_data, set_quiz_data] = useState(quiz_data);

  const actualizarInfo = () => {
    // Actualiza el objeto `info` con nuevos valores
    setInfo({
      ...info,
      nombre: "Pedro",
      edad: 30,
    });
  }; */

  useEffect(() => {
    console.log("El objeto info ha cambiado:", quiz_data);
  }, [quiz_data]);

  return (
    <div id="main-question-container">
      <div id="question-list-container">
        <div className="list-group list-group-light" id="list-tab" role="tablist">
          {items.map((item, index) => (
            <Question_List_Item
              key={index}
              question_list_item_number={item}
              add_class={index === 0 ? "active" : ""}
            />
          ))}
        </div>
      </div>
      <div id="question-content-container">
        <div className="tab-content">
          {items.map((item, index) => (
            <Question_Content_Item
              key={index}
              question_content_item_number={item}
              add_class={index === 0 ? "active" : ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Questions_Data;
