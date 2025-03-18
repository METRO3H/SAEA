export interface Quiz {
   quiz_id: string;
   google_form_url: string;
   quiz_title: string;
   quiz_subject: string;
   creation_date: string;
   specifications_table: SpecTable;
   questions: QuestionItem[];
}

export interface Quiz2Generate {
   quiz_id: string;
   quiz_title: string;
   questions: QuestionItem2Generate[];
}

export interface SpecTable {
   total_questions: number;
   quiz_skills: string[];
   items: SpecTableItem[];
}

export interface SpecTableItem {
   thematic_area: string;
   content: string;
   objective: string;
   performed_classes: number;
   row_skills: string[];
   row_position: number;
}

export interface RowSpan {
   thematic_area: { [key: string]: number };
   content: { [key: string]: number };
}
export interface QuestionItem {
   question: string;
   answers: string[];
   correct_answer_index: number;
}

export interface QuestionItem2Generate extends QuestionItem {
   question_position: number;
}

export interface DraftListType {
   uuid: number;
   title: string;
   subject: string;
   creation_date: Date;
}

export interface PerformedListType {
   google_form_id: string;
   title: string;
   subject: string;
   google_form_url: string;
   creation_date: string;
}

export interface QuizzesList {
   draft: DraftListType[];
   performed: PerformedListType[];
}

export interface QuizListLengthType {
   draft: number;
   performed: number;
}

export interface RowsRequirement {
   real_value: number;
   expected_value: number;
}

export interface EditSkillCell {
   index: number;
   skill_index: number;
}

export interface EditCell {
   index: number;
   field: string;
}

export interface ProcessedItem extends SpecTableItem {
   render_thematic_area: boolean;
   render_content: boolean;
   classes_relation: number;
   classes_percentage: any;
   item_question_count: number;
   expected_item_question_count: number;
   success_item_question_count: string;
}

export interface Metadata {
   thematic_area: string;
   content: string;
   objective: string;
   skill: string;
}

export interface QuestionContentItem {
   question_content_item_number: number;
   add_class: string;
   Update_Question_Item: any;
   question_item_index: number;
   data: QuestionItem;
   metadata: Metadata;
}

export interface Quizzes {
   draft: {
      quiz_id: string;
      title: string;
      subject: string;
      creation_date: string;
   }[];
   performed: object[];
}

export interface ProfileData {
   name: string;
   last_name: string;
   email: string;
}

export interface AnswerResult {
   question_position: number;
   answer_value: string;
}

export interface QuizResult {
   email: string;
   results: {
      question_position: number;
      correct_answer_index: number;
      response_answer_index: number;
   }[];
}
