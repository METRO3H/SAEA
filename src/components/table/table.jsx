import { useEffect } from "react";
import Table_Item from "./table_item.jsx";
import "@styles/table.css";

function Custom_table() {
  function Handle_Class_Item_Change() {
    let inputs_sum = 0;
    const ALL_INPUTS = document.querySelectorAll(".item-class");

    ALL_INPUTS.forEach((input) => {
      const INPUT_VALUE = parseInt(input.value, 10);
      inputs_sum += isNaN(INPUT_VALUE) ? 0 : INPUT_VALUE;
    });
    document.querySelector("#item-total-class").textContent = inputs_sum;

    ALL_INPUTS.forEach((input) => {
      const INPUT_VALUE = parseInt(input.value, 10);
      const ITEM_PERCENTAGE = input.closest("tr").querySelector(".item-percentage");
      const ITEM_PERCENTAGE_VALUE = parseFloat(((INPUT_VALUE / inputs_sum) * 100).toFixed(1));
      ITEM_PERCENTAGE.textContent = isNaN(INPUT_VALUE) ? "-" : `${ITEM_PERCENTAGE_VALUE}%`;
    });
    Handle_Item_Total_All_questions_Change();

    return;
  }
  function Handle_Skill_Item_Change(event) {
    event.target.value = event.target.value.replace(/[^0-9,\-]/g, "");
    const tr_element = event.target.closest("tr");
    const item_skill_elements = tr_element.querySelectorAll(".item-skill");

    let index = Array.prototype.indexOf.call(item_skill_elements, event.target);

    const ALL_tr_elements = document.querySelectorAll("tbody tr");
    let skill_sum = 0;
    ALL_tr_elements.forEach((tr) => {
      const item_skill_value = parseInt(tr.querySelectorAll(".item-skill")[index].value, 10);
      skill_sum += isNaN(item_skill_value) ? 0 : item_skill_value;
    });

    document.querySelectorAll(".item-total-skill")[index].textContent = skill_sum;
    return;
  }

  function Handle_Item_Total_All_questions_Change() {
    const item_total_all_questions_input = document.querySelector(
      "#item-total-all-questions"
    ).firstElementChild;
    const ALL_tr_elements = document.querySelectorAll("tbody tr");
    ALL_tr_elements.forEach((tr) => {
      const percentage = parseFloat(tr.querySelector(".item-percentage").textContent);
      const total_questions = parseFloat(item_total_all_questions_input.value);
      const number_of_questions = Math.round((total_questions * percentage) / 100);
      tr.querySelector(".item-total-question").textContent = isNaN(number_of_questions)
        ? 0
        : number_of_questions;
    });
    return;
  }
  useEffect(() => {
    Handle_Item_Total_All_questions_Change();
    Handle_Class_Item_Change();
  }, []);
  return (
    <table className="table align-middle mb-0 bg-white table-hover table-bordered align-middle caption-top">
      <caption>
        <div id="caption-container">
          <div id="table-subject">
            <input placeholder="Asignatura"></input>
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
            row_span={3}
            td_class="cell left-cell"
            item_title="Ingrese un eje a evaluar. Ej: Números"
            contains_input="true"
            input_placeholder="Ej: Geometría"
            input_class="item-thematic-area"
          />

          <Table_Item
            row_span={1}
            td_class="cell left-cell"
            item_title="Ingresa un contenido. Ej: Transformaciones isométricas"
            contains_input="true"
            input_placeholder="Ej: Figuras geométricas"
            input_class="item-content"
          />

          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
            input_class="item-objetive"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell item-class"
            input_placeholder="Ej: 2"
            Handle_Input_Change={() => Handle_Class_Item_Change()}
          />
          <Table_Item
            td_class="cell text-center number-cell patron-cell item-percentage"
            item_title="Porcentaje de clases"
          />

          <Table_Item
            td_class="cell patron-cell "
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell item-total-question"
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
            input_class="item-content"
          />

          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
            input_class="item-objetive"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell item-class"
            input_placeholder="Ej: 2"
            Handle_Input_Change={() => Handle_Class_Item_Change()}
          />
          <Table_Item
            td_class="cell text-center number-cell patron-cell item-percentage"
            item_title="Porcentaje de clases"
          />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell item-total-question"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
        <tr>
          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
            input_class="item-objetive"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell item-class"
            input_placeholder="Ej: 2"
            Handle_Input_Change={() => Handle_Class_Item_Change()}
          />
          <Table_Item
            td_class="cell text-center number-cell patron-cell item-percentage"
            item_title="Porcentaje de clases"
          />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell item-total-question"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
        <tr>
          <Table_Item
            row_span={2}
            td_class="cell left-cell"
            item_title="Ingrese un eje a evaluar. Ej: Números"
            contains_input="true"
            input_placeholder="Ej: Geometría"
            input_class="item-thematic-area"
          />

          <Table_Item
            row_span={1}
            td_class="cell left-cell"
            item_title="Ingresa un contenido. Ej: Transformaciones isométricas"
            contains_input="true"
            input_placeholder="Ej: Figuras geométricas"
            input_class="item-content"
          />

          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
            input_class="item-objetive"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell item-class"
            input_placeholder="Ej: 2"
            Handle_Input_Change={() => Handle_Class_Item_Change()}
          />
          <Table_Item
            td_class="cell text-center number-cell patron-cell item-percentage"
            item_title="Porcentaje de clases"
          />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell item-total-question"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
        <tr>
          <Table_Item
            row_span={1}
            td_class="cell left-cell"
            item_title="Ingresa un contenido. Ej: Transformaciones isométricas"
            contains_input="true"
            input_placeholder="Ej: Figuras geométricas"
            input_class="item-content"
          />

          <Table_Item
            td_class="cell left-cell patron-cell"
            item_title="Ingresa un objetivo. Ej: Componer rotaciones, traslaciones y reflexiones en el plano cartesiano"
            contains_input="true"
            input_placeholder="Ej: Efectuar rotaciones y traslaciones"
            input_class="item-objetive"
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de clases realizadas con respecto a este contenido. Ej: 4"
            contains_input="true"
            input_class="text-center number-cell item-class"
            input_placeholder="Ej: 2"
            Handle_Input_Change={() => Handle_Class_Item_Change()}
          />
          <Table_Item
            td_class="cell text-center number-cell patron-cell item-percentage"
            item_title="Porcentaje de clases"
          />

          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />
          <Table_Item
            td_class="cell patron-cell"
            item_title="Ingresa la cantidad de preguntas que tendrá este item. Ej: 3"
            contains_input="true"
            input_class="text-center number-cell item-skill"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Skill_Item_Change(event)}
          />

          <Table_Item
            td_class="cell text-center number-cell patron-cell item-total-question"
            item_title="Cantidad de preguntas de este item"
          />
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="3" className="text-center">
            TOTAL
          </td>
          <td className="text-center number-cell" id="item-total-class">
            0
          </td>
          <td className="text-center number-cell">100%</td>
          <td className="text-center number-cell item-total-skill">0</td>
          <td className="text-center number-cell item-total-skill">0</td>
          <td className="text-center number-cell item-total-skill">0</td>
          <Table_Item
            td_id="item-total-all-questions"
            td_class="cell number-cell"
            item_title="Total de preguntas"
            contains_input="true"
            input_class="text-center number-cell"
            input_placeholder="-"
            Handle_Input_Change={(event) => Handle_Item_Total_All_questions_Change()}
          />
        </tr>
      </tfoot>
    </table>
  );
}
export default Custom_table;
