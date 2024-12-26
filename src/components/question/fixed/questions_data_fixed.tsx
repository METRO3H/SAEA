import { quiz_data_store, type Quiz, type Question_Item } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import Question_Content_Item from "@components/question/fixed/question_content_item_fixed";
import "@styles/questions_data.css";
import { useEffect } from "react";
import { Tab, initMDB } from "mdb-ui-kit";

export default function Questions_Data() {
  const $quiz_data: Quiz = useStore(quiz_data_store);

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

  useEffect(() => {
    initMDB({ Tab });
  }, [$quiz_data]);


  const metadata_map = Get_Metadata_Map();

  return (
    <div id="main-question-container">
      <div id="question-list-container">
        <div className="list-group list-group-light" id="list-tab" role="tablist">
          {$quiz_data.questions.map((_, index) => (
            <a
              key={"list-item-" + index}
              title={`Pregunta ${index + 1}`}
              className={
                "px-3 border-0 list-group-item list-group-item-action " +
                (index === 0 ? "active" : "")
              }
              data-mdb-list-init
              href={"#question-" + (index + 1)}
              role="tab"
              aria-controls={`question-content-item-${index + 1}`}
            >
              <i className="fas fa-circle-question"></i> Pregunta {index + 1}
            </a>
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
              data={item}
              metadata={metadata_map.get(index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
