CREATE TABLE teacher (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	
	PRIMARY KEY("id" AUTOINCREMENT)
); 
INSERT INTO teacher (name) VALUES ("Bob");
CREATE TABLE test (
	"id"	INTEGER NOT NULL UNIQUE,
	"title"	TEXT NOT NULL,
	"created_by" INTEGER NOT NULL,
	"creation_date" DATETIME NOT NULL,
	/* "designed_for" INTEGER, */
	
	UNIQUE(title, created_by),
	FOREIGN KEY (created_by) REFERENCES teacher(id),
	PRIMARY KEY("id" AUTOINCREMENT)
	/* FOREIGN KEY (designed_for) REFERENCES grade(id), */
); 

CREATE TABLE question (
	"id"	INTEGER NOT NULL UNIQUE,
	"text"	TEXT NOT NULL UNIQUE,
	"created_by" INTEGER NOT NULL,
	"creation_date"	DATETIME NOT NULL,
	
	UNIQUE(text, created_by),
	FOREIGN KEY (created_by) REFERENCES teacher(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 

CREATE TABLE test_question (
	"id"	INTEGER NOT NULL UNIQUE,
	"test_id"	INTEGER NOT NULL,
	"question_id" INTEGER NOT NULL,
	"question_preference_id" INTEGER /*NOT NULL*/,
	
	FOREIGN KEY (test_id) REFERENCES test(id),
	FOREIGN KEY (question_id) REFERENCES question(id),
	FOREIGN KEY (question_preference_id) REFERENCES question_preference(id),
	
	UNIQUE(test_id, question_id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 

CREATE TABLE question_preference(
	"id"		  INTEGER NOT NULL UNIQUE,
	"teacher_id"  INTEGER NOT NULL,
	"question_id" INTEGER NOT NULL,
	"thematic_area_id" INTEGER NOT NULL,
	"content_id" INTEGER NOT NULL,
	"objetive_id" INTEGER NOT NULL,
	"skill_id" INTEGER NOT NULL,
	
	FOREIGN KEY (teacher_id) REFERENCES teacher(id),
	FOREIGN KEY (question_id) REFERENCES question(id),
	FOREIGN KEY (thematic_area_id) REFERENCES question_thematic_area(id),
	FOREIGN KEY (content_id) REFERENCES question_content_area(id),
	FOREIGN KEY (objetive_id) REFERENCES question_objetive(id),
	FOREIGN KEY (skill_id) REFERENCES question_skill(id),
	
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE question_thematic_area (
	"id"	INTEGER NOT NULL UNIQUE,
	"text"	TEXT NOT NULL,
	"created_by" INTEGER NOT NULL,
	"creation_date"	DATETIME NOT NULL,
	
	FOREIGN KEY (created_by) REFERENCES teacher(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 
CREATE TABLE question_content_area (
	"id"	INTEGER NOT NULL UNIQUE,
	"text"	TEXT NOT NULL,
	"created_by" INTEGER NOT NULL,
	"creation_date"	DATETIME NOT NULL,
	
	FOREIGN KEY (created_by) REFERENCES teacher(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 

CREATE TABLE question_objetive (
	"id"	INTEGER NOT NULL UNIQUE,
	"text"	TEXT NOT NULL,
	"created_by" INTEGER NOT NULL,
	"creation_date"	DATETIME NOT NULL,
	
	FOREIGN KEY (created_by) REFERENCES teacher(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 
CREATE TABLE question_skill (
	"id"	INTEGER NOT NULL UNIQUE,
	"text"	TEXT NOT NULL,
	"created_by" INTEGER NOT NULL,
	"creation_date"	DATETIME NOT NULL,
	
	FOREIGN KEY (created_by) REFERENCES teacher(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 
CREATE TABLE answer (
	"id"	INTEGER NOT NULL UNIQUE,
	"text" TEXT NOT NULL,
	"created_by" INTEGER NOT NULL,
	"creation_date"	DATETIME NOT NULL,
	
	UNIQUE(text, created_by),
	FOREIGN KEY (created_by) REFERENCES teacher(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 

CREATE TABLE test_question_answer (
	"id"	INTEGER NOT NULL UNIQUE,
	"test_id"	INTEGER NOT NULL,
	"question_id" INTEGER NOT NULL,
	"answer_id" INTEGER NOT NULL,
	"is_correct" INTEGER,
	
	UNIQUE(test_id, question_id, answer_id)
	FOREIGN KEY (test_id) REFERENCES test(id),
	FOREIGN KEY (question_id) REFERENCES question(id),
	FOREIGN KEY (answer_id) REFERENCES answer(id),
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE grade (
	"id"	INTEGER NOT NULL UNIQUE,
	"level"	TEXT NOT NULL UNIQUE,
	
	PRIMARY KEY("id" AUTOINCREMENT)
); 

CREATE TABLE generation (
	"id"	INTEGER NOT NULL UNIQUE,
	"grade_id"	INTEGER NOT NULL,
	"year" DATE NOT NULL,
	
	FOREIGN KEY (grade_id) REFERENCES grade(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 

CREATE TABLE generation_student (
	"id"	INTEGER NOT NULL UNIQUE,
	"generation_id"	INTEGER NOT NULL,
	"student_id" INTEGER NOT NULL,
	
	FOREIGN KEY (generation_id) REFERENCES generation(id),
	FOREIGN KEY (student_id) REFERENCES student(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 
CREATE TABLE student (
	"id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT NOT NULL,
	
	PRIMARY KEY("id" AUTOINCREMENT)
); 

CREATE TABLE test_performed (
	"id"	INTEGER NOT NULL UNIQUE,
	"test_id"	INTEGER NOT NULL,
	"generation_id" INTEGER NOT NULL,
	"form_id" TEXT NOT NULL,
	"date" DATETIME NOT NULL,
	
	FOREIGN KEY (test_id) REFERENCES test(id),
	FOREIGN KEY (generation_id) REFERENCES generation(id),
	PRIMARY KEY("id" AUTOINCREMENT)
); 

CREATE TABLE test_result (
	"id"	INTEGER NOT NULL UNIQUE,
	"test_performed_id"	INTEGER NOT NULL,
	"student_id" INTEGER NOT NULL,
	"question_id" INTEGER NOT NULL,
	"answer" TEXT NOT NULL,
	
	FOREIGN KEY (test_performed_id) REFERENCES test_performed(id),
	FOREIGN KEY (student_id) REFERENCES student(id),
	FOREIGN KEY (question_id) REFERENCES question(id),
	PRIMARY KEY("id" AUTOINCREMENT)
);