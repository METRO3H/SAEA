import { quiz_data_store, type Quiz} from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import Special_Input_Text from "../special_input_text.tsx";


export default function Quiz_Title({}) {
  const $quiz_data: Quiz = useStore(quiz_data_store);

  function Handle_Blur(event) {
    const old_value = $quiz_data.quiz_title;
    const new_value = event.target.value.trim() || " - ";

    if (new_value === old_value) return;

    quiz_data_store.set({
      ...$quiz_data,
      quiz_title: new_value,
    });
  }

  console.log($quiz_data.quiz_title)

  return (
    <>
      <Special_Input_Text
        input_label="Título del cuestionario"
        input_value={$quiz_data.quiz_title}
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
