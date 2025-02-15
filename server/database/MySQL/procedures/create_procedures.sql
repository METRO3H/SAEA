DROP PROCEDURE IF EXISTS $SAVE_TEACHER;
DROP PROCEDURE IF EXISTS $SAVE_SPECT_SUBJECT;
DROP PROCEDURE IF EXISTS $SAVE_QUIZ_METADATA;
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
DROP PROCEDURE IF EXISTS $GET_QUIZZES;
DROP PROCEDURE IF EXISTS $SAVE_PERFORMED_QUIZ;
DROP VIEW IF EXISTS drafts;
DROP VIEW IF EXISTS performed;


CREATE PROCEDURE
    $SAVE_SPECT_SUBJECT (IN $statement VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
	
		INSERT IGNORE INTO
		spect_subject (statement, teacher_id, creation_date)
		VALUES
		($statement, $teacher_id, $creation_date);
		
	END;



CREATE PROCEDURE $SAVE_QUIZ_METADATA(IN $uuid CHAR(36), IN $statement VARCHAR(255), IN $teacher_id INT, IN $title VARCHAR(255), IN $creation_date DATETIME) 
	BEGIN
		INSERT INTO
		quiz (uuid, spect_subject_id, teacher_id, title, creation_date)
		VALUES
		($uuid, (SELECT id FROM spect_subject WHERE statement = $statement), $teacher_id, $title, $creation_date)
		ON DUPLICATE KEY UPDATE 
			title = VALUES(title),
			spect_subject_id = VALUES(spect_subject_id);
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
		INSERT INTO
		specifications_table (quiz_id, thematic_area_id, content_id, objective_id, performed_classes, row_position)
		VALUES
		($quiz_id, (SELECT id FROM spect_thematic_area WHERE statement = $thematic_area), (SELECT id FROM spect_content WHERE statement = $content), (SELECT id FROM spect_objective WHERE statement = $objective), $performed_classes, $row_position)
		ON DUPLICATE KEY UPDATE 
			thematic_area_id = VALUES(thematic_area_id),
			content_id = VALUES(content_id),
			objective_id = VALUES(objective_id),
			performed_classes = VALUES(performed_classes)
		;
	END;

CREATE PROCEDURE $PROCESS_SPECIFICATIONS_TABLE_ROW_SKILLS(IN $quiz_id INT, IN $row_position INT, IN $quiz_skills JSON, IN $row_skills JSON)
	BEGIN
		DECLARE $row_skill_length INT DEFAULT 0;
		DECLARE $row_skill_index INT DEFAULT 0;
		DECLARE $skill VARCHAR(255);
		DECLARE $cell_statement VARCHAR(255);

		SET $row_skill_length = JSON_LENGTH(JSON_EXTRACT($row_skills, '$'));

		WHILE $row_skill_index < $row_skill_length DO
			
			SET $cell_statement = JSON_UNQUOTE(JSON_EXTRACT($row_skills, CONCAT('$[', $row_skill_index, ']')));
			SET $cell_statement = TRIM($cell_statement);

			SET $skill = JSON_UNQUOTE(JSON_EXTRACT($quiz_skills, CONCAT('$[', $row_skill_index, ']')));


				INSERT INTO
				specifications_table_skill (specifications_table_id, spect_skill_id, cell_statement, column_position)
				VALUES
				(
					(SELECT id FROM specifications_table WHERE quiz_id = $quiz_id AND row_position = $row_position), 
					(SELECT id FROM spect_skill WHERE statement = $skill), 
					$cell_statement, 
					$row_skill_index
				)
				ON DUPLICATE KEY UPDATE
					spect_skill_id = VALUES(spect_skill_id),
					cell_statement = VALUES(cell_statement)
				;

			SET $row_skill_index = $row_skill_index + 1;

		END WHILE;

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


DROP PROCEDURE IF EXISTS $BALANCE_QUESTIONS;
CREATE PROCEDURE $BALANCE_QUESTIONS(IN $quiz_id INT, IN $questions_length INT)
	BEGIN
		DELETE FROM
			quiz_question
			WHERE quiz_id = $quiz_id AND position > $questions_length;
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
		INSERT INTO
		quiz_question (quiz_id, question_id, position, correct_answer_index)
		VALUES
		($quiz_id, (SELECT id FROM question WHERE statement = $question_statement), $position, $correct_answer_index)
		ON DUPLICATE KEY UPDATE 
			question_id = VALUES(question_id),
			correct_answer_index = VALUES(correct_answer_index)
		;
	END;

CREATE PROCEDURE $SAVE_ANSWER(IN $answer VARCHAR(255), IN $teacher_id INT, IN $creation_date DATETIME) 
	BEGIN
		INSERT IGNORE INTO
		answer (statement, teacher_id, creation_date)
		VALUES
		($answer, $teacher_id, $creation_date);
	END;

DROP PROCEDURE IF EXISTS $BALANCE_ANSWERS;
CREATE PROCEDURE $BALANCE_ANSWERS(IN $quiz_question_id INT, IN $answers_length INT)
	BEGIN
		DELETE FROM
			quiz_question_answer
			WHERE quiz_question_id = $quiz_question_id AND position > $answers_length;
	END;

CREATE PROCEDURE $SAVE_QUIZ_QUESTION_ANSWER(IN $quiz_question_id INT, IN $answer_statement VARCHAR(255), $position INT)
	BEGIN
		INSERT INTO
			quiz_question_answer (quiz_question_id, answer_id, position)
			VALUES
			($quiz_question_id, (SELECT id FROM answer WHERE statement = $answer_statement), $position)
			ON DUPLICATE KEY UPDATE 
				answer_id = VALUES(answer_id)
				;
	END;

CREATE PROCEDURE $PROCESS_ANSWERS( IN $quiz_id INT, IN $teacher_id INT, IN $creation_date DATETIME, IN $quiz_question_id INT, IN $answers JSON)
	BEGIN
		DECLARE $answers_length INT DEFAULT 0;
		DECLARE $answers_index INT DEFAULT 0;
		DECLARE $answer_statement VARCHAR(255);

		SET $answers_length = JSON_LENGTH($answers);
		SET $answers_index = 0;

		CALL $BALANCE_ANSWERS($quiz_question_id, $answers_length);

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
		DECLARE $answers_length INT DEFAULT 0;
		DECLARE $correct_answer_index INT DEFAULT -1;
		DECLARE $quiz_question_id INT;

		SET $questions_length = JSON_LENGTH($questions);
		SET $questions_index = 0;

		CALL $BALANCE_QUESTIONS($quiz_id, $questions_length);

		WHILE $questions_index < $questions_length DO

			SET $question_item = JSON_EXTRACT($questions, CONCAT('$[', $questions_index, ']'));

			SET $question_statement = JSON_UNQUOTE(JSON_EXTRACT($question_item, '$.question'));
			SET $answers = JSON_EXTRACT($question_item, '$.answers');
			SET $answers_length = JSON_LENGTH($answers);
			SET $correct_answer_index = JSON_EXTRACT($question_item, '$.correct_answer_index');
			
			IF $correct_answer_index > ($answers_length - 1) THEN
				SET $correct_answer_index = -1;
			END IF;

			CALL $SAVE_QUESTION($question_statement, $teacher_id, $creation_date);

			CALL $SAVE_QUIZ_QUESTION($quiz_id, $question_statement, $questions_index + 1, $correct_answer_index);

			SET $quiz_question_id = Get_Quiz_Question_ID($quiz_id, $questions_index + 1);

			CALL $PROCESS_ANSWERS($quiz_id, $teacher_id, $creation_date, $quiz_question_id, $answers);

			SET $questions_index = $questions_index + 1;

		END WHILE;

	
	END;
	
DROP PROCEDURE IF EXISTS $PROCESS_QUIZ;
CREATE PROCEDURE $PROCESS_QUIZ(IN $teacher_id INT, IN $quiz_uuid CHAR(36), IN $creation_date DATETIME, IN $quiz_data JSON)
  BEGIN 
    DECLARE $subject_statement VARCHAR(255);
    DECLARE $subject_id INT;
    DECLARE $quiz_title VARCHAR(255);
    DECLARE $quiz_id INT;

    DECLARE $quiz_skills JSON;
    DECLARE $spect_items JSON;
    DECLARE $question_items JSON;

    
    SET $quiz_title = JSON_UNQUOTE(JSON_EXTRACT($quiz_data, '$.quiz_title'));
    SET $subject_statement = JSON_UNQUOTE(JSON_EXTRACT($quiz_data, '$.quiz_subject'));
    
    CALL $SAVE_SPECT_SUBJECT ($subject_statement, $teacher_id, $creation_date);
    CALL $SAVE_QUIZ_METADATA($quiz_uuid, $subject_statement, $teacher_id, $quiz_title, $creation_date);
		

    SET $quiz_id = Get_Quiz_ID($quiz_title, $teacher_id, $creation_date);
	

    SET $quiz_skills = JSON_EXTRACT($quiz_data, '$.specifications_table.quiz_skills');
    CALL $PROCESS_SKILLS($quiz_id, $teacher_id, $creation_date, $quiz_skills);

    SET $spect_items = JSON_EXTRACT($quiz_data, '$.specifications_table.items');
    CALL $PROCESS_SPECTIFICATIONS_TABLE($quiz_id, $teacher_id, $creation_date, $spect_items, $quiz_skills);

    SET $question_items = JSON_EXTRACT($quiz_data, '$.questions');
    CALL $PROCESS_QUESTIONS($quiz_id, $teacher_id, $creation_date, $question_items);

    
  END;

DROP PROCEDURE IF EXISTS $SAVE_QUIZ;
CREATE PROCEDURE $SAVE_QUIZ(IN $teacher_id INT, IN $quiz_data JSON) 
	BEGIN
		DECLARE $quiz_uuid CHAR(36);
		DECLARE $creation_date DATETIME;

		SET $quiz_uuid = UUID();
		SET $creation_date = NOW();

		CALL $PROCESS_QUIZ($teacher_id, $quiz_uuid, $creation_date, $quiz_data);
		SELECT $quiz_uuid AS quiz_uuid;
	END;

DROP PROCEDURE IF EXISTS $UPDATE_QUIZ;
CREATE PROCEDURE $UPDATE_QUIZ(IN $teacher_id INT, IN $quiz_uuid CHAR(36), IN $creation_date DATETIME, IN $quiz_data JSON)
	BEGIN
		CALL $PROCESS_QUIZ($teacher_id, $quiz_uuid, $creation_date, $quiz_data);
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
		END AS creation_date,
		quiz.teacher_id
	FROM quiz
	JOIN spect_subject ON spect_subject.id = quiz.spect_subject_id
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
		END AS creation_date,
		quiz.teacher_id
	FROM quiz
	JOIN spect_subject ON spect_subject.id = quiz.spect_subject_id
	JOIN quiz_performed ON quiz_performed.quiz_id = quiz.id
	ORDER BY quiz_performed.creation_date DESC;

CREATE PROCEDURE $GET_QUIZZES(IN $teacher_id INT)
	BEGIN
		SELECT uuid, title, subject, creation_date FROM drafts WHERE teacher_id = $teacher_id;

		SELECT title, subject, google_form_id, google_form_url, creation_date FROM performed WHERE teacher_id = $teacher_id;

	END;


CREATE PROCEDURE $SAVE_PERFORMED_QUIZ(
    IN $quiz_uuid CHAR(36), 
    IN $google_form_id VARCHAR(255), 
    IN $google_form_url VARCHAR(255)
)
	BEGIN
		DECLARE $success BOOLEAN DEFAULT FALSE;
		DECLARE $error_message VARCHAR(255) DEFAULT NULL;

		DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
		BEGIN
			-- Manejo de errores
			SET $success = FALSE;
			SET $error_message = IFNULL($error_message, 'Error inesperado al ejecutar el procedimiento.');
			ROLLBACK;
			SELECT $success AS success, $error_message AS error_message;
		END;

		-- Iniciar transacción
		START TRANSACTION;
		
		INSERT IGNORE INTO quiz_performed (quiz_id, google_form_id, google_form_url, creation_date)
		VALUES ((SELECT id FROM quiz WHERE uuid = $quiz_uuid), $google_form_id, $google_form_url, NOW());

		IF ROW_COUNT() = 0 THEN
			SET $error_message = 'No se realizó la inserción debido a un conflicto de datos.';
			SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = $error_message;
		END IF;

		-- Confirmar transacción
		SET $success = TRUE;
		SET $error_message = NULL;

		COMMIT;

		SELECT $success AS success, $error_message AS error_message;
	END;



CREATE PROCEDURE $SAVE_TEACHER(
	IN $google_id VARCHAR(255),
	IN $email VARCHAR(255), 
	IN $name VARCHAR(255), 
	IN $last_name VARCHAR(255), 
	IN $refresh_token TEXT
 )
	BEGIN
		DECLARE $success BOOLEAN DEFAULT FALSE;
    	DECLARE $teacher_id INT DEFAULT NULL;
		DECLARE $error_message VARCHAR(255) DEFAULT NULL;

		-- Declarar un manejador para errores SQL
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
      BEGIN
        -- Capturar el mensaje de error
        GET DIAGNOSTICS CONDITION 1 $error_message = MESSAGE_TEXT;

        SELECT $success AS success, $teacher_id AS teacher_id, $error_message AS error_message;

        ROLLBACK;
      END;

		START TRANSACTION;

			INSERT INTO teacher (google_id, email, name, last_name, refresh_token)
			VALUES ( $google_id, $email, $name, $last_name, $refresh_token)
			ON DUPLICATE KEY UPDATE
				refresh_token = VALUES(refresh_token);

			IF ROW_COUNT() = 0 THEN
				SET $error_message = 'No se realizó la inserción debido a un conflicto de datos.';
				SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = $error_message;
			END IF;

			-- Confirmar transacción
			SET $success = TRUE;

			SELECT id INTO $teacher_id FROM teacher WHERE google_id = $google_id;

		COMMIT;

		

		SELECT $success AS success, $teacher_id AS teacher_id, $error_message AS error_message;

	END;


DROP PROCEDURE IF EXISTS $SAVE_QUIZ_PERFORMED_RESULTS;
CREATE PROCEDURE $SAVE_QUIZ_PERFORMED_RESULTS(IN $google_form_id VARCHAR(255), IN $student_emails JSON, IN $responses JSON)
	BEGIN
		DECLARE $success BOOLEAN DEFAULT FALSE;
		DECLARE $error_message VARCHAR(255) DEFAULT NULL;

		DECLARE $quiz_id INT DEFAULT NULL;
		DECLARE $student_emails_length INT DEFAULT 0;
		DECLARE $student_emails_index INT DEFAULT 0;
		DECLARE $student_email VARCHAR(255);
		DECLARE $response_item JSON;
		DECLARE $response_date DATETIME;
		DECLARE $results_map JSON;
		DECLARE $results_map_length INT DEFAULT 0;
		DECLARE $results_map_index INT DEFAULT 0;
		DECLARE $quiz_performed_id INT DEFAULT NULL;
		DECLARE $student_id INT DEFAULT NULL;
		DECLARE $question_position INT;
		DECLARE $answer_value VARCHAR(255);

		-- Declarar un manejador para errores SQL
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
			-- Capturar el mensaje de error
			GET DIAGNOSTICS CONDITION 1 $error_message = MESSAGE_TEXT;

			SELECT $success AS success, $error_message AS error_message;

			ROLLBACK;
		END;

		START TRANSACTION;

		SELECT quiz_id INTO $quiz_id FROM quiz_performed WHERE google_form_id = $google_form_id;

		SET $student_emails_length = JSON_LENGTH($student_emails);

		WHILE $student_emails_index < $student_emails_length DO

			SET $student_email = JSON_UNQUOTE(JSON_EXTRACT($student_emails, CONCAT('$[', $student_emails_index, ']')));

			INSERT IGNORE INTO student (email) VALUES ($student_email);

			SET $response_item = JSON_UNQUOTE(JSON_EXTRACT($responses, CONCAT('$."', $student_email, '"')));
			SET $response_date = JSON_UNQUOTE(JSON_EXTRACT($response_item, '$.response_date'));

			SELECT id INTO $quiz_performed_id FROM quiz_performed WHERE google_form_id = $google_form_id;
			SELECT id INTO $student_id FROM student WHERE email = $student_email;

			INSERT IGNORE INTO quiz_performed_response (quiz_performed_id, student_id, submitted_date)
				VALUES ($quiz_performed_id, $student_id, $response_date);

			SET $results_map = JSON_EXTRACT($response_item, '$.results');

			SET $results_map_length = JSON_LENGTH($results_map);
			SET $results_map_index = 0;

			WHILE $results_map_index < $results_map_length DO

				SET $question_position = JSON_UNQUOTE(JSON_EXTRACT($results_map, CONCAT('$[', $results_map_index, '].question_position')));
				SET $answer_value = JSON_UNQUOTE(JSON_EXTRACT($results_map, CONCAT('$[', $results_map_index, '].answer_value')));

				INSERT IGNORE INTO quiz_performed_response_result (quiz_performed_response_id, quiz_question_answer_id)
				VALUES(
						(SELECT id FROM quiz_performed_response WHERE quiz_performed_id = $quiz_performed_id AND student_id = $student_id),

						(
							SELECT id FROM quiz_question_answer 
							WHERE quiz_question_id = (SELECT id FROM quiz_question WHERE quiz_id = $quiz_id AND position = $question_position) 
							AND answer_id = (SELECT id FROM answer WHERE statement = $answer_value)
						)
						);


				SET $results_map_index = $results_map_index + 1;

			END WHILE;

			SET $student_emails_index = $student_emails_index + 1;

		END WHILE;

		-- Confirmar transacción
		SET $success = TRUE;
		SET $error_message = NULL;

		COMMIT;

		SELECT $success AS success, $error_message AS error_message;
	END;