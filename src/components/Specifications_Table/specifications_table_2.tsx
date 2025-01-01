import { useState } from "react";
import { quiz_data_store, update_spect_store, type Quiz, type RowSpan } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import "@styles/table_2.css";

export default function Specifications_Table() {
   const $quiz_data: Quiz = useStore(quiz_data_store);
   const $update_spect: boolean = useStore(update_spect_store);

   const [local_quiz, set_local_quiz] = useState<Quiz>($quiz_data);

   const [editing_cell, set_editing_cell] = useState<{ index: number; field: string } | null>(null);
   const [editing_total_questions, set_editing_total_questions] = useState<boolean>(false);
   const [editing_skill_cell, set_editing_skill_cell] = useState<{
      index: number;
      skill_index: number;
   } | null>(null);

   console.log(local_quiz.specifications_table.items);
   const total_classes = local_quiz.specifications_table.items.reduce(
      (acc, item) => acc + Math.abs(item.performed_classes),
      0
   );
   const total_question_count = local_quiz.specifications_table.total_questions;

   function Handle_Fixed_Field_Change(field: string, value: string) {
      const new_value: string = value ? value : "";
      const local_quiz_aux = { ...local_quiz };

      if (field === "quiz_subject") local_quiz_aux.quiz_subject = new_value;
      else if (field === "total_questions") {
         set_editing_total_questions(false);
         local_quiz_aux.specifications_table.total_questions = Math.max(
            0,
            Math.floor(Number(new_value) || 0)
         );
      }

      set_local_quiz(local_quiz_aux);
   }

   function Handle_Field_Change(index: number, field: string, value: string) {
      set_editing_cell(null);

      const new_value: string = value ? value : "";
      const local_quiz_aux = { ...local_quiz };

      if (field === "quiz_skills") {
         const current_value = local_quiz.specifications_table.quiz_skills[index];
         if (current_value === new_value) return;
         local_quiz_aux.specifications_table.quiz_skills[index] = new_value;
      } else if (field === "thematic_area" || field === "content") {
         const current_value = local_quiz.specifications_table.items[index][field];
         if (current_value === new_value) return;
         local_quiz_aux.specifications_table.items = local_quiz_aux.specifications_table.items.map(
            (item) => (item[field] === current_value ? { ...item, [field]: new_value } : item)
         );
      } else if (field === "objective") {
         const current_value = local_quiz.specifications_table.items[index].objective;
         if (current_value === new_value) return;
         local_quiz_aux.specifications_table.items[index].objective = new_value;
      } else if (field === "performed_classes") {
         const current_value = local_quiz.specifications_table.items[index].performed_classes;
         const new_value_parsed = Math.max(0, Math.floor(Number(new_value) || 0));
         if (current_value === new_value_parsed) return;
         local_quiz_aux.specifications_table.items[index].performed_classes = new_value_parsed;
      }

      set_local_quiz(local_quiz_aux);
   }

   function Handle_Row_Skills_Change(index: number, position: number, value: string) {
      set_editing_skill_cell(null);
      const new_value: string = value ? value : "";
      const local_quiz_aux = { ...local_quiz };

      const current_value = local_quiz.specifications_table.items[index].row_skills[position];

      if (current_value === new_value) return;

      local_quiz_aux.specifications_table.items[index].row_skills[position] = new_value;

      set_local_quiz(local_quiz_aux);
   }

   function Update_Specifications_Table() {
      quiz_data_store.set({
         ...$quiz_data,
         specifications_table: local_quiz.specifications_table,
         quiz_subject: local_quiz.quiz_subject,
      });

      update_spect_store.set(false);
   }

   function Get_Skill_Content_Values(skill_content_list: string[]) {
      const result = skill_content_list.flatMap((item) => {
         const skill_content_patron = item.match(/\d+-\d+|\d+/g) || [];

         return skill_content_patron.flatMap((range) => {
            if (range.includes("-")) {
               const [start, end] = range.split("-").map(Number);
               return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            }
            return Number(range);
         });
      });
      return result;
   }

   function Get_Skill_Content_Columns(column_index: number) {
      const column_list = local_quiz.specifications_table.items
         .map((item) => item.row_skills[column_index])
         .filter((item) => item !== "");

      const column_values: number[] = Get_Skill_Content_Values(column_list);

      return column_values;
   }
   function Process_Table_Items(
      items: Quiz["specifications_table"]["items"],
      total_classes: number,
      total_question_count: number
   ) {
      const thematic_area_seen = new Set();
      const content_seen = new Set();

      return items.map((item) => {
         const is_first_thematic_area = !thematic_area_seen.has(item.thematic_area);
         const is_first_content = !content_seen.has(item.content);

         if (is_first_thematic_area) thematic_area_seen.add(item.thematic_area);
         if (is_first_content) content_seen.add(item.content);

         const classes_relation =
            !isNaN(item.performed_classes) && !isNaN(total_classes)
               ? item.performed_classes / total_classes
               : 0;

         let classes_percentage: any = classes_relation * 100;
         classes_percentage = Number.isInteger(classes_percentage)
            ? parseInt(classes_percentage)
            : classes_percentage.toFixed(1);

         classes_percentage = total_classes === 0 ? " - " : classes_percentage + "%";

         const item_question_count = Get_Skill_Content_Values(item.row_skills).length;

         const expected_item_question_count =
            total_question_count > 0 && classes_relation > 0
               ? Math.round(total_question_count * classes_relation)
               : 0;

         const success_item_question_count =
            item_question_count === expected_item_question_count
               ? " td-total-questions-successful"
               : "";

         return {
            ...item,
            render_thematic_area: is_first_thematic_area,
            render_content: is_first_content,
            classes_relation,
            classes_percentage,
            item_question_count,
            expected_item_question_count,
            success_item_question_count,
         };
      });
   }

   function Calculate_RowSpans(items: Quiz["specifications_table"]["items"]) {
      const row_spans: RowSpan = {
         thematic_area: {},
         content: {},
      };

      items.forEach((item) => {
         const { thematic_area, content } = item;

         row_spans.thematic_area[thematic_area] = (row_spans.thematic_area[thematic_area] || 0) + 1;
         row_spans.content[content] = (row_spans.content[content] || 0) + 1;
      });

      return row_spans;
   }

   const row_spans = Calculate_RowSpans(local_quiz.specifications_table.items);

   const processed_table_items = Process_Table_Items(
      local_quiz.specifications_table.items,
      total_classes,
      total_question_count
   );

  //  console.log(local_quiz);
   return (
      <table className="table table-bordered caption-top">
         <caption>
            <div id="caption-container">
               <div id="table-subject">
                  <input
                     placeholder="Asignatura"
                     defaultValue={local_quiz.quiz_subject}
                     onBlur={(event) =>
                        Handle_Fixed_Field_Change("quiz_subject", event.target.value.trim())
                     }
                  />
               </div>
               <div id="table-title">
                  <i className="fas fa-table fa-2x"></i>
                  <h2 className="h4 fw-bold">Tabla de especificaciones</h2>
               </div>
            </div>
         </caption>
         <thead className="table-dark">
            <tr>
               <th id="thead-axis" className="left-cell thead-fix-y-padding">
                  Eje
               </th>
               <th id="thead-content" className="left-cell thead-fix-y-padding">
                  Contenidos
               </th>
               <th id="thead-objective" className="left-cell thead-fix-y-padding">
                  Objetivos
               </th>
               <th id="thead-classes" className="text-center thead-fix-y-padding">
                  Clases
               </th>
               <th id="thead-percentage" className="text-center thead-fix-y-padding">
                  %
               </th>

               {local_quiz.specifications_table.quiz_skills.map((item, skill_index) => (
                  <th key={"skill-index-" + skill_index} className="cell thead-input">
                     <input
                        className="text-center"
                        type="text"
                        placeholder="Habilidad"
                        required
                        defaultValue={item}
                        onBlur={(event) =>
                           Handle_Field_Change(skill_index, "quiz_skills", event.target.value.trim())
                        }
                     />
                  </th>
               ))}
               <th>
                  <div className="text-center">Total preguntas</div>
               </th>
            </tr>
         </thead>

         <tbody>
            {processed_table_items.map((item, index) => {
               return (
                  <tr key={index}>
                     {item.render_thematic_area && (
                        <td
                           className="td-input td-thematic_area"
                           rowSpan={row_spans.thematic_area[item.thematic_area]}
                           onClick={() => set_editing_cell({ index, field: "thematic_area" })}
                        >
                           {editing_cell?.index === index &&
                           editing_cell?.field === "thematic_area" ? (
                              <textarea
                                 defaultValue={item.thematic_area}
                                 onBlur={(event) =>
                                    Handle_Field_Change(
                                       index,
                                       "thematic_area",
                                       event.target.value.trim()
                                    )
                                 }
                                 onFocus={(event) =>
                                    (event.currentTarget.selectionStart =
                                       event.currentTarget.value.length)
                                 }
                                 autoFocus
                              />
                           ) : (
                              item.thematic_area
                           )}
                        </td>
                     )}
                     {item.render_content && (
                        <td
                           className="td-input td-content"
                           rowSpan={row_spans.content[item.content]}
                           onClick={() => set_editing_cell({ index, field: "content" })}
                        >
                           {editing_cell?.index === index && editing_cell?.field === "content" ? (
                              <textarea
                                 defaultValue={item.content}
                                 onBlur={(event) =>
                                    Handle_Field_Change(index, "content", event.target.value.trim())
                                 }
                                 onFocus={(event) =>
                                    (event.currentTarget.selectionStart =
                                       event.currentTarget.value.length)
                                 }
                                 autoFocus
                              />
                           ) : (
                              item.content
                           )}
                        </td>
                     )}
                     <td
                        className="td-input td-objective"
                        onClick={() => set_editing_cell({ index, field: "objective" })}
                     >
                        {editing_cell?.index === index && editing_cell?.field === "objective" ? (
                           <textarea
                              defaultValue={item.objective}
                              onBlur={(event) =>
                                 Handle_Field_Change(index, "objective", event.target.value.trim())
                              }
                              onFocus={(event) =>
                                 (event.currentTarget.selectionStart =
                                    event.currentTarget.value.length)
                              }
                              autoFocus
                           />
                        ) : (
                           item.objective
                        )}
                     </td>
                     <td
                        className="td-input td-performed-classes text-center align-middle"
                        onClick={() => set_editing_cell({ index, field: "performed_classes" })}
                     >
                        {editing_cell?.index === index &&
                        editing_cell?.field === "performed_classes" ? (
                           <input
                              defaultValue={item.performed_classes}
                              onBlur={(event) =>
                                 Handle_Field_Change(
                                    index,
                                    "performed_classes",
                                    event.target.value.trim()
                                 )
                              }
                              onFocus={(event) =>
                                 (event.currentTarget.selectionStart =
                                    event.currentTarget.value.length)
                              }
                              autoFocus
                           />
                        ) : (
                           item.performed_classes
                        )}
                     </td>

                     <td className="td-percentage text-center align-middle number-cell">
                        {" "}
                        {item.classes_percentage}{" "}
                     </td>

                     {local_quiz.specifications_table.quiz_skills.map((_, skill_index) => (
                        <td
                           key={"skill-index-" + skill_index}
                           className="td-input td-skill text-center align-middle"
                           onClick={() => set_editing_skill_cell({ index, skill_index })}
                        >
                           {editing_skill_cell?.index === index &&
                           editing_skill_cell?.skill_index === skill_index ? (
                              <input
                                 defaultValue={
                                    // item.skill_index === skill_index ? item.skill_content : ""
                                    item.row_skills[skill_index] || ""
                                 }
                                 onBlur={(event) => {
                                    Handle_Row_Skills_Change(
                                       index,
                                       skill_index,
                                       event.target.value.trim()
                                    );
                                 }}
                                 onFocus={(event) =>
                                    (event.currentTarget.selectionStart =
                                       event.currentTarget.value.length)
                                 }
                                 autoFocus
                              />
                           ) : (
                              <span>
                                 {
                                    // item.skill_index === skill_index ? item.skill_content : " - "
                                    item.row_skills[skill_index] || " - "
                                 }
                              </span>
                           )}
                        </td>
                     ))}

                     <td
                        className={
                           "td-total-questions text-center align-middle" +
                           item.success_item_question_count
                        }
                     >
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
               {local_quiz.specifications_table.quiz_skills.map((_, skill_index) => (
                  <td key={"foot-skill-index-" + skill_index} className="text-center number-cell">
                     {Get_Skill_Content_Columns(skill_index).length}
                  </td>
               ))}
               {/* <td className="text-center number-cell item-total-skill">0</td>
          <td className="text-center number-cell item-total-skill">0</td>
          <td className="text-center number-cell item-total-skill">0</td> */}
               <td
                  className="td-input text-center number-cell"
                  id="item-total-all-questions"
                  onClick={() => set_editing_total_questions(true)}
               >
                  {editing_total_questions ? (
                     <input
                        defaultValue={total_question_count}
                        onBlur={(event) =>
                           Handle_Fixed_Field_Change("total_questions", event.target.value.trim())
                        }
                        onFocus={(event) =>
                           (event.currentTarget.selectionStart = event.currentTarget.value.length)
                        }
                        autoFocus
                     />
                  ) : (
                     total_question_count
                  )}
               </td>
            </tr>
         </tfoot>
      </table>
   );
}
