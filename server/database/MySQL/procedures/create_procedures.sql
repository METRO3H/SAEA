DROP PROCEDURE IF EXISTS $SAVE_TEACHER;
DROP PROCEDURE IF EXISTS $SAVE_SPECT_SUBJECT;
DROP PROCEDURE IF EXISTS $SAVE_QUIZ;
DROP PROCEDURE IF EXISTS $SAVE_SPECT_SKILL;
DROP PROCEDURE IF EXISTS $SAVE_SPECT_THEMATIC_AREA;
DROP PROCEDURE IF EXISTS $SAVE_SPECT_CONTENT;
DROP PROCEDURE IF EXISTS $SAVE_SPECT_OBJECTIVE;
DROP PROCEDURE IF EXISTS $PROCESS_SKILLS;
DROP PROCEDURE IF EXISTS $SAVE_SPECIFICATIONS_TABLE;
DROP PROCEDURE IF EXISTS $PROCESS_SPECIFICATIONS_TABLE_ROW_SKILLS;
DROP PROCEDURE IF EXISTS $PROCESS_SPECTIFICATIONS_TABLE;
DROP PROCEDURE IF EXISTS $SAVE_QUESTION;
DROP PROCEDURE IF EXISTS $SAVE_QUIZ_QUESTION;
DROP PROCEDURE IF EXISTS $SAVE_ANSWER;
DROP PROCEDURE IF EXISTS $SAVE_QUIZ_QUESTION_ANSWER;
DROP PROCEDURE IF EXISTS $PROCESS_ANSWERS;
DROP PROCEDURE IF EXISTS $PROCESS_QUESTIONS;
DROP VIEW IF EXISTS drafts;
DROP VIEW IF EXISTS performed;
DROP PROCEDURE IF EXISTS $GET_QUIZZES;

CREATE PROCEDURE 
    $SAVE_TEACHER(IN $name VARCHAR(255), IN $last_name VARCHAR(255), IN $email VARCHAR(255))
	BEGIN
		INSERT IGNORE INTO teacher (name, last_name, email)
		VALUES ($name, $last_name, $email);
	END;


CREATE PROCEDURE
    $SAVE_SPECT_SUBJECT (IN $statement VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
	
		INSERT IGNORE INTO
		spect_subject (statement, teacher_id, creation_date)
		VALUES
		($statement, $teacher_id, $creation_date);
		
	END;



CREATE PROCEDURE $SAVE_QUIZ(IN $uuid CHAR(36), IN $statement VARCHAR(255), IN $teacher_id INT, IN $title VARCHAR(255), IN $creation_date DATETIME) 
	BEGIN
		INSERT IGNORE INTO
		quiz (uuid, spect_subject_id, teacher_id, title, creation_date)
		VALUES
		($uuid, (SELECT id FROM spect_subject WHERE statement = $statement), $teacher_id, $title, $creation_date);
	END;


CREATE PROCEDURE $SAVE_SPECT_SKILL(IN $skill VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
		
		INSERT IGNORE INTO
		spect_skill (statement, teacher_id, creation_date)
		VALUES
		($skill, $teacher_id, $creation_date);
	END;

CREATE PROCEDURE $SAVE_SPECT_THEMATIC_AREA(IN $thematic_area VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
		INSERT IGNORE INTO
		spect_thematic_area (statement, teacher_id, creation_date)
		VALUES
		($thematic_area, $teacher_id, $creation_date);
	END;

CREATE PROCEDURE $SAVE_SPECT_CONTENT(IN $content VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
		INSERT IGNORE INTO
		spect_content (statement, teacher_id, creation_date)
		VALUES
		($content, $teacher_id, $creation_date);
	END;

CREATE PROCEDURE $SAVE_SPECT_OBJECTIVE(IN $objective VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
		INSERT IGNORE INTO
		spect_objective (statement, teacher_id, creation_date)
		VALUES
		($objective, $teacher_id, $creation_date);
	END;


CREATE PROCEDURE $PROCESS_SKILLS( IN $quiz_id INT, IN $teacher_id INT, IN $creation_date DATETIME, IN $skills JSON)
	BEGIN
	
		DECLARE $skills_length INT DEFAULT 0;
		DECLARE $skill_index INT DEFAULT 0;
		DECLARE $skill_value VARCHAR(255);

		SET $skills_length = JSON_LENGTH(JSON_EXTRACT($skills, '$'));

		WHILE $skill_index < $skills_length DO
			
			SET $skill_value = JSON_UNQUOTE(JSON_EXTRACT($skills, CONCAT('$[', $skill_index, ']')));

			CALL $SAVE_SPECT_SKILL($skill_value, $teacher_id, $creation_date);

			SET $skill_index = $skill_index + 1;

		END WHILE;

	END;


CREATE PROCEDURE $SAVE_SPECIFICATIONS_TABLE(IN $quiz_id INT, IN $thematic_area VARCHAR(255), IN $content VARCHAR(255), IN $objective VARCHAR(255), IN $performed_classes INT, IN $row_position INT)
	BEGIN
		INSERT IGNORE INTO
		specifications_table (quiz_id, thematic_area_id, content_id, objective_id, performed_classes, row_position)
		VALUES
		($quiz_id, (SELECT id FROM spect_thematic_area WHERE statement = $thematic_area), (SELECT id FROM spect_content WHERE statement = $content), (SELECT id FROM spect_objective WHERE statement = $objective), $performed_classes, $row_position);
	END;

CREATE PROCEDURE $PROCESS_SPECIFICATIONS_TABLE_ROW_SKILLS(IN $quiz_id INT, IN $row_position INT, IN $quiz_skills JSON, IN $row_skills JSON)
	BEGIN
		DECLARE $row_skill_length INT DEFAULT 0;
		DECLARE $row_skill_index INT DEFAULT 0;
		DECLARE $skill VARCHAR(255);
		DECLARE $cell_statement VARCHAR(255);

		SET $row_skill_length = JSON_LENGTH(JSON_EXTRACT($row_skills, '$'));

		
		row_skill_loop: WHILE $row_skill_index < $row_skill_length DO
			
			SET $cell_statement = JSON_UNQUOTE(JSON_EXTRACT($row_skills, CONCAT('$[', $row_skill_index, ']')));

			IF $cell_statement IS NULL OR TRIM($cell_statement) = '' THEN
				SET $row_skill_index = $row_skill_index + 1;
				ITERATE row_skill_loop;
			END IF;

			SET $skill = JSON_UNQUOTE(JSON_EXTRACT($quiz_skills, CONCAT('$[', $row_skill_index, ']')));


				INSERT IGNORE INTO
				specifications_table_skill (specifications_table_id, spect_skill_id, cell_statement, column_position)
				VALUES
				(
					(SELECT id FROM specifications_table WHERE quiz_id = $quiz_id AND row_position = $row_position), 
					(SELECT id FROM spect_skill WHERE statement = $skill), 
					$cell_statement, 
					$row_skill_index
				);

			SET $row_skill_index = $row_skill_index + 1;

		END WHILE row_skill_loop;

	END;



CREATE PROCEDURE $PROCESS_SPECTIFICATIONS_TABLE( IN $quiz_id INT, IN $teacher_id INT, IN $creation_date DATETIME, IN $spect_items JSON, IN $quiz_skills JSON)
	BEGIN
	
		DECLARE $spect_items_length INT DEFAULT 0;
		DECLARE $spect_item_index INT DEFAULT 0;
		DECLARE $spect_item JSON;
		DECLARE $row_skills JSON;
		DECLARE $thematic_area VARCHAR(255);
		DECLARE $content VARCHAR(255);
		DECLARE $objective VARCHAR(255);
		DECLARE $performed_classes INT;

		SET $spect_items_length = JSON_LENGTH(JSON_EXTRACT($spect_items, '$'));

		WHILE $spect_item_index < $spect_items_length DO
	
			SET $spect_item = JSON_EXTRACT($spect_items, CONCAT('$[', $spect_item_index, ']'));

			SET $thematic_area = JSON_UNQUOTE(JSON_EXTRACT($spect_item, '$.thematic_area'));
			SET $content = JSON_UNQUOTE(JSON_EXTRACT($spect_item, '$.content'));
			SET $objective = JSON_UNQUOTE(JSON_EXTRACT($spect_item, '$.objective'));
			SET $performed_classes = JSON_UNQUOTE(JSON_EXTRACT($spect_item, '$.performed_classes'));
			SET $row_skills = JSON_EXTRACT($spect_item, '$.row_skills');

			CALL $SAVE_SPECT_THEMATIC_AREA($thematic_area, $teacher_id, $creation_date);
			CALL $SAVE_SPECT_CONTENT($content, $teacher_id, $creation_date);
			CALL $SAVE_SPECT_OBJECTIVE($objective, $teacher_id, $creation_date);

			CALL $SAVE_SPECIFICATIONS_TABLE($quiz_id, $thematic_area, $content, $objective, $performed_classes, $spect_item_index + 1);

			CALL $PROCESS_SPECIFICATIONS_TABLE_ROW_SKILLS($quiz_id, $spect_item_index + 1, $quiz_skills, $row_skills);

			SET $spect_item_index = $spect_item_index + 1;

		END WHILE;

	END;



CREATE PROCEDURE $SAVE_QUESTION(IN $question VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
		INSERT IGNORE INTO
		question (statement, teacher_id, creation_date)
		VALUES
		($question, $teacher_id, $creation_date);
	END;

CREATE PROCEDURE $SAVE_QUIZ_QUESTION(IN $quiz_id INT, IN $question_statement VARCHAR(255), IN $position INT, IN $correct_answer_index INT) 
	BEGIN
		INSERT IGNORE INTO
		quiz_question (quiz_id, question_id, position, correct_answer_index)
		VALUES
		($quiz_id, (SELECT id FROM question WHERE statement = $question_statement), $position, $correct_answer_index);
	END;

CREATE PROCEDURE $SAVE_ANSWER(IN $answer VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
		INSERT IGNORE INTO
		answer (statement, teacher_id, creation_date)
		VALUES
		($answer, $teacher_id, $creation_date);
	END;

CREATE PROCEDURE $SAVE_QUIZ_QUESTION_ANSWER(IN $quiz_question_id INT, IN $answer_statement VARCHAR(255), $position INT)
	BEGIN
		INSERT IGNORE INTO
			quiz_question_answer (quiz_question_id, answer_id, position)
			VALUES
			($quiz_question_id, (SELECT id FROM answer WHERE statement = $answer_statement), $position);

	END;

CREATE PROCEDURE $PROCESS_ANSWERS( IN $quiz_id INT, IN $teacher_id INT, IN $creation_date DATETIME, IN $quiz_question_id INT, IN $answers JSON)
	BEGIN
		DECLARE $answers_length INT DEFAULT 0;
		DECLARE $answers_index INT DEFAULT 0;
		DECLARE $answer_statement VARCHAR(255);

		SET $answers_length = JSON_LENGTH($answers);
		SET $answers_index = 0;

		WHILE $answers_index < $answers_length DO

			SET $answer_statement = JSON_UNQUOTE(JSON_EXTRACT($answers, CONCAT('$[', $answers_index, ']')));

			CALL $SAVE_ANSWER($answer_statement, $teacher_id, $creation_date);

			CALL $SAVE_QUIZ_QUESTION_ANSWER($quiz_question_id, $answer_statement, $answers_index + 1);

			SET $answers_index = $answers_index + 1;

		END WHILE;
		
	END;


CREATE PROCEDURE $PROCESS_QUESTIONS( IN $quiz_id INT, IN $teacher_id INT, IN $creation_date DATETIME, IN $questions JSON)
	BEGIN
		DECLARE $questions_length INT DEFAULT 0;
		DECLARE $questions_index INT DEFAULT 0;
		DECLARE $question_item JSON;
		DECLARE $question_statement VARCHAR(255);
		DECLARE $answers JSON;
		DECLARE $correct_answer_index INT DEFAULT -1;
		DECLARE $quiz_question_id INT;

		SET $questions_length = JSON_LENGTH($questions);
		SET $questions_index = 0;

		WHILE $questions_index < $questions_length DO

			SET $question_item = JSON_EXTRACT($questions, CONCAT('$[', $questions_index, ']'));

			SET $question_statement = JSON_UNQUOTE(JSON_EXTRACT($question_item, '$.question'));
			SET $answers = JSON_EXTRACT($question_item, '$.answers');
			SET $correct_answer_index = JSON_EXTRACT($question_item, '$.correct_answer_index');

			CALL $SAVE_QUESTION($question_statement, $teacher_id, $creation_date);

			CALL $SAVE_QUIZ_QUESTION($quiz_id, $question_statement, $questions_index + 1, $correct_answer_index);

			SET $quiz_question_id = Get_Quiz_Question_ID($quiz_id, $questions_index + 1);

			CALL $PROCESS_ANSWERS($quiz_id, $teacher_id, $creation_date, $quiz_question_id, $answers);

			SET $questions_index = $questions_index + 1;

		END WHILE;

	
	END;
	

CREATE VIEW drafts AS
	SELECT 
		quiz.uuid,
		quiz.title,
		spect_subject.statement AS subject,
		CASE
			WHEN DATE(quiz.creation_date) = CURDATE() THEN 
				DATE_FORMAT(quiz.creation_date, '%H:%i')  -- Solo hora y minutos
			ELSE 
				DATE_FORMAT(quiz.creation_date, '%d/%m/%Y') -- Solo fecha en formato deseado
		END AS creation_date
	FROM quiz
	JOIN spect_subject ON spect_subject.id = quiz.spect_subject_id
	WHERE quiz.teacher_id = 1
	AND NOT EXISTS (
		SELECT 1 
		FROM quiz_performed 
		WHERE quiz_performed.quiz_id = quiz.id
	)
	ORDER BY quiz.creation_date DESC;

CREATE VIEW performed AS
	SELECT 
		quiz.title, 
		spect_subject.statement AS subject,
		 quiz_performed.google_form_id,
		 quiz_performed.google_form_url,
		CASE
			WHEN DATE(quiz_performed.creation_date) = CURDATE() THEN 
				DATE_FORMAT(quiz_performed.creation_date, '%H:%i')  -- Solo hora y minutos
			ELSE 
				DATE_FORMAT(quiz_performed.creation_date, '%d/%m/%Y') -- Solo fecha en formato deseado
		END AS creation_date
	FROM quiz
	JOIN spect_subject ON spect_subject.id = quiz.spect_subject_id
	JOIN quiz_performed ON quiz_performed.quiz_id = quiz.id
	WHERE quiz.teacher_id = 1
	ORDER BY quiz_performed.creation_date DESC;

CREATE PROCEDURE $GET_QUIZZES()
	BEGIN
		SELECT * FROM drafts;

		SELECT * FROM performed;

	END;

