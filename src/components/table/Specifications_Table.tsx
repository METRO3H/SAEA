import { quiz_data_store, type Quiz, type RowSpan } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import { useState } from "react";
import "@styles/table_2.css";

export default function Specifications_Table() {
  const $quiz_data: Quiz = useStore(quiz_data_store);
  const [editing_cell, set_editing_cell] = useState<{ index: number; field: string } | null>(null);
  const [editing_skill_cell, set_editing_skill_cell] = useState<{ index: number; skill_index: number } | null>(null);
  
  console.log($quiz_data.specifications_table.items);

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

  function Handle_Blur(event, index: number, field: string, skill_index: number = -1) {
    const old_value = $quiz_data.specifications_table.items[index][field] || "";
    let new_value = event.target.value.trim() || " - ";

    let updated_items:Quiz["specifications_table"]["items"] = []

    if (field === "thematic_area" || field === "content" || field === "objective") {
      updated_items = $quiz_data.specifications_table.items.map((item, item_index) =>
        item[field] === old_value ? { ...item, [field]: new_value } : item
      );
    }
    if (field === "performed_classes") {
      updated_items = $quiz_data.specifications_table.items.map((item, item_index) =>
        item_index === index ? (item[field] === old_value ? { ...item, [field]: new_value } : item ): item
      );
    }
    if (field === "skills") {
      updated_items = $quiz_data.specifications_table.items.map((item, item_index) =>
        item_index === index && item.skill_index === skill_index
          ? { ...item, ["skill_content"]: new_value }
          : item
      );
    }


    quiz_data_store.set({
      ...$quiz_data, // Mantiene las propiedades existentes del estado
      specifications_table: {
        ...$quiz_data.specifications_table, // Mantiene las propiedades de specifications_table
        items: updated_items,
      },
    });

    set_editing_cell(null);
    if (field === "skills"){
      set_editing_skill_cell(null);
    }
  }

  function Calculate_Total_Questions(skill_content_list: string[]) {
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
    return result.length;
  }
 
  function Sanitize_Values(acc, item) {
    const value = Number(item.performed_classes);

    if (!Number.isInteger(value) || value < 0) {
      return " - "; // Retornar " - " si se encuentra un valor inválido
    }

    if (acc === " - ") {
      return acc;
    }

    return acc + value;
  }

  const total_classes = $quiz_data.specifications_table.items.reduce(Sanitize_Values, 0);
  
  const row_spans = Calculate_RowSpans($quiz_data.specifications_table.items);

  let thematic_area_rendered: { [key: string]: boolean } = {};
  let content_rendered: { [key: string]: boolean } = {};

  return (
    <table className="table mb-0 table-hover table-bordered caption-top">
      <caption>
        <div id="caption-container">
          <div id="table-subject">
            <input placeholder="Asignatura" />
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
          <th className="cell thead-input">
            <input className="text-center" type="text" placeholder="Habilidad" required />
          </th>
          <th className="cell thead-input">
            <input className="text-center" type="text" placeholder="Habilidad" required />
          </th>
          <th className="cell thead-input">
            <input className="text-center" type="text" placeholder="Habilidad" required />
          </th>
          <th>
            <div className="text-center">Total preguntas</div>
          </th>
        </tr>
      </thead>

      <tbody>
        {$quiz_data.specifications_table.items.map((item, index) => (
          <tr key={index}>
            {!thematic_area_rendered[item.thematic_area] && (
              <td
                className="td-input td-thematic_area"
                rowSpan={row_spans.thematic_area[item.thematic_area]}
                onClick={() => set_editing_cell({ index, field: "thematic_area" })}
              >
                {editing_cell?.index === index && editing_cell.field === "thematic_area" ? (
                  <textarea
                    defaultValue={item.thematic_area}
                    onBlur={(event) => Handle_Blur(event, index, "thematic_area")}
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
            {!content_rendered[item.content] && (
              <td
                className="td-input td-content"
                rowSpan={row_spans.content[item.content]}
                onClick={() => set_editing_cell({ index, field: "content" })}
              >
                {editing_cell?.index === index && editing_cell.field === "content" ? (
                  <textarea
                    defaultValue={item.content}
                    onBlur={(event) => Handle_Blur(event, index, "content")}
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
              {editing_cell?.index === index && editing_cell.field === "objective" ? (
                <textarea
                  defaultValue={item.objective}
                  onBlur={(event) => Handle_Blur(event, index, "objective")}
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
              {editing_cell?.index === index && editing_cell.field === "performed_classes" ? (
                <input
                  defaultValue={item.performed_classes}
                  onBlur={(event) => Handle_Blur(event, index, "performed_classes")}
                  onFocus={(event) =>
                    (event.currentTarget.selectionStart = event.currentTarget.value.length)
                  }
                  autoFocus
                />
              ) : (
                item.performed_classes
              )}
            </td>

            <td className="td-percentage text-center align-middle number-cell"> {
                total_classes === 0 ? " - " : (parseInt(item.performed_classes )/ total_classes * 100).toFixed(1) + " %"
              } </td>

            {$quiz_data.specifications_table.quiz_skills.map((_, skill_index) => (
              <td
                key={"skill-index-" + skill_index}
                className="td-input td-skill text-center align-middle"
                onClick={() => set_editing_skill_cell({ index, skill_index })}
              >
                {editing_skill_cell?.index === index &&
                editing_skill_cell.skill_index === skill_index ? (
                  <input
                    defaultValue={item.skill_index === skill_index ? item.skill_content : " - "}
                    onBlur={(event) => Handle_Blur(event, index, "skills", skill_index)}
                    onFocus={(event) =>
                      (event.currentTarget.selectionStart = event.currentTarget.value.length)
                    }
                    autoFocus
                  />
                ) : item.skill_index === skill_index ? (
                  item.skill_content
                ) : (
                  " - "
                )}
              </td>
            ))}

            <td className="td-total-questions text-center align-middle">
              {Calculate_Total_Questions([item.skill_content])}
            </td>

            {(thematic_area_rendered[item.thematic_area] = true)}
            {(content_rendered[item.content] = true)}
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr>
          <td colSpan={3} className="text-center">
            TOTAL
          </td>
          <td className="text-center number-cell">{total_classes}</td>
          <td className="text-center number-cell">100%</td>
          <td className="text-center number-cell item-total-skill">0</td>
          <td className="text-center number-cell item-total-skill">0</td>
          <td className="text-center number-cell item-total-skill">0</td>
          <td className="text-center number-cell item-total-skill" id="item-total-all-questions">
            0
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
