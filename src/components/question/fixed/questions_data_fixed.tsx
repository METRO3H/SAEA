import type { QuestionItem, Metadata } from "@content/types";
import { $specifications_table, $questions } from "@content/shared/quiz_data";
import { Tab, initMDB } from "mdb-ui-kit";
import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import Question_Content_Item from "@components/question/fixed/question_content_item_fixed";
import { Get_Questions_From_Item } from "@handlers/get_assigned_questions";
import "@styles/questions_data.css";

export default function Questions_Data() {
   const $questions_store = useStore($questions);
   const $specifications_table_store = useStore($specifications_table);
  
   function Get_Metadata_Map() {
      const metadata_map_aux: Map<number, Metadata> = new Map();
      for (const item of $specifications_table_store.items) {
         const assigned_questions = item.row_skills.flatMap((skill, index) => {
            if (skill) {
               return Get_Questions_From_Item(skill).map((question_number) => ({
                  number: question_number,
                  skill: $specifications_table_store.quiz_skills[index],
               }));
            }
            return [];
         });

         for (const question of assigned_questions) {
            metadata_map_aux.set(question.number, {
               thematic_area: item.thematic_area,
               content: item.content,
               objective: item.objective,
               skill: question.skill,
            });
         }
      }
      return metadata_map_aux;
   }

   useEffect(() => {
      initMDB({ Tab });
   }, [$specifications_table_store.total_questions]);

   const metadata_map = Get_Metadata_Map();

   return (
      <div id="main-question-container">
         <div id="question-list-container">
            <div className="list-group list-group-light" id="list-tab" role="tablist">
               {$questions_store.map((_, index) => (
                  <a
                     key={"list-item-" + index}
                     title={`Pregunta ${index + 1}`}
                     className={"px-3 border-0 list-group-item list-group-item-action " + (index === 0 ? "active" : "")}
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
               {$questions_store.map((item, index) => (
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
