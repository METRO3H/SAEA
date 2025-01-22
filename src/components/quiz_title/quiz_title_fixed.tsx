import { $quiz_title } from "@content/shared/quiz_data.ts";
import Special_Input_Text from "../special_input_text.tsx";
import { useStore } from "@nanostores/react";

export default function Quiz_Title({}) {
  const $quiz_title_store: string = useStore($quiz_title);
  console.log($quiz_title_store);
  return (
    <>
      <Special_Input_Text
        input_label="Título del cuestionario"
        fixed_value={$quiz_title_store}
        label_class="fw-bold"
        bar_thickness="4px"
        input_width="45%"
        input_font_size="31px"
        input_no_focus_color="var(--main-color-blue)"
        input_class="fw-bold"
        input_icon_class="fas fa-book"
      />
    </>
  );
}
