// Calculate the average grade
export function Average_Grade(grade_distribution: number[]): number {
   if (grade_distribution.length === 0) return 0;
   return grade_distribution.reduce((acc, curr) => acc + curr, 0) / grade_distribution.length;
}

// Calculate the median grade
export function Median_Grade(grade_distribution: number[]): number {
   if (grade_distribution.length === 0) return 0;

   const middle = Math.floor(grade_distribution.length / 2);

   return grade_distribution.length % 2 === 0
      ? (grade_distribution[middle - 1] + grade_distribution[middle]) / 2
      : grade_distribution[middle];
}

// Calculate the mode grade
export function Mode_Grade(grade_distribution: number[]): number[] {
   if (grade_distribution.length === 0) return [];

   const frequency_map = Get_Grade_Frequency_Map(grade_distribution);
   const maxCount = Math.max(...Object.values(frequency_map));

   return Object.entries(frequency_map)
      .filter(([_, count]) => count === maxCount)
      .map(([grade]) => Number(grade));
}

// Calculate the pass rate
export function Pass_Rate(grade_distribution: number[], pass_threshold = 4.0): number {
   if (grade_distribution.length === 0) return 0;

   const passing_count = grade_distribution.filter((grade) => grade >= pass_threshold).length;
   return passing_count / grade_distribution.length;
}

// Calculate the fail rate
export function Fail_Rate(grade_distribution: number[], pass_threshold = 4.0): number {
   return 1 - Pass_Rate(grade_distribution, pass_threshold);
}

export function Get_Grade_Distribution(student_results) {
   const grade_distribution = student_results.map((result) =>
      result.results.reduce((acc, curr) => (curr.response_answer_index === curr.correct_answer_index ? acc + 1 : acc), 0)
   );
   return grade_distribution.sort((a, b) => a - b);
}

export function Get_Grade_Frequency_Map(grade_distribution): Record<number, number> {
   const frequency_map: any = grade_distribution.reduce((acc, grade) => {
      acc[grade] = (acc[grade] ?? 0) + 1;
      return acc;
   }, {});

   return frequency_map;
}
