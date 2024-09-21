import Question_Content_Item from "@components/question/question_content_item.jsx";
import Question_List_Item from "@components/question/question_list_item.jsx";
import { useStore } from "@nanostores/react";
import { quizDataStore } from "@content/quiz_data";
import { useState, useEffect } from "react";

export default function Questions_Data() {
  let [question_items, set_question_items] = useState([{}]);
  
  const quiz_data = useStore(quizDataStore);

  function get_specification_data() {
    const table_body = quiz_data.specifications_table.table_body;

    let new_question_items = [];

    quiz_data.questions.metadata.forEach((question, index) => {
      new_question_items.push({
        thematic_area: question.thematic_area,
        content: question.content,
        objective: question.objective,
        skill: question.skill,
      });
    });

    set_question_items(new_question_items);

  }
  useEffect(() => {
    document.addEventListener("update_questions_metadata", get_specification_data);

    return () => {
      document.removeEventListener("update_questions_metadata", get_specification_data);
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
              item_data={item}
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
              thematic_area={item.thematic_area}
              content={item.content}
              objective={item.objective}
              skill={item.skill}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

