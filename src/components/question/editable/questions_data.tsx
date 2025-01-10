import type { QuestionItem, Metadata } from "@content/types";
import { $questions, $specifications_table } from "@content/shared/quiz_data";
import { Update_Questions } from "@content/shared/update_state";
import { useEffect, useState } from "react";
import { Tab, initMDB } from "mdb-ui-kit";
import { useStore } from "@nanostores/react";
import Question_Content_Item from "@components/question/editable/question_content_item";
import Question_List_Item from "@components/question/question_list_item.jsx";
import { Get_Questions_From_Item } from "@handlers/get_assigned_questions";
import "@styles/questions_data.css";

export default function Questions_Data() {
   const $questions_store = useStore($questions);
   const $specifications_table_store = useStore($specifications_table);
   const [metadata_map, set_metadata_map] = useState(new Map());

   function Filter_Question_List_Items() {
      const question_items = $questions_store;
      const total_questions = $specifications_table_store.total_questions;

      if (total_questions === question_items.length) return;

      if (total_questions < question_items.length) {
         const new_questions = question_items.slice(0, total_questions);
         return Update_Questions(new_questions);
      }

      const question_items_filled = question_items.concat(
         new Array(total_questions - question_items.length).fill({
            question: "",
            answers: ["", ""],
            correct_answer_index: -1,
         })
      );

      return Update_Questions(question_items_filled);
   }

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

   function Update_Question_Item(item_index: number, new_question: QuestionItem) {
      const questions_aux = [...$questions_store];

      questions_aux[item_index] = new_question;

      return Update_Questions(questions_aux);
   }

   useEffect(() => {
      Filter_Question_List_Items();
      initMDB({ Tab });
   }, [$specifications_table_store.total_questions]);

   useEffect(() => {
      set_metadata_map(Get_Metadata_Map());
   }, [$specifications_table_store]);

   console.log($questions_store);
   return (
      <div id="main-question-container">
         <div id="question-list-container">
            <div className="list-group list-group-light" id="list-tab" role="tablist" data-tabs>
               {$questions_store.map((item, index) => (
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
               {$questions_store.map((item, index) => (
                  <Question_Content_Item
                     key={`question_content_key_${index + 1}`}
                     question_content_item_number={index + 1}
                     add_class={index === 0 ? "active" : ""}
                     Update_Question_Item={Update_Question_Item}
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
