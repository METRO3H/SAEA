import { quiz_data_store, type Quiz, type Question_Item } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import Question_Content_Item from "@components/question/editable/question_content_item";
import Question_List_Item from "@components/question/question_list_item.jsx";
import "@styles/questions_data.css";
import { useEffect, useState } from "react";

import { Tab, initMDB } from "mdb-ui-kit";

export default function Questions_Data() {
  const $quiz_data: Quiz = useStore(quiz_data_store);
  const [tab_state, set_tab_state] = useState<boolean>(false);

  async function Filter_Question_List_Items() {
    const $question_items = $quiz_data.questions;
    const $total_questions = $quiz_data.specifications_table.total_questions;

    if ($total_questions === $question_items.length) return;

    if ($total_questions < $question_items.length)
      return quiz_data_store.set({
        ...$quiz_data,
        questions: $question_items.slice(0, $total_questions),
      });

    const $question_items_filled = $question_items.concat(
      new Array($total_questions - $question_items.length).fill({
        question: "",
        answers: ["", ""],
        correct_answer_index: -1,
      })
    );

    return quiz_data_store.set({
      ...$quiz_data,
      questions: $question_items_filled,
    });
  }

  function Get_Metadata_Map() {
    const metadata_map = new Map();
    $quiz_data.specifications_table.items.forEach((item) => {
      const assigned_questions = [item.skill_content].flatMap((skill_content) => {
        const skill_content_patron = skill_content.match(/\d+-\d+|\d+/g) || [];

        return skill_content_patron.flatMap((range) => {
          if (range.includes("-")) {
            const [start, end] = range.split("-").map(Number);
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
          }
          return Number(range);
        });
      });

      assigned_questions.forEach((question) => {
        metadata_map.set(question, {
          thematic_area: item.thematic_area,
          content: item.content,
          objective: item.objective,
          skill: $quiz_data.specifications_table.quiz_skills[item.skill_index],
        });
      });
    });

    return metadata_map;
  }

  function Update_Question_Item(item_index: number, new_item: Question_Item) {
    return quiz_data_store.set({
      ...$quiz_data,
      questions: $quiz_data.questions.map((item, index) =>
        index === item_index ? new_item : item
      ),
    });
  }

  useEffect(() => {
     Filter_Question_List_Items();

    if (tab_state) return;

    initMDB({ Tab });
    set_tab_state(true);
    
  }, [$quiz_data]);

  const metadata_map = Get_Metadata_Map();

  // console.log(metadata_map);

  return (
    <div id="main-question-container">
      <div id="question-list-container">
        <div className="list-group list-group-light" id="list-tab" role="tablist" data-tabs>
          {$quiz_data.questions.map((item, index) => (
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
          {$quiz_data.questions.map((item, index) => (
            <Question_Content_Item
              key={`question_content_key_${index + 1}`}
              question_content_item_number={index + 1}
              add_class={index === 0 ? "active" : ""}
              update_question_item={Update_Question_Item}
              question_item_index={index}
              data={item}
              metadata={metadata_map.get(index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
