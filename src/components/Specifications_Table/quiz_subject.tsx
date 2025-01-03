import { useStore } from "@nanostores/react";
import { $quiz_subject } from "@content/shared/quiz_data";
import { Update_Quiz_Subject } from "@content/shared/update_state";
export default function Quiz_Subject() {
   const $quiz_subject_store = useStore($quiz_subject);

   function Handle_Fixed_Field_Change(value: string) {
      const new_value: string = value ? (value.length < 50 ? value : value.slice(0, 50)) : "";
      Update_Quiz_Subject(new_value);
   }
   return (
      <input
         placeholder="Asignatura"
         defaultValue={$quiz_subject_store}
         onBlur={(event) => Handle_Fixed_Field_Change(event.target.value.trim())}
      />
   );
}
