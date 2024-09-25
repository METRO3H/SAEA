import type { Quiz } from "@content/quiz_data";
import { quiz_data_store } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

export default function Table() {
  const $quiz_data: Quiz = useStore(quiz_data_store);

  useEffect(() => {}, []);

  return (
    <div>
      TABLE
    </div>
  );
}
