

import { atom, computed } from "nanostores";
import type { QuizResult } from "@content/types";


export const $quiz_results = atom<QuizResult[]>([]);

