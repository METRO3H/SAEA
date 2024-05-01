export default class Query {
  Insert = {};
  Get = {};
  constructor(db) {
    this.prepare(db);
    return;
  }
  prepare(db) {
    this.Insert = {
      test: db.prepare(/*sql*/ `
        INSERT OR IGNORE INTO test (unique_id, title, subject_id, created_by, creation_date) 
        VALUES (?, ?, ?, ?, ?);
        `),
      subject: db.prepare(this.Frequent_Insertion("subject")),
      question: db.prepare(this.Frequent_Insertion("question")),
      answer: db.prepare(this.Frequent_Insertion("answer")),
      thematic_area: db.prepare(this.Frequent_Insertion("question_thematic_area")),
      content_area: db.prepare(this.Frequent_Insertion("question_content_area")),
      objective: db.prepare(this.Frequent_Insertion("question_objetive")),
      skill: db.prepare(this.Frequent_Insertion("question_skill")),
      specifications_table: db.prepare(/*sql*/ `
        INSERT OR IGNORE
        INTO specifications_table (test_id, thematic_area_id, content_id, objective_id, performed_classes)
        VALUES (?,?,?,?,?)
      `),
      specifications_table_skill: db.prepare(/*sql*/ `
      INSERT OR IGNORE
      INTO specifications_table_skill 
      (specifications_table_id, question_skill_id, position, questions_range)
      VALUES (?,?,?,?)
    `),
      test_question: db.prepare(/*sql*/ `
        INSERT OR IGNORE 
        INTO test_question (test_id, question_id, thematic_area_id, content_id, objetive_id, skill_id) 
        VALUES (?, ?, ?, ?, ?, ?);
        `),
      test_question_answer: db.prepare(/*sql*/ `
        INSERT OR IGNORE INTO test_question_answer (test_id, question_id, answer_id, is_correct)
        VALUES (?, ?, ?, ?)
        `),
    };

    this.Get = {
      test_id: db.prepare(
        /*sql*/ `SELECT id FROM test WHERE title = ? AND created_by = ? AND creation_date = ?`
      ),
      question_id: db.prepare(this.Frequent_Get("question")),
      answer_id: db.prepare(this.Frequent_Get("answer")),
      axis_id: db.prepare(this.Frequent_Get("question_thematic_area")),
      content_id: db.prepare(this.Frequent_Get("question_content_area")),
      objetive_id: db.prepare(this.Frequent_Get("question_objetive")),
      skill_id: db.prepare(this.Frequent_Get("question_skill")),
      subject_id: db.prepare(this.Frequent_Get("subject")),
      specifications_table_id: db.prepare(/*sql*/ `
      SELECT id 
      FROM specifications_table
      WHERE 
      test_id = ? AND 
      thematic_area_id = ? AND 
      content_id = ? AND 
      objective_id = ? AND 
      performed_classes = ?
      `),
    };
    return;
  }

  Finalize() {
    for (let key in this.Insert) {
      if (this.Insert.hasOwnProperty(key)) {
        this.Insert[key].finalize();
      }
    }

    for (let key in this.Get) {
      if (this.Get.hasOwnProperty(key)) {
        this.Get[key].finalize();
      }
    }
    return;
  }
  Frequent_Insertion(table) {
    return /*sql*/ `
      INSERT OR IGNORE INTO ${table} (text, created_by, creation_date) VALUES (?, ?, ?);
      `;
  }
  Frequent_Get(table) {
    return /*sql*/ `SELECT id FROM ${table} WHERE text = ? AND created_by = ?`;
  }
}
