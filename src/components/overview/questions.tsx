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
    setOrderConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }

  function getSortIcon(field: SortField) {
    if (orderConfig.field !== field) {
      return "fas fa-sort";
    }

    return orderConfig.direction === "asc"
      ? "fas fa-sort-up"
      : "fas fa-sort-down";
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
          <th
            className="text-center fw-bold th-sort"
            onClick={() => handleSort("question_position")}
          >
            <span># </span>
            <i className={getSortIcon("question_position")} />
          </th>

          <th className="fw-bold fs-6">Pregunta</th>

          <th className="text-center fw-bold fs-6">Rendimiento</th>

          <th
            className="text-center fw-bold fs-6 th-sort"
            onClick={() => handleSort("percentage")}
          >
            <span>% </span>
            <i className={getSortIcon("percentage")} />
          </th>
        </tr>
      </thead>

      <tbody id="question-results" className="table-group-divider">
        {items.map((questionItem) => (
          <tr key={questionItem.question}>
            <td className="text-center">
              {questionItem.question_position}
            </td>

            <td>{questionItem.question}</td>

            <td
              className="text-center fs-6"
              style={{ fontFamily: "sans-serif" }}
            >
              {questionItem.performance}
            </td>

            <td
              className="text-center fs-6"
              style={{ fontFamily: "sans-serif" }}
            >
              {questionItem.percentage}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
