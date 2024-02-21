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
          <Table_Item
            row_span={5}
            td_class="cell left-cell"
            item_title="Ingrese un eje a evaluar. Ej: Números"
            contains_input="true"
            input_placeholder="Ej: Geometría"
          />

          <Table_Item
            row_span={3}
            td_class="cell left-cell"
            item_title="Ingresa un contenido. Ej: Transformaciones isométricas"
            contains_input="true"
            input_placeholder="Ej: Figuras geométricas"
          />

          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="Ej: 2"
          />
          <Table_Item
            td_class="cell text-center number-cell patron-cell"
            item_title="Porcentaje de clases"
          />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
        <tr>
          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="Ej: 2"
          />
          <Table_Item td_class="cell text-center number-cell patron-cell" item_title="Porcentaje de clases" />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
        <tr>
          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="Ej: 2"
          />
          <Table_Item td_class="cell text-center number-cell patron-cell" item_title="Porcentaje de clases" />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
        <tr>
          <Table_Item
            row_span={2}
            td_class="cell left-cell"
            item_title="Ingresa un contenido. Ej: Transformaciones isométricas"
            contains_input="true"
            input_placeholder="Ej: Figuras geométricas"
          />

          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="Ej: 2"
          />
          <Table_Item td_class="cell text-center number-cell patron-cell" item_title="Porcentaje de clases" />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
        <tr>
          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="Ej: 2"
          />
          <Table_Item td_class="cell text-center number-cell" item_title="Porcentaje de clases" />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendra este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" className="text-center">
            TOTAL
          </td>
          <td className="text-center number-cell">-</td>
          <td className="text-center number-cell">100%</td>
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
