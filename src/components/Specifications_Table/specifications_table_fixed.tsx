import { quiz_data_store, type Quiz, type RowSpan } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import "@styles/table_2.css";

export default function Specifications_Table() {
  const $quiz_data: Quiz = useStore(quiz_data_store);

  const total_classes = $quiz_data.specifications_table.items.reduce(Sanitize_Values, 0);
  const total_question_count = $quiz_data.specifications_table.total_questions;
  let thematic_area_rendered: { [key: string]: boolean } = {};
  let content_rendered: { [key: string]: boolean } = {};

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

  function Sanitize_Values(acc, item) {
    const value = Number(item.performed_classes);

    if (!Number.isInteger(value) || value < 0) {
      return "";
    }

    if (acc === "") {
      return acc;
    }

    return acc + value;
  }
  function Get_Skill_Content_Columns(column_index: number) {
    const column_list = $quiz_data.specifications_table.items
      .filter((item) => item.skill_index === column_index)
      .map((item) => item.skill_content);

    const column_values: number[] = Get_Skill_Content_Values(column_list);

    return column_values;
  }

  function Process_Table_Items(items, total_classes, total_question_count) {
    return items.map((item) => {
      const classes_relation =
        !isNaN(item.performed_classes) && !isNaN(total_classes)
          ? item.performed_classes / total_classes
          : 0;

      let classes_percentage: any = classes_relation * 100;
      classes_percentage = Number.isInteger(classes_percentage)
        ? parseInt(classes_percentage)
        : classes_percentage.toFixed(1);

      classes_percentage = total_classes === 0 ? " - " : classes_percentage + "%";

      const item_question_count: number = Get_Skill_Content_Values([item.skill_content]).length;

      const expected_item_question_count: number =
        total_question_count > 0 && classes_relation > 0
          ? Math.round(total_question_count * classes_relation)
          : 0;

      const success_item_question_count =
        item_question_count === expected_item_question_count
          ? " td-total-questions-successful"
          : "";

      return {
        ...item,
        classes_relation,
        classes_percentage,
        item_question_count,
        expected_item_question_count,
        success_item_question_count,
      };
    });
  }

  const row_spans = Calculate_RowSpans($quiz_data.specifications_table.items);

  const processed_table_items = Process_Table_Items(
    $quiz_data.specifications_table.items,
    total_classes,
    total_question_count
  );

  // console.log($quiz_data);
  return (
    <table className="table table-bordered caption-top">
      <caption>
        <div id="caption-container">
          <div id="table-subject">{$quiz_data.quiz_subject}</div>
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

          {$quiz_data.specifications_table.quiz_skills.map((item, skill_index) => (
            <th key={"skill-index-" + skill_index} className="cell thead-input">
              {item}
            </th>
          ))}
          <th>
            <div className="text-center">Total preguntas</div>
          </th>
        </tr>
      </thead>

      <tbody>
        {processed_table_items.map((processed_item, index) => (
          <tr key={index}>
            {!thematic_area_rendered[processed_item.thematic_area] && (
              <td
                className="td-input td-thematic_area"
                rowSpan={row_spans.thematic_area[processed_item.thematic_area]}
              >
                {processed_item.thematic_area}
              </td>
            )}
            {!content_rendered[processed_item.content] && (
              <td
                className="td-input td-content"
                rowSpan={row_spans.content[processed_item.content]}
              >
                {processed_item.content}
              </td>
            )}
            <td className="td-input td-objective">{processed_item.objective}</td>
            <td className="td-input td-performed-classes text-center align-middle">
              {processed_item.performed_classes}
            </td>
            <td className="td-percentage text-center align-middle number-cell">
              {processed_item.classes_percentage}
            </td>
            {$quiz_data.specifications_table.quiz_skills.map((_, skill_index) => (
              <td
                key={"skill-index-" + skill_index}
                className="td-input td-skill text-center align-middle"
              >
                <span>
                  {processed_item.skill_index === skill_index
                    ? processed_item.skill_content
                    : " - "}
                </span>
              </td>
            ))}
            <td
              className={
                "td-total-questions text-center align-middle" +
                processed_item.success_item_question_count
              }
            >
              {processed_item.item_question_count +
                "/" +
                processed_item.expected_item_question_count}
            </td>
            {(thematic_area_rendered[processed_item.thematic_area] = true)}
            {(content_rendered[processed_item.content] = true)}
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
          {$quiz_data.specifications_table.quiz_skills.map((_, skill_index) => (
            <td key={"foot-skill-index-" + skill_index} className="text-center number-cell">
              {Get_Skill_Content_Columns(skill_index).length}
            </td>
          ))}
          <td className="td-input text-center number-cell" id="item-total-all-questions">
            {total_question_count}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
