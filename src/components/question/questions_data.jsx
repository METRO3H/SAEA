import Question_Content_Item from "@components/question/question_content_item.jsx";
import Question_List_Item from "@components/question/question_list_item.jsx";
import { quiz_data } from "@content/quiz_data";
import { useState, useEffect } from "react";

function Questions_Data() {
  let [question_items, set_question_items] = useState([{}]);

  function get_specification_data() {
    const table_body = quiz_data.specifications_table.table_body;
    const skills = quiz_data.specifications_table.skills;
    let new_question_items = [];
    table_body.forEach((tr) => {
      
      new_question_items.push({
        subject: quiz_data.specifications_table.subject,
        thematic_area: tr.thematic_area,
        content: tr.content,
        objective: tr.objective,
        skills: skills[0],
      });
    });

    set_question_items(new_question_items);
  }
  useEffect(() => {
    document.addEventListener("use_specification_data", get_specification_data);

    return () => {
      document.removeEventListener("use_specification_data", get_specification_data);
    };
  }, []);
  return (
    <div id="main-question-container">
      <div id="question-list-container">
        <div className="list-group list-group-light" id="list-tab" role="tablist">
          {question_items.map((item, index) => (
            <Question_List_Item
              key={`question_list_key_${index + 1}`}
              question_list_item_number={index + 1}
              add_class={index === 0 ? "active" : ""}
            />
          ))}
        </div>
      </div>
      <div id="question-content-container">
        <div className="tab-content">
          {question_items.map((item, index) => (
            <Question_Content_Item
              key={`question_content_key_${index + 1}`}
              question_content_item_number={index + 1}
              add_class={index === 0 ? "active" : ""}
              subject={item.subject}
              thematic_area={item.thematic_area}
              content={item.content}
              objective={item.objective}
              skills={item.skills}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Questions_Data;
