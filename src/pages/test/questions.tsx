import type { Quiz } from "@content/quiz_data";
import { quiz_data_store } from "@content/quiz_data";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

export default function Questions() {
  const $quiz_data: Quiz = useStore(quiz_data_store);

  useEffect(() => {}, []);

  return (
    <div>
      <pre>{JSON.stringify($quiz_data, null, 2)}</pre>
    </div>
  );
}
