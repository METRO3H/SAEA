import { quiz_data_store, type Quiz } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import Question_Content_Item from "@components/question/question_content_item.jsx";
import Question_List_Item from "@components/question/question_list_item.jsx";
import "@styles/questions_data.css";
import { useEffect } from "react";

import { Tab, initMDB } from "mdb-ui-kit";

export default function Questions_Data() {
  const $quiz_data: Quiz = useStore(quiz_data_store);

  function Filter_Question_List_Items() {
    const $question_items = $quiz_data.questions;
    const $total_questions = $quiz_data.specifications_table.total_questions;

    if ($total_questions === $question_items.length) return $question_items;

    if ($total_questions < $question_items.length)
      return $question_items.slice(0, $total_questions);

    return $question_items.concat(
      new Array($total_questions - $question_items.length).fill({
        question: "",
        answers: ["", ""],
        correct_answer_index: 0,
      })
    );
  }

  useEffect(() => {
    initMDB({ Tab });
  }, []);

  const question_list_adjusted = Filter_Question_List_Items() || {
    question: "",
    answers: ["", ""],
    correct_answer_index: 0,
  };

  return (
    <div id="main-question-container">
      <div id="question-list-container">
        <div className="list-group list-group-light" id="list-tab" role="tablist" data-tabs>
          {question_list_adjusted.map((item, index) => (
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
          {question_list_adjusted.map((item, index) => (
            <Question_Content_Item
              key={`question_content_key_${index + 1}`}
              question_content_item_number={index + 1}
              add_class={index === 0 ? "active" : ""}
              data={item}
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
