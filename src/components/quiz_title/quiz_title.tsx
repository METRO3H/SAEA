import { $quiz_title } from "@content/shared/quiz_data.ts";
import { Update_Quiz_Title } from "@content/shared/update_state.ts";
import { useStore } from "@nanostores/react";
import Special_Input_Text from "../special_input_text.tsx";

export default function Quiz_Title({}) {
   const $quiz_title_store: string = useStore($quiz_title);

   function Handle_Blur(event) {
      const new_value = event.target.value.trim();
      const old_value = $quiz_title_store;

      if (new_value === old_value) return;

      Update_Quiz_Title(new_value);
   }

   return (
      <>
         <Special_Input_Text
            input_label="Título del cuestionario"
            input_value={$quiz_title_store}
            label_class="fw-bold"
            bar_thickness="4px"
            input_width="45%"
            input_font_size="31px"
            input_no_focus_color="var(--main-color-blue)"
            input_class="fw-bold"
            input_icon_class="fas fa-book"
            events={{
               onBlur: Handle_Blur,
            }}
         />
      </>
   );
}
