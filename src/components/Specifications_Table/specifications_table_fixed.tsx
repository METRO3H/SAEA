import { useStore } from "@nanostores/react";
import { $specifications_table, $quiz_subject } from "@content/shared/quiz_data";
import { Process_Table_Items } from "@handlers/process_table_items";
import { Get_Skill_Content_Columns } from "@handlers/get_skill_content_columns";
import "@styles/table_2.css";

export default function Specifications_Table() {
   const $spec_table_store = useStore($specifications_table);
   const $quiz_subject_store = useStore($quiz_subject);


   const total_classes = $spec_table_store.items.reduce((acc, item) => acc + Math.abs(item.performed_classes), 0);
   const total_question_count = $spec_table_store.total_questions;

   const { processed_items, row_spans } = Process_Table_Items(
    $spec_table_store.items,
    total_classes,
    total_question_count
 );
   return (
      <table className="table table-bordered caption-top">
         <caption>
            <div id="caption-container">
               <div id="table-subject">
               {$quiz_subject_store}
               </div>
               <div id="table-title">
                  <i className="fas fa-table fa-2x"></i>
                  <h2 className="h4 fw-bold">Tabla de especificaciones</h2>
               </div>
            </div>
         </caption>
         <thead className="table-dark">
            <tr>
               <th id="thead-axis" className="left-cell align-middle">
                  Eje
               </th>
               <th id="thead-content" className="left-cell align-middle">
                  Contenidos
               </th>
               <th id="thead-objective" className="text-start align-middle">
                  Objetivos
               </th>
               <th id="thead-classes" className="text-center align-middle">
                  Clases
               </th>
               <th id="thead-percentage" className="text-center align-middle">
                  %
               </th>

               {$spec_table_store.quiz_skills.map((item, skill_index) => (
                  <th key={"skill-index-" + skill_index} className="cell thead-input text-center align-middle">
                     {item}
                  </th>
               ))}
               <th className="text-center align-middle">Total preguntas</th>
            </tr>
         </thead>

         <tbody>
            {processed_items?.map((item, index) => {
               return (
                  <tr key={index}>
                     {item.render_thematic_area && (
                        <td
                           className="td-input td-thematic_area"
                           rowSpan={row_spans?.thematic_area[item.thematic_area]}
                        >
                           {
                              item.thematic_area
                           }
                        </td>
                     )}
                     {item.render_content && (
                        <td
                           className="td-input td-content"
                           rowSpan={row_spans?.content[item.content]}
                        >
                           {
                              item.content
                           }
                        </td>
                     )}
                     <td
                        className="td-input td-objective"
                     >
                        { 
                           item.objective
                        }
                     </td>
                     <td
                        className="td-input td-performed-classes text-center align-middle"
                     >
                        { 
                           item.performed_classes
                        }
                     </td>

                     <td className="td-percentage text-center align-middle number-cell"> {item.classes_percentage} </td>

                     {$spec_table_store.quiz_skills.map((_, skill_index) => (
                        <td
                           key={"skill-index-" + skill_index}
                           className="td-input td-skill text-center align-middle"
                        >
                           { 
                              <span>{item.row_skills[skill_index] || " - "}</span>
                           }
                        </td>
                     ))}

                     <td className={"td-total-questions text-center align-middle" + item.success_item_question_count}>
                        {item.item_question_count + "/" + item.expected_item_question_count}
                     </td>
                  </tr>
               );
            })}
         </tbody>

         <tfoot>
            <tr>
               <td colSpan={3} className="text-center">
                  TOTAL
               </td>
               <td className="text-center number-cell">{total_classes}</td>
               <td className="text-center number-cell">100%</td>
               {$spec_table_store.quiz_skills.map((_, skill_index) => (
                  <td key={"foot-skill-index-" + skill_index} className="text-center number-cell">
                     {Get_Skill_Content_Columns(skill_index, $spec_table_store.items).length}
                  </td>
               ))}
               <td
                  className="td-input text-center number-cell"
                  id="item-total-all-questions"
               >
                  { 
                     total_question_count
                  }
               </td>
            </tr>
         </tfoot>
      </table>
   );
}
