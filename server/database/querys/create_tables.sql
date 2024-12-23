CREATE TABLE IF NOT EXISTS
	teacher (
		"id" INTEGER NOT NULL UNIQUE,
		"name" TEXT NOT NULL UNIQUE,
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

INSERT OR IGNORE INTO
	teacher (name)
VALUES
	("Bob");

CREATE TABLE IF NOT EXISTS
	test (
		"id" INTEGER NOT NULL UNIQUE,
		"unique_id" TEXT NOT NULL UNIQUE,
		"title" TEXT NOT NULL,
		"subject_id" INTEGER NOT NULL,
		"created_by" INTEGER NOT NULL,
		"creation_date" DATETIME NOT NULL,
		/* "designed_for" INTEGER, */
		UNIQUE (title, created_by, creation_date),
		FOREIGN KEY (created_by) REFERENCES teacher (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
		/* FOREIGN KEY (designed_for) REFERENCES grade(id), */
	);

CREATE TABLE IF NOT EXISTS
	question (
		"id" INTEGER NOT NULL UNIQUE,
		"text" TEXT NOT NULL UNIQUE,
		"created_by" INTEGER NOT NULL,
		"creation_date" DATETIME NOT NULL,
		UNIQUE (text, created_by),
		FOREIGN KEY (created_by) REFERENCES teacher (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

-- CREATE TABLE IF NOT EXISTS
-- 	test_question_metadata_2 (
-- 		"id" INTEGER NOT NULL UNIQUE,
-- 		"test_id" INTEGER NOT NULL,
-- 		"question_id" INTEGER NOT NULL,
-- 		"thematic_area_id" INTEGER NOT NULL,
-- 		"content_id" INTEGER NOT NULL,
-- 		"objective_id" INTEGER NOT NULL,
-- 		"skill_id" INTEGER NOT NULL,
-- 		FOREIGN KEY (test_id) REFERENCES test (id),
-- 		FOREIGN KEY (question_id) REFERENCES question (id),
-- 		FOREIGN KEY (thematic_area_id) REFERENCES question_thematic_area (id),
-- 		FOREIGN KEY (content_id) REFERENCES question_content_area (id),
-- 		FOREIGN KEY (objective_id) REFERENCES question_objective (id),
-- 		FOREIGN KEY (skill_id) REFERENCES question_skill (id),
-- 		UNIQUE (test_id, question_id),
-- 		PRIMARY KEY ("id" AUTOINCREMENT)
-- 	);

-- CREATE TABLE IF NOT EXISTS
-- 	test_question_metadata (
-- 		"id" INTEGER NOT NULL UNIQUE,
-- 		"test_id" INTEGER NOT NULL,
-- 		"question_id" INTEGER NOT NULL,
-- 		"specifications_table_id" INTEGER NOT NULL,
-- 		"question_number" INTEGER NOT NULL,
-- 		FOREIGN KEY (test_id) REFERENCES test (id),
-- 		FOREIGN KEY (question_id) REFERENCES question (id),
-- 		FOREIGN KEY (specifications_table_id) REFERENCES specifications_table (id),
-- 		UNIQUE (test_id, question_id, specifications_table_id),
-- 		PRIMARY KEY ("id" AUTOINCREMENT)
-- 	);

CREATE TABLE IF NOT EXISTS
	question_thematic_area (
		"id" INTEGER NOT NULL UNIQUE,
		"text" TEXT NOT NULL UNIQUE,
		"created_by" INTEGER NOT NULL,
		"creation_date" DATETIME NOT NULL,
		UNIQUE (text, created_by),
		FOREIGN KEY (created_by) REFERENCES teacher (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	question_content_area (
		"id" INTEGER NOT NULL UNIQUE,
		"text" TEXT NOT NULL UNIQUE,
		"created_by" INTEGER NOT NULL,
		"creation_date" DATETIME NOT NULL,
		UNIQUE (text, created_by),
		FOREIGN KEY (created_by) REFERENCES teacher (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	question_objective (
		"id" INTEGER NOT NULL UNIQUE,
		"text" TEXT NOT NULL UNIQUE,
		"created_by" INTEGER NOT NULL,
		"creation_date" DATETIME NOT NULL,
		UNIQUE (text, created_by),
		FOREIGN KEY (created_by) REFERENCES teacher (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	question_skill (
		"id" INTEGER NOT NULL UNIQUE,
		"text" TEXT NOT NULL UNIQUE,
		"created_by" INTEGER NOT NULL,
		"creation_date" DATETIME NOT NULL,
		UNIQUE (text, created_by),
		FOREIGN KEY (created_by) REFERENCES teacher (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	answer (
		"id" INTEGER NOT NULL UNIQUE,
		"text" TEXT NOT NULL,
		"created_by" INTEGER NOT NULL,
		"creation_date" DATETIME NOT NULL,
		UNIQUE (text, created_by),
		FOREIGN KEY (created_by) REFERENCES teacher (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	test_question (
		"id" INTEGER NOT NULL UNIQUE,
		"test_id" INTEGER NOT NULL,
		"question_id" INTEGER NOT NULL,
		"question_number" INTEGER NOT NULL,
		"correct_answer_index" INTEGER NOT NULL,

		UNIQUE (test_id, question_number),
		FOREIGN KEY (test_id) REFERENCES test (id),
		FOREIGN KEY (question_id) REFERENCES question (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	test_question_answer (
		"test_question_id" INTEGER NOT NULL,
		"answer_id" INTEGER NOT NULL,
		"answer_number" INTEGER NOT NULL,

		UNIQUE (test_question_id, answer_number),

		FOREIGN KEY (test_question_id) REFERENCES test_question (id),
		FOREIGN KEY (answer_id) REFERENCES answer (id)
	);

CREATE TABLE IF NOT EXISTS
	grade (
		"id" INTEGER NOT NULL UNIQUE,
		"level" TEXT NOT NULL UNIQUE,
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	generation (
		"id" INTEGER NOT NULL UNIQUE,
		"grade_id" INTEGER NOT NULL,
		"year" DATE NOT NULL,
		FOREIGN KEY (grade_id) REFERENCES grade (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	generation_student (
		"id" INTEGER NOT NULL UNIQUE,
		"generation_id" INTEGER NOT NULL,
		"student_id" INTEGER NOT NULL,
		FOREIGN KEY (generation_id) REFERENCES generation (id),
		FOREIGN KEY (student_id) REFERENCES student (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	student (
		"id" INTEGER NOT NULL UNIQUE,
		"name" TEXT NOT NULL,
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	test_performed (
		"id" INTEGER NOT NULL UNIQUE,
		"test_id" INTEGER DEFAULT NULL,
		-- "generation_id" INTEGER NULL,
		"form_id" TEXT NOT NULL,
		"form_url" TEXT NOT NULL,
		"date" DATETIME NOT NULL,
		FOREIGN KEY (test_id) REFERENCES test (id),
		-- FOREIGN KEY (generation_id) REFERENCES generation(id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	test_result (
		"id" INTEGER NOT NULL UNIQUE,
		"test_performed_id" INTEGER NOT NULL,
		"student_id" INTEGER NOT NULL,
		"question_id" INTEGER NOT NULL,
		"answer" TEXT NOT NULL,
		FOREIGN KEY (test_performed_id) REFERENCES test_performed (id),
		FOREIGN KEY (student_id) REFERENCES student (id),
		FOREIGN KEY (question_id) REFERENCES question (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	subject (
		"id" INTEGER NOT NULL UNIQUE,
		"text" TEXT NOT NULL UNIQUE,
		"created_by" INTEGER NOT NULL,
		"creation_date" DATETIME NOT NULL,
		FOREIGN KEY (created_by) REFERENCES teacher (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	specifications_table (
		"id" INTEGER NOT NULL UNIQUE,
		"test_id" INTEGER NOT NULL,
		"table_row" INTEGER NOT NULL,
		"thematic_area_id" INTEGER NOT NULL,
		"content_id" INTEGER NOT NULL,
		"objective_id" INTEGER NOT NULL,
		"performed_classes" INTEGER NOT NULL,
		
		UNIQUE (test_id, table_row),
		FOREIGN KEY (test_id) REFERENCES test (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);

CREATE TABLE IF NOT EXISTS
	specifications_table_skill (
		"id" INTEGER NOT NULL UNIQUE,
		"specifications_table_id" INTEGER NOT NULL,
		"question_skill_id" INTEGER NOT NULL,
		"position" INTEGER NOT NULL,
		"questions_range" TEXT,
		
		UNIQUE(specifications_table_id, position),
		FOREIGN KEY (specifications_table_id) REFERENCES specifications_table (id),
		FOREIGN KEY (question_skill_id) REFERENCES question_skill (id),
		PRIMARY KEY ("id" AUTOINCREMENT)
	);