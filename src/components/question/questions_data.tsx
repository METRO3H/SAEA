import { quiz_data_store, type Quiz } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import Question_Content_Item from "@components/question/question_content_item.jsx";
import Question_List_Item from "@components/question/question_list_item.jsx";
import "@styles/questions_data.css";
import { useEffect } from "react";
import { Tab, initMDB } from "mdb-ui-kit";

export default function Questions_Data() {
  const $quiz_data: Quiz = useStore(quiz_data_store);
  const $question_items = $quiz_data.questions;
  
  useEffect(() => {
    initMDB({ Tab });
  }, []);

  return (
    <div id="main-question-container">
      <div id="question-list-container">
        <div className="list-group list-group-light" id="list-tab" role="tablist" data-tabs>
          {$question_items.map((item, index) => (
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
          {$question_items.map((item, index) => (
            <Question_Content_Item
              key={`question_content_key_${index + 1}`}
              question_content_item_number={index + 1}
              add_class={index === 0 ? "active" : ""}
              // thematic_area={item.thematic_area}
              // content={item.content}
              // objective={item.objective}
              // skill={item.skill}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
