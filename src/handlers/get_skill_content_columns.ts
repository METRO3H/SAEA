import type { SpecTable } from "@content/types";
import { Get_Assigned_Questions } from "@handlers/get_assigned_questions";

export function Get_Skill_Content_Columns(column_index: number, items: SpecTable["items"]) {
   const column_list = items.map((item) => item.row_skills[column_index]).filter((item) => item !== "");

   const column_values: number[] = Get_Assigned_Questions(column_list);
   return column_values;
}
