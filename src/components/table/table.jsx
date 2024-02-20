import SpecialInputText from "../special_input_text.jsx";
import Table_Item from "./table_item.jsx";
import "../../styles/table.css";

function Custom_table({}) {
  return (
    <table className="table align-middle mb-0 bg-white table-hover table-bordered align-middle caption-top">
      <caption>
        <SpecialInputText input_label="Asignatura" input_width="20%" />
      </caption>
      <thead className="table-dark">
        <tr>
          <th id="thead-axis">Eje</th>
          <th id="thead-content">Contenidos</th>
          <th id="thead-objective">Objetivos</th>
          <th id="thead-classes" className="text-center">
            Clases
          </th>
          <th id="thead-percentage" className="text-center">
            %
          </th>
          <th
            className="cell thead-input"
            title="Ingresa una habilidad que quieras evaluar. Ej: Aplicación, Conocimiento, Análisis, etc."
          >
            <input
              className="text-white text-center"
              type="text"
              placeholder="Habilidad"
              required
            />
          </th>
          <th
            className="cell thead-input"
            title="Ingresa una habilidad que quieras evaluar. Ej: Aplicación, Conocimiento, Análisis, etc."
          >
            <input
              className="text-white text-center"
              type="text"
              placeholder="Habilidad"
              required
            />
          </th>
          <th
            className="cell thead-input"
            title="Ingresa una habilidad que quieras evaluar. Ej: Aplicación, Conocimiento, Análisis, etc."
          >
            <input
              className="text-white text-center"
              type="text"
              placeholder="Habilidad"
              required
            />
          </th>
          <th>
            <div className="text-center">Total preguntas</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {/*           <td rowSpan="5" className="cell" title="Ingrese un eje a evaluar. Ej: Números">
            <input type="text" placeholder="Ej: Geometría" required />
          </td> */}
          <Table_Item
            row_span={5}
            td_class="cell"
            item_title="Ingrese un eje a evaluar. Ej: Números"
            contains_input="true"
            input_placeholder="Ej: Geometría"
          />

          <Table_Item
            row_span={3}
            td_class="cell"
            item_title="Ingresa un contenido. Ej: Transformaciones isométricas"
            contains_input="true"
            input_placeholder="Ej: Figuras geométricas"
          />

          <Table_Item
            td_class="cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_class="text-center"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
          />
          <Table_Item
            td_class="cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center"
            input_placeholder="Ej: 2"
          />
          <Table_Item td_class="cell" item_title="Porcentaje de clases" />

          <Table_Item
            td_class="cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center"
            input_placeholder="-"
          />

          <Table_Item td_class="cell" item_title="Porcentaje de clases" />
        </tr>
        <tr>
          <td
            className="cell"
            title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
          >
            <input
              className="text-center"
              type="text"
              placeholder="Ej: Efectuar rotaciones y traslaciones"
              required
            />
          </td>
          <td
            className="cell"
            title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
          >
            <input className="text-center" type="text" placeholder="Ej: 2" required />
          </td>
          <td className="text-center">-</td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="text" placeholder="-" required />
          </td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="number" placeholder="-" required />
          </td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="text" placeholder="-" required />
          </td>

          <td className="text-center">-</td>
        </tr>
        <tr>
          <td
            className="cell"
            title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
          >
            <input
              className="text-center"
              type="text"
              placeholder="Ej: Efectuar rotaciones y traslaciones"
              required
            />
          </td>
          <td
            className="cell"
            title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
          >
            <input className="text-center" type="text" placeholder="Ej: 2" required />
          </td>
          <td className="text-center">-</td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="text" placeholder="-" required />
          </td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="number" placeholder="-" required />
          </td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="text" placeholder="-" required />
          </td>

          <td className="text-center">-</td>
        </tr>
        <tr>
          <td
            rowSpan="3"
            className="cell"
            title="Ingresa un contenido. Ej: Transformaciones isométricas"
          >
            <input type="text" placeholder="Ej: Figuras geométricas" required />
          </td>
          <td
            className="cell"
            title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
          >
            <input
              className="text-center"
              type="text"
              placeholder="Ej: Efectuar rotaciones y traslaciones"
              required
            />
          </td>
          <td
            className="cell"
            title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
          >
            <input className="text-center" type="text" placeholder="Ej: 2" required />
          </td>
          <td className="text-center">-</td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="text" placeholder="-" required />
          </td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="number" placeholder="-" required />
          </td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="text" placeholder="-" required />
          </td>

          <td className="text-center">-</td>
        </tr>
        <tr>
          <td
            className="cell"
            title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
          >
            <input
              className="text-center"
              type="text"
              placeholder="Ej: Efectuar rotaciones y traslaciones"
              required
            />
          </td>
          <td
            className="cell"
            title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
          >
            <input className="text-center" type="text" placeholder="Ej: 2" required />
          </td>
          <td className="text-center">-</td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="text" placeholder="-" required />
          </td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="number" placeholder="-" required />
          </td>
          <td className="cell" title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3">
            <input className="text-center" type="text" placeholder="-" required />
          </td>

          <td className="text-center">-</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" className="text-center">
            TOTAL
          </td>
          <td className="text-center">-</td>
          <td className="text-center">100</td>
          <td className="text-center">-</td>
          <td className="text-center">-</td>
          <td className="text-center">-</td>
          <td className="text-center">-</td>
        </tr>
      </tfoot>
    </table>
  );
}
export default Custom_table;
