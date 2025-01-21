
SET time_zone = 'America/Santiago';

DROP TABLE IF EXISTS specifications_table_skill;
DROP TABLE IF EXISTS specifications_table;
DROP TABLE IF EXISTS quiz_performed;
DROP TABLE IF EXISTS quiz_question_answer;
DROP TABLE IF EXISTS quiz_question;
DROP TABLE IF EXISTS answer;
DROP TABLE IF EXISTS spect_skill;
DROP TABLE IF EXISTS spect_objective;
DROP TABLE IF EXISTS spect_content;
DROP TABLE IF EXISTS spect_thematic_area;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS quiz;
DROP TABLE IF EXISTS spect_subject;
DROP TABLE IF EXISTS teacher;


CREATE TABLE
    IF NOT EXISTS teacher (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) DEFAULT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

INSERT INTO
    teacher (name, last_name, email)
VALUES
    ("Bob", "Smith", "bob@gmail.com");

CREATE TABLE
    IF NOT EXISTS spect_subject (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        statement VARCHAR(255) NOT NULL UNIQUE,
        teacher_id INT NOT NULL,
        creation_date DATETIME(0) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teacher (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS quiz (
        id INT NOT NULL AUTO_INCREMENT,
        uuid CHAR(36) NOT NULL UNIQUE,
        spect_subject_id INT NOT NULL,
        teacher_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        creation_date DATETIME(0) NOT NULL,
        UNIQUE (teacher_id, title, creation_date),
        FOREIGN KEY (spect_subject_id) REFERENCES spect_subject (id),
        FOREIGN KEY (teacher_id) REFERENCES teacher (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS question (
        id INT NOT NULL AUTO_INCREMENT,
        statement VARCHAR(255) NOT NULL UNIQUE,
        teacher_id INT NOT NULL,
        creation_date DATETIME(0) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teacher (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS spect_thematic_area (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        statement VARCHAR(255) NOT NULL UNIQUE,
        teacher_id INT NOT NULL,
        creation_date DATETIME(0) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teacher (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS spect_content (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        statement VARCHAR(255) NOT NULL UNIQUE,
        teacher_id INT NOT NULL,
        creation_date DATETIME(0) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teacher (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS spect_objective (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        statement VARCHAR(255) NOT NULL UNIQUE,
        teacher_id INT NOT NULL,
        creation_date DATETIME(0) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teacher (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS spect_skill (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        statement VARCHAR(255) NOT NULL UNIQUE,
        teacher_id INT NOT NULL,
        creation_date DATETIME(0) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teacher (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS answer (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        statement VARCHAR(255) NOT NULL UNIQUE,
        teacher_id INT NOT NULL,
        creation_date DATETIME(0) NOT NULL,
        FOREIGN KEY (teacher_id) REFERENCES teacher (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS quiz_question (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        quiz_id INT NOT NULL,
        question_id INT NOT NULL,
        position INT NOT NULL,
        correct_answer_index INT NOT NULL,
        UNIQUE (quiz_id, position),
        FOREIGN KEY (quiz_id) REFERENCES quiz (id),
        FOREIGN KEY (question_id) REFERENCES question (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS quiz_question_answer (
        quiz_question_id INT NOT NULL,
        answer_id INT NOT NULL,
        position INT NOT NULL,
        UNIQUE (quiz_question_id, position),
        FOREIGN KEY (quiz_question_id) REFERENCES quiz_question (id) ON DELETE CASCADE,
        FOREIGN KEY (answer_id) REFERENCES answer (id)
    ) ENGINE = InnoDB;

-- CREATE TABLE IF NOT EXISTS grade (
--     id INT NOT NULL AUTO_INCREMENT UNIQUE,
--     level VARCHAR(255) NOT NULL UNIQUE,
--     PRIMARY KEY (id)
-- ) ENGINE=InnoDB;
-- CREATE TABLE IF NOT EXISTS generation (
--     id INT NOT NULL AUTO_INCREMENT UNIQUE,
--     grade_id INT NOT NULL,
--     year DATE NOT NULL,
--     FOREIGN KEY (grade_id) REFERENCES grade (id),
--     PRIMARY KEY (id)
-- ) ENGINE=InnoDB;
-- CREATE TABLE IF NOT EXISTS student (
--     id INT NOT NULL AUTO_INCREMENT UNIQUE,
--     name VARCHAR(255) NOT NULL,
--     PRIMARY KEY (id)
-- ) ENGINE=InnoDB;
-- CREATE TABLE IF NOT EXISTS generation_student (
--     id INT NOT NULL AUTO_INCREMENT UNIQUE,
--     generation_id INT NOT NULL,
--     student_id INT NOT NULL,
--     FOREIGN KEY (generation_id) REFERENCES generation (id),
--     FOREIGN KEY (student_id) REFERENCES student (id),
--     PRIMARY KEY (id)
-- ) ENGINE=InnoDB;
CREATE TABLE
    IF NOT EXISTS quiz_performed (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        quiz_id INT NOT NULL,
        google_form_id VARCHAR(255) NOT NULL UNIQUE,
        google_form_url VARCHAR(255) NOT NULL UNIQUE,
        creation_date DATETIME(0) NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quiz (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

-- CREATE TABLE IF NOT EXISTS quiz_result (
--     id INT NOT NULL AUTO_INCREMENT UNIQUE,
--     quiz_performed_id INT NOT NULL,
--     student_id INT NOT NULL,
--     question_id INT NOT NULL,
--     answer VARCHAR(255) NOT NULL,
--     FOREIGN KEY (quiz_performed_id) REFERENCES quiz_performed (id),
--     FOREIGN KEY (student_id) REFERENCES student (id),
--     FOREIGN KEY (question_id) REFERENCES question (id),
--     PRIMARY KEY (id)
-- ) ENGINE=InnoDB;
CREATE TABLE
    IF NOT EXISTS specifications_table (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        quiz_id INT NOT NULL,
        thematic_area_id INT NOT NULL,
        content_id INT NOT NULL,
        objective_id INT NOT NULL,
        performed_classes INT NOT NULL,
        row_position INT NOT NULL,
        UNIQUE (quiz_id, row_position),
        FOREIGN KEY (quiz_id) REFERENCES quiz (id),
        FOREIGN KEY (thematic_area_id) REFERENCES spect_thematic_area (id),
        FOREIGN KEY (content_id) REFERENCES spect_content (id),
        FOREIGN KEY (objective_id) REFERENCES spect_objective (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;

CREATE TABLE
    IF NOT EXISTS specifications_table_skill (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        specifications_table_id INT NOT NULL,
        spect_skill_id INT NOT NULL,
        cell_statement VARCHAR(255) NOT NULL,
        column_position INT NOT NULL,
        UNIQUE (specifications_table_id, column_position),
        FOREIGN KEY (specifications_table_id) REFERENCES specifications_table (id),
        FOREIGN KEY (spect_skill_id) REFERENCES spect_skill (id),
        PRIMARY KEY (id)
    ) ENGINE = InnoDB;