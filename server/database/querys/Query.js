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
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(unique_id) DO UPDATE SET 
          title = excluded.title,
          subject_id = excluded.subject_id
        `),
      subject: db.prepare(this.Frequent_Insertion("subject")),
      question: db.prepare(this.Frequent_Insertion("question")),
      answer: db.prepare(this.Frequent_Insertion("answer")),
      thematic_area: db.prepare(this.Frequent_Insertion("question_thematic_area")),
      content_area: db.prepare(this.Frequent_Insertion("question_content_area")),
      objective: db.prepare(this.Frequent_Insertion("question_objective")),
      skill: db.prepare(this.Frequent_Insertion("question_skill")),
      specifications_table: db.prepare(/*sql*/ `
          INSERT OR IGNORE INTO 
          specifications_table (test_id, table_row, thematic_area_id, content_id, objective_id, performed_classes)
          VALUES (?,?,
                (SELECT id FROM question_thematic_area WHERE text = ?), 
                (SELECT id FROM question_content_area WHERE text = ?), 
                (SELECT id FROM question_objective WHERE text = ?)
                ,?)
          ON CONFLICT(test_id, table_row) DO UPDATE SET 
            thematic_area_id = excluded.thematic_area_id,
            content_id = excluded.content_id,
            objective_id = excluded.objective_id,
            performed_classes = excluded.performed_classes
            `),
      specifications_table_skill: db.prepare(/*sql*/ `
          INSERT
          INTO specifications_table_skill 
          (specifications_table_id, question_skill_id, position, questions_range)
          VALUES (
          (SELECT id FROM specifications_table WHERE test_id = ? AND table_row = ?),
          (SELECT id FROM question_skill WHERE text = ?)
          ,?,?)
          ON CONFLICT(specifications_table_id, position) DO UPDATE SET 
            question_skill_id = excluded.question_skill_id,
            questions_range = excluded.questions_range
        `),
      //   test_question_metadata_2: db.prepare(/*sql*/ `
      // INSERT OR IGNORE
      //     INTO test_question_metadata_2 (test_id, question_id, thematic_area_id, content_id, objective_id, skill_id)
      //     VALUES (?, ?,
      //       (SELECT id FROM question_thematic_area WHERE text = ?),
      //       (SELECT id FROM question_content_area WHERE text = ?),
      //       (SELECT id FROM question_objective WHERE text = ?),
      //       (SELECT id FROM question_skill WHERE text = ?));
      //     `),

      //   test_question_metadata: db.prepare(/*sql*/ `
      //     INSERT
      //     INTO test_question_metadata (test_id, question_id, specifications_table_id, question_number)
      //     VALUES (?, ?, (
      //       SELECT id
      //       FROM specifications_table
      //       WHERE
      //         test_id = ? AND
      //         thematic_area_id = (SELECT id FROM question_thematic_area WHERE text = ?) AND
      //         content_id = (SELECT id FROM question_content_area WHERE text = ?) AND
      //         objective_id = (SELECT id FROM question_objective WHERE text = ?))
      //         ,?);
      //         `),
      test_question: db.prepare(/*sql*/ `
        INSERT OR IGNORE INTO test_question (test_id, question_id, question_number, correct_answer_index)
        VALUES (?, ?, ?, ?)
        `),

      test_question_answer: db.prepare(/*sql*/ `
        INSERT OR IGNORE INTO test_question_answer (test_question_id, answer_id, answer_number)
        VALUES (?, ?, ?)
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
      objective_id: db.prepare(this.Frequent_Get("question_objective")),
      skill_id: db.prepare(this.Frequent_Get("question_skill")),
      subject_id: db.prepare(this.Frequent_Get("subject")),
      specifications_table: db.prepare(/*sql*/ `
      SELECT id 
      FROM specifications_table
      WHERE 
        test_id = ?
      `),

      test_question_id: db.prepare(/*sql*/ `
        SELECT id
        FROM test_question
        WHERE test_id = ? AND question_id = ?
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
