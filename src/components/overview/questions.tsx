import { useStore } from "@nanostores/react";
import { $quiz_store, $quiz_results_store } from "@content/shared/quiz_data";

export default function questions() {
   const quiz = useStore($quiz_store);
   const quiz_results = useStore($quiz_results_store);

   const student_result_map = new Map<number, number>();
   quiz_results.forEach((result) => {
      result.results.forEach((res) => {
         const question_student_result = res.is_correct ? (student_result_map.get(res.question_position) || 0) + 1 : 0;

         student_result_map.set(res.question_position, question_student_result);
      });
   });

   const questions_performance = quiz.questions.map((questionItem, index) => {
      const question_result = student_result_map.get(questionItem.question_position) || 0;
      const performance = (question_result * 100) / quiz_results.length;
      return {
         question: questionItem.question,
         performance: question_result + " / " + quiz_results.length,
         percentage: Math.round(performance * 10) / 10,
      };
   });

   const questions_performance_sorted = questions_performance.sort((a, b) => b.percentage - a.percentage);

   console.log(questions_performance);
   return (
      <table className="table table-hover">
         <thead>
            <tr>
               <th className="fw-bold fs-6">Pregunta</th>
               <th className="text-center fw-bold fs-6">Rendimiento</th>
               <th className="text-center fw-bold fs-6">%</th>
            </tr>
         </thead>
         <tbody id="question-results" className="table-group-divider">
            {questions_performance_sorted.map((questionItem) => (
               <tr key={questionItem.question}>
                  <td>{questionItem.question}</td>
                  <td className="text-center fs-6" style={{fontFamily: "sans-serif"}}>{questionItem.performance}</td>
                  <td className="text-center fs-6" style={{fontFamily: "sans-serif"}}>{questionItem.percentage}%</td>
               </tr>
            ))}
         </tbody>
      </table>
   );
}
