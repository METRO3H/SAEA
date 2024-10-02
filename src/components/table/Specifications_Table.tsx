import { quiz_data_store, type Quiz, type RowSpan } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import React, { useState } from "react";
import "@styles/table_2.css";

export default function Specifications_Table() {
  const $quiz_data: Quiz = useStore(quiz_data_store);
  const [editingCell, setEditingCell] = useState<{ index: number; field: string } | null>(null);

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

  function Handle_Blur(event: React.FocusEvent<HTMLTextAreaElement>, index: number, field: string) {
    const old_value = $quiz_data.specifications_table.items[index][field];
    const newValue = event.target.value;

    if (newValue !== null) {
      // Crear una copia del objeto y actualizar el valor
      const updatedItems = $quiz_data.specifications_table.items.map((item) =>
        item[field] === old_value ? { ...item, [field]: newValue } : item
      );

      quiz_data_store.set({
        ...$quiz_data, // Mantiene las propiedades existentes del estado
        specifications_table: {
          ...$quiz_data.specifications_table, // Mantiene las propiedades de specifications_table
          items: updatedItems,
        },
      });

      setEditingCell(null);
    }
  }
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
                onDoubleClick={() => setEditingCell({ index, field: "thematic_area" })}
              >
                {editingCell?.index === index && editingCell.field === "thematic_area" ? (
                  <textarea
                    defaultValue={item.thematic_area}
                    onBlurCapture={(event) => Handle_Blur(event, index, "thematic_area")}
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
                onDoubleClick={() => setEditingCell({ index, field: "content" })}
              >
                {editingCell?.index === index && editingCell.field === "content" ? (
                  <textarea
                    defaultValue={item.content}
                    onBlur={(event) => Handle_Blur(event, index, "content")}
                    autoFocus
                  />
                ) : (
                  item.content
                )}
              </td>
            )}
            <td
              className="td-input td-objective"
              onDoubleClick={() => setEditingCell({ index, field: "objective" })}
            >
              {editingCell?.index === index && editingCell.field === "objective" ? (
                <textarea
                  defaultValue={item.objective}
                  onBlur={(event) => Handle_Blur(event, index, "objective")}
                  autoFocus
                />
              ) : (
                item.objective
              )}
            </td>
            <td> - </td>
            <td> - </td>
            <td> - </td>
            <td> - </td>
            <td> - </td>
            <td> - </td>

            {(thematic_area_rendered[item.thematic_area] = true)}
            {(content_rendered[item.content] = true)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
