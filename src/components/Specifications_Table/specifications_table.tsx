import type { SpecTable, RowSpan, RowsRequirement, EditCell, EditSkillCell, ProcessedItem } from "@content/types";
import Quiz_Subject from "./quiz_subject";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { $specifications_table, $update_spect_flag } from "@content/shared/quiz_data";
import { Update_Spec_Table } from "@content/shared/update_state";
import { Get_Assigned_Questions } from "@handlers/get_assigned_questions";
import "@styles/table_2.css";

export default function Specifications_Table() {
   const $spec_table_store = useStore($specifications_table);

   const [local_spec_table, set_local_spec_table] = useState($spec_table_store);

   const [processed_items, set_processed_items] = useState<ProcessedItem[]>([]);
   const [row_spans, set_row_spans] = useState<RowSpan | null>(null);

   const local_spec_table_ref = useRef(local_spec_table);
   const rows_requirement_ref = useRef<RowsRequirement[]>([]);

   const [editing_cell, set_editing_cell] = useState<EditCell | null>(null);
   const [editing_total_questions, set_editing_total_questions] = useState<boolean>(false);
   const [editing_skill_cell, set_editing_skill_cell] = useState<EditSkillCell | null>(null);

   function Update_Specifications_Table() {
      const verification_result = Verify_Requirements_To_Update();
      if (!verification_result) return;

      Update_Spec_Table(local_spec_table_ref.current);
   }
   function Verify_Requirements_To_Update() {
      const requirements = rows_requirement_ref.current;
      for (const requirement of requirements) {
         if (requirement.expected_value < 1) {
            alert("Hay un error en el total de preguntas especificado, por favor revisa la tabla de especificaciones");
            return false;
         } else if (requirement.real_value === requirement.expected_value) continue;
         else if (requirement.real_value < requirement.expected_value) {
            alert("Se han indicado menos preguntas de las necesarias, por favor revisa la tabla de especificaciones");
            return false;
         } else if (requirement.real_value > requirement.expected_value) {
            alert("Se han indicado mas preguntas de las necesarias, por favor revisa la tabla de especificaciones");
            return false;
         }
      }

      return true;
   }

   function Handle_Total_Questions_Change(value: string) {
      set_editing_total_questions(false);
      const new_value: string = value ? value : "";
      const local_spec_table_aux = { ...local_spec_table };
      local_spec_table_aux.total_questions = Math.max(0, Math.floor(Number(new_value) || 0));
      set_local_spec_table(local_spec_table_aux);
   }

   function Handle_Field_Change(index: number, field: string, value: string) {
      set_editing_cell(null);

      const new_value: string = value ? value : "";
      const local_spec_table_aux = { ...local_spec_table };

      if (field === "quiz_skills") {
         const current_value = local_spec_table.quiz_skills[index];
         if (current_value === new_value) return;
         local_spec_table_aux.quiz_skills[index] = new_value;
      } else if (field === "thematic_area" || field === "content") {
         const current_value = local_spec_table.items[index][field];
         if (current_value === new_value) return;
         local_spec_table_aux.items = local_spec_table_aux.items.map((item) =>
            item[field] === current_value ? { ...item, [field]: new_value } : item
         );
      } else if (field === "objective") {
         const current_value = local_spec_table.items[index].objective;
         if (current_value === new_value) return;
         local_spec_table_aux.items[index].objective = new_value;
      } else if (field === "performed_classes") {
         const current_value = local_spec_table.items[index].performed_classes;
         const new_value_parsed = Math.max(0, Math.floor(Number(new_value) || 0));
         if (current_value === new_value_parsed) return;
         local_spec_table_aux.items[index].performed_classes = new_value_parsed;
      }

      set_local_spec_table(local_spec_table_aux);
   }

   function Handle_Row_Skills_Change(index: number, position: number, value: string) {
      set_editing_skill_cell(null);
      const string_regex = /\d+(?:\s*-\s*\d+)?/g;
      const new_value_matches = value.match(string_regex);
      const new_value: string = new_value_matches ? new_value_matches.join(", ") : "";

      const local_spec_table_aux = { ...local_spec_table };

      const current_value = local_spec_table.items[index].row_skills[position];

      if (current_value === new_value) return;

      local_spec_table_aux.items[index].row_skills[position] = new_value;

      set_local_spec_table(local_spec_table_aux);
   }

   function Get_Skill_Content_Columns(column_index: number) {
      const column_list = local_spec_table.items
         .map((item) => item.row_skills[column_index])
         .filter((item) => item !== "");

      const column_values: number[] = Get_Assigned_Questions(column_list);
      // console.log(column_values);
      return column_values;
   }
   function Process_Table_Items(items: SpecTable["items"], total_classes: number, total_question_count: number) {
      const thematic_area_seen = new Set();
      const content_seen = new Set();

      const rows_requirement_aux: RowsRequirement[] = [];

      const row_spans_aux: RowSpan = {
         thematic_area: {},
         content: {},
      };

      const processed_items_aux = items.map((item) => {
         const is_first_thematic_area = !thematic_area_seen.has(item.thematic_area);
         const is_first_content = !content_seen.has(item.content);

         if (is_first_thematic_area) thematic_area_seen.add(item.thematic_area);
         if (is_first_content) content_seen.add(item.content);

         const classes_relation =
            !isNaN(item.performed_classes) && !isNaN(total_classes) ? item.performed_classes / total_classes : 0;

         let classes_percentage: any = classes_relation * 100;
         classes_percentage = Number.isInteger(classes_percentage)
            ? parseInt(classes_percentage)
            : classes_percentage.toFixed(1);

         classes_percentage = total_classes === 0 ? " - " : classes_percentage + "%";

         const item_question_count = Get_Assigned_Questions(item.row_skills).length;

         const expected_item_question_count =
            total_question_count > 0 && classes_relation > 0 ? Math.round(total_question_count * classes_relation) : 0;

         const success_item_question_count =
            item_question_count === expected_item_question_count ? " td-total-questions-successful" : "";

         rows_requirement_aux.push({
            real_value: item_question_count,
            expected_value: expected_item_question_count,
         });

         row_spans_aux.thematic_area[item.thematic_area] = (row_spans_aux.thematic_area[item.thematic_area] || 0) + 1;
         row_spans_aux.content[item.content] = (row_spans_aux.content[item.content] || 0) + 1;

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

      return { processed_items_aux, row_spans_aux, rows_requirement_aux };
   }

   useEffect(() => {
      const unlisten = $update_spect_flag.listen(() => Update_Specifications_Table());

      return () => {
         unlisten();
      };
   }, []);

   useEffect(() => {
      local_spec_table_ref.current = local_spec_table;

      const { processed_items_aux, row_spans_aux, rows_requirement_aux } = Process_Table_Items(
         local_spec_table.items,
         total_classes,
         total_question_count
      );
      set_processed_items(processed_items_aux);
      set_row_spans(row_spans_aux);
      rows_requirement_ref.current = rows_requirement_aux;
   }, [local_spec_table]);

   const total_classes = local_spec_table.items.reduce((acc, item) => acc + Math.abs(item.performed_classes), 0);
   const total_question_count = local_spec_table.total_questions;

   return (
      <table className="table table-bordered caption-top">
         <caption>
            <div id="caption-container">
               <div id="table-subject">
                  <Quiz_Subject />
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

               {local_spec_table.quiz_skills.map((item, skill_index) => (
                  <th key={"skill-index-" + skill_index} className="cell thead-input">
                     <input
                        className="text-center"
                        type="text"
                        placeholder="Habilidad"
                        required
                        defaultValue={item}
                        onBlur={(event) => Handle_Field_Change(skill_index, "quiz_skills", event.target.value.trim())}
                     />
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
                           onClick={() => set_editing_cell({ index, field: "thematic_area" })}
                        >
                           {editing_cell?.index === index && editing_cell?.field === "thematic_area" ? (
                              <textarea
                                 defaultValue={item.thematic_area}
                                 onBlur={(event) =>
                                    Handle_Field_Change(index, "thematic_area", event.target.value.trim())
                                 }
                                 onFocus={(event) =>
                                    (event.currentTarget.selectionStart = event.currentTarget.value.length)
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
                           rowSpan={row_spans?.content[item.content]}
                           onClick={() => set_editing_cell({ index, field: "content" })}
                        >
                           {editing_cell?.index === index && editing_cell?.field === "content" ? (
                              <textarea
                                 defaultValue={item.content}
                                 onBlur={(event) => Handle_Field_Change(index, "content", event.target.value.trim())}
                                 onFocus={(event) =>
                                    (event.currentTarget.selectionStart = event.currentTarget.value.length)
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
                              onBlur={(event) => Handle_Field_Change(index, "objective", event.target.value.trim())}
                              onFocus={(event) =>
                                 (event.currentTarget.selectionStart = event.currentTarget.value.length)
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
                        {editing_cell?.index === index && editing_cell?.field === "performed_classes" ? (
                           <input
                              defaultValue={item.performed_classes}
                              onBlur={(event) =>
                                 Handle_Field_Change(index, "performed_classes", event.target.value.trim())
                              }
                              onFocus={(event) =>
                                 (event.currentTarget.selectionStart = event.currentTarget.value.length)
                              }
                              autoFocus
                           />
                        ) : (
                           item.performed_classes
                        )}
                     </td>

                     <td className="td-percentage text-center align-middle number-cell"> {item.classes_percentage} </td>

                     {local_spec_table.quiz_skills.map((_, skill_index) => (
                        <td
                           key={"skill-index-" + skill_index}
                           className="td-input td-skill text-center align-middle"
                           onClick={() => set_editing_skill_cell({ index, skill_index })}
                        >
                           {editing_skill_cell?.index === index && editing_skill_cell?.skill_index === skill_index ? (
                              <input
                                 defaultValue={
                                    // item.skill_index === skill_index ? item.skill_content : ""
                                    item.row_skills[skill_index] || ""
                                 }
                                 onBlur={(event) => {
                                    Handle_Row_Skills_Change(index, skill_index, event.target.value.trim());
                                 }}
                                 onFocus={(event) =>
                                    (event.currentTarget.selectionStart = event.currentTarget.value.length)
                                 }
                                 pattern="\d+-\d+|\d+"
                                 autoFocus
                                 required
                              />
                           ) : (
                              <span>{item.row_skills[skill_index] || " - "}</span>
                           )}
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
               {local_spec_table.quiz_skills.map((_, skill_index) => (
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
                        onBlur={(event) => Handle_Total_Questions_Change(event.target.value.trim())}
                        onFocus={(event) => (event.currentTarget.selectionStart = event.currentTarget.value.length)}
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
