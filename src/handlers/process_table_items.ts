
import type { SpecTable, RowSpan, RowsRequirement} from "@content/types";
import { Get_Assigned_Questions } from "@handlers/get_assigned_questions";

export function Process_Table_Items(items: SpecTable["items"], total_classes: number, total_question_count: number) {
    const thematic_area_seen = new Set();
    const content_seen = new Set();

    const rows_requirement: RowsRequirement[] = [];

    const row_spans: RowSpan = {
       thematic_area: {},
       content: {},
    };

    const processed_items = items.map((item) => {
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

       rows_requirement.push({
          real_value: item_question_count,
          expected_value: expected_item_question_count,
       });

       row_spans.thematic_area[item.thematic_area] = (row_spans.thematic_area[item.thematic_area] || 0) + 1;
       row_spans.content[item.content] = (row_spans.content[item.content] || 0) + 1;

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

    return { processed_items, row_spans, rows_requirement };
 }