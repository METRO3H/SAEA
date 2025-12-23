import { atom, computed } from "nanostores";
import type { Quiz, StudentResult } from "@content/types";

export const $quiz_store = atom<Quiz>({
   quiz_id: "",
   google_form_url: "",
   quiz_title: "",
   quiz_subject: "",
   creation_date: "",
   specifications_table: {
      total_questions: 0,
      quiz_skills: ["", "", ""],
      items: [
         {
            thematic_area: "",
            content: "",
            objective: "",
            performed_classes: 0,
            row_skills: [],
            row_position: 0,
         },
         {
            thematic_area: "",
            content: "",
            objective: "",
            performed_classes: 0,
            row_skills: [],
            row_position: 1,
         },
         {
            thematic_area: "",
            content: "",
            objective: "",
            performed_classes: 0,
            row_skills: [],
            row_position: 2,
         },
         {
            thematic_area: "",
            content: "",
            objective: "",
            performed_classes: 0,
            row_skills: [],
            row_position: 3,
         },
      ],
   },
   questions: [],
});

export const $quiz_results_store = atom<StudentResult[]>([]);

export const $update_spect_flag = atom(false);

export const $quiz_id = computed($quiz_store, ($quiz_store) => $quiz_store.quiz_id);
export const $quiz_google_form_url = computed($quiz_store, ($quiz_store) => $quiz_store.google_form_url);
export const $quiz_title = computed($quiz_store, ($quiz_store) => $quiz_store.quiz_title);
export const $quiz_subject = computed($quiz_store, ($quiz_store) => $quiz_store.quiz_subject);
export const $quiz_creation_date = computed($quiz_store, ($quiz_store) => $quiz_store.creation_date);
export const $specifications_table = computed($quiz_store, ($quiz_store) => $quiz_store.specifications_table);
export const $questions = computed($quiz_store, ($quiz_store) => $quiz_store.questions);


export const $quiz_results_all = computed([$quiz_store, $quiz_results_store],
    ($quiz_store, $quiz_results_store) => {

         const student_result_map = new Map<number, number>();
   $quiz_results_store.forEach((result) => {
      result.results.forEach((res) => {
         const question_student_result = res.is_correct ? (student_result_map.get(res.question_position) || 0) + 1 : 0;

         student_result_map.set(res.question_position, question_student_result);
      });
   });

   const questions_performance = $quiz_store.questions.map((questionItem, index) => {
      const question_result = student_result_map.get(questionItem.question_position) || 0;
      const performance = (question_result * 100) / $quiz_results_store.length;
      const percentage = Math.round(performance * 10) / 10;
      return {
         question_position: questionItem.question_position,
         question: questionItem.question,
         performance: question_result + " / " + $quiz_results_store.length,
         percentage: percentage || 0,
      };
   });

   return questions_performance;
    });