

import { atom, computed } from "nanostores";
import type { BadgeMap, SpecTable } from "@content/types";


export const $specifications_table = atom<SpecTable>({
   total_questions: 0,
   quiz_skills: [],
   items: [],
});

export const $badge_map = computed($specifications_table, ($specifications_table) => {
    // Define the BadgeMap type
   const badge_map: BadgeMap = {
      thematic_area: [],
      content: [],
      objective: [],
      skill: [],
   };

   $specifications_table.items.forEach((item) => {
      if (item.thematic_area && !badge_map.thematic_area.includes(item.thematic_area)) {
         badge_map.thematic_area.push(item.thematic_area);
      }
      if (item.content && !badge_map.content.includes(item.content)) {
         badge_map.content.push(item.content);
      }
      if (item.objective && !badge_map.objective.includes(item.objective)) {
         badge_map.objective.push(item.objective);
      }
   });
    $specifications_table.quiz_skills.forEach((skill) => {
        if (skill && !badge_map.skill.includes(skill)) {
            badge_map.skill.push(skill);
        }
    });

   return badge_map;
});
