import { quiz_data_store, type Quiz, type RowSpan } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import "@styles/table_2.css";

export default function Specifications_Table() {
  const $quiz_data: Quiz = useStore(quiz_data_store);

  function Calculate_RowSpans(items: Quiz["specifications_table"]["items"]) {
    const row_spans: RowSpan = {
      thematic_area: {},
      content: {},
    };

    items.forEach((item) => {
      const { thematic_area, content } = item;

      // Contar las ocurrencias para thematic_area
      row_spans.thematic_area[thematic_area] = (row_spans.thematic_area[thematic_area] || 0) + 1;
      // Contar las ocurrencias para content
      row_spans.content[content] = (row_spans.content[content] || 0) + 1;
    });

    return row_spans;
  }

  function Handle_Input(event, index, field) {
    const old_value = $quiz_data.specifications_table.items[index][field];
    const newValue = prompt("Ingresa un nuevo valor:"); // Muestra un prompt para ingresar un nuevo valor

    if (newValue !== null) {
      // Crear una copia del objeto y actualizar el valor
      const updatedItems = $quiz_data.specifications_table.items.map(
        (item, idx) => (item[field] === old_value ? { ...item, [field]: newValue } : item) // Actualiza el ítem específico
      );

      quiz_data_store.set({
        ...$quiz_data, // Mantiene las propiedades existentes del estado
        specifications_table: {
          ...$quiz_data.specifications_table, // Mantiene las propiedades de specifications_table
          items: updatedItems,
        },
      });

      // Recalcula los row spans después de la actualización
      const newRowSpans = Calculate_RowSpans(updatedItems);

      // Aquí puedes hacer algo con los nuevos row spans si es necesario
      console.log(newRowSpans);
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
            {" "}
            Eje{" "}
          </th>
          <th id="thead-content" className="left-cell thead-fix-y-padding">
            {" "}
            Contenidos{" "}
          </th>
          <th id="thead-objective" className="left-cell thead-fix-y-padding">
            {" "}
            Objetivos{" "}
          </th>
          <th id="thead-classes" className="text-center thead-fix-y-padding">
            {" "}
            Clases{" "}
          </th>
          <th id="thead-percentage" className="text-center thead-fix-y-padding">
            {" "}
            %{" "}
          </th>
          <th
            className="cell thead-input"
            title="Ingresa una habilidad que quieras evaluar. Ej: Aplicación, Conocimiento, Análisis, etc."
          >
            <input className="text-center" type="text" placeholder="Habilidad" required />
          </th>
          <th
            className="cell thead-input"
            title="Ingresa una habilidad que quieras evaluar. Ej: Aplicación, Conocimiento, Análisis, etc."
          >
            <input className="text-center" type="text" placeholder="Habilidad" required />
          </th>
          <th
            className="cell thead-input"
            title="Ingresa una habilidad que quieras evaluar. Ej: Aplicación, Conocimiento, Análisis, etc."
          >
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
                onDoubleClick={(event) => Handle_Input(event, index, "thematic_area")}
              >
                {item.thematic_area}
              </td>
            )}
            {!content_rendered[item.content] && (
              <td
                className="td-input td-content"
                rowSpan={row_spans.content[item.content]}
                onDoubleClick={(event) => Handle_Input(event, index, "content")}
              >
                {item.content}
              </td>
            )}
            <td
              className="td-input td-objective"
              onDoubleClick={(event) => Handle_Input(event, index, "objective")}
            >
              {item.objective}
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
