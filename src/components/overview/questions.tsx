import { useStore } from "@nanostores/react";
import { $quiz_results_all } from "@content/shared/quiz_data";
import { useState, useMemo } from "react";
import "@styles/overview_questions.css";

type SortField = "question_position" | "percentage";
type SortDirection = "asc" | "desc";

export default function Questions() {
   const quizResultsAll = useStore($quiz_results_all);

   const [orderConfig, setOrderConfig] = useState<{
      field: SortField;
      direction: SortDirection;
   }>({
      field: "question_position",
      direction: "asc",
   });

   function handleSort(field: SortField) {
      setOrderConfig((prev) => {
         if (prev.field === field) {
            return {
               field,
               direction: prev.direction === "asc" ? "desc" : "asc",
            };
         }

         return {
            field,
            direction: field === "percentage" ? "desc" : "asc",
         };
      });
   }

   function getSortIcon(field: SortField) {
      if (orderConfig.field !== field) {
         return "fas fa-sort";
      }

      return orderConfig.direction === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
   }

   function getThClass(field?: SortField) {
      return [
         "fw-bold text-center fs-6",
         field ? "th-sort" : "",
         field && orderConfig.field === field ? "th-sort-active" : "",
      ]
         .filter(Boolean)
         .join(" ");
   }

   const items = useMemo(() => {
      return [...quizResultsAll].sort((a, b) => {
         const factor = orderConfig.direction === "asc" ? 1 : -1;
         return (a[orderConfig.field] - b[orderConfig.field]) * factor;
      });
   }, [quizResultsAll, orderConfig]);

   return (
      <table className="table table-hover">
         <thead>
            <tr>
               {/* POSICIÓN */}
               <th className={getThClass("question_position")} onClick={() => handleSort("question_position")}>
                  <span># </span>
                  <i className={getSortIcon("question_position")} />
               </th>

               {/* PREGUNTA (sin sort) */}
               <th className="fw-bold fs-6">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="lucide lucide-circle-help"
                  >
                     <circle cx="12" cy="12" r="10" />
                     <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                     <path d="M12 17h.01" />
                  </svg>
                  <span> Pregunta</span>
               </th>

               {/* RENDIMIENTO */}
               <th className="text-center fw-bold fs-6">
                  <i className="fas fa-chart-pie" />
                  <span> Rendimiento</span>
               </th>

               {/* PORCENTAJE */}
               <th className={getThClass("percentage")} onClick={() => handleSort("percentage")}>
                  <span>% </span>
                  <i className={getSortIcon("percentage")} />
               </th>
            </tr>
         </thead>

         <tbody className="table-group-divider">
            {items.map((questionItem) => {
               const percentage = questionItem.percentage;

               let tr_result = "";
               if (percentage >= 80) tr_result = "table-success";
               else if (percentage >= 50) tr_result = "table-warning";
               else tr_result = "table-danger";

               return (
                  <tr key={questionItem.question} className={tr_result}>
                     <td className="text-center">{questionItem.question_position}</td>

                     <td>{questionItem.question}</td>

                     <td className="text-center fs-6">{questionItem.performance}</td>

                     <td className="text-center fs-6">{questionItem.percentage}%</td>
                  </tr>
               );
            })}
         </tbody>
      </table>
   );
}
