
export default function Fix_Answers_Format(questions: any[]) {
    return questions.map((question: any) => {
        const answers: string[] = [];
        for (let i = 1; i < Object.keys(question.answers).length + 1; i++) {
           answers.push(question.answers[i]);
        }
        question.answers = answers;
  
        return question;
     });
}