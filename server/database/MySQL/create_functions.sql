--  Con privilegios de root

DROP FUNCTION IF EXISTS Get_Quiz_ID;
DROP FUNCTION IF EXISTS Get_Quiz_Question_ID;
DROP FUNCTION IF EXISTS Get_Quiz_All_Draft;
DROP FUNCTION IF EXISTS Get_Quiz_All_Performed;
DROP FUNCTION IF EXISTS Get_Quiz_All;

CREATE FUNCTION Get_Quiz_ID($quiz_title VARCHAR(255), $teacher_id INT, $creation_date DATETIME) RETURNS INT READS SQL DATA
BEGIN
    DECLARE $quiz_id INT;
    SET $quiz_id = -1;

    SELECT id INTO $quiz_id FROM quiz WHERE title = $quiz_title AND teacher_id = $teacher_id AND creation_date = $creation_date;
    
    RETURN $quiz_id;
END;

CREATE FUNCTION Get_Quiz_Question_ID($quiz_id INT, $position INT) RETURNS INT READS SQL DATA
BEGIN
    DECLARE $quiz_question_id INT;
    SET $quiz_question_id = -1;

    SELECT id INTO $quiz_question_id FROM quiz_question WHERE quiz_id = $quiz_id AND position = $position;
    
    RETURN $quiz_question_id;
END;


DROP FUNCTION IF EXISTS Get_Quiz_Metadata;

CREATE FUNCTION Get_Quiz_Metadata($quiz_uuid VARCHAR(36)) RETURNS JSON READS SQL DATA
	BEGIN
        DECLARE $quiz_metadata JSON;
            SELECT 
                JSON_OBJECT(
                    'uuid', quiz.uuid,
                    'title', quiz.title,
                    'subject', spect_subject.statement,
                    'teacher_id', quiz.teacher_id,
                    'creation_date', quiz.creation_date 
                ) AS quiz_metadata
            INTO $quiz_metadata
            FROM quiz
            JOIN spect_subject ON spect_subject.id = quiz.spect_subject_id
            WHERE quiz.uuid = $quiz_uuid
            LIMIT 1;

            RETURN $quiz_metadata;
	END;

DROP FUNCTION IF EXISTS Get_Quiz_Skills;
CREATE FUNCTION Get_Quiz_Skills($quiz_uuid VARCHAR(36)) RETURNS JSON READS SQL DATA
	BEGIN
        DECLARE $quiz_skills JSON;

            SELECT 
            JSON_ARRAYAGG(skill) AS quiz_skills
            INTO $quiz_skills
            FROM (
                SELECT spect_skill.statement AS skill, column_position
                
                FROM quiz
                JOIN specifications_table ON specifications_table.quiz_id = quiz.id
                JOIN specifications_table_skill ON specifications_table_skill.specifications_table_id = specifications_table.id
                JOIN spect_skill ON spect_skill.id = specifications_table_skill.spect_skill_id
                WHERE quiz.uuid = $quiz_uuid
                GROUP BY column_position, spect_skill.statement
            ) AS quiz_skills;

        RETURN $quiz_skills;
    END;


DROP FUNCTION IF EXISTS Get_Spect_Items;
CREATE FUNCTION Get_Spect_Items($quiz_uuid VARCHAR(36)) RETURNS JSON READS SQL DATA
	BEGIN
        DECLARE $quiz_items JSON;

        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'row_position', row_position,
                    'thematic_area', thematic_area,
                    'content', content,
                    'objective', objective,
                    'performed_classes', performed_classes,
                    'row_skills', cell_statement
                )
            )
        INTO $quiz_items
        FROM (
                SELECT
                    specifications_table.row_position,
                    spect_thematic_area.statement AS thematic_area,
                    spect_content.statement AS content,
                    spect_objective.statement AS objective,
                    specifications_table.performed_classes,
                    JSON_ARRAYAGG(cell_statement) AS cell_statement
                FROM quiz
                JOIN specifications_table ON specifications_table.quiz_id = quiz.id
                JOIN spect_thematic_area ON spect_thematic_area.id = specifications_table.thematic_area_id
                JOIN spect_content ON spect_content.id = specifications_table.content_id
                JOIN spect_objective ON spect_objective.id = specifications_table.objective_id
                JOIN specifications_table_skill ON specifications_table_skill.specifications_table_id = specifications_table.id
                WHERE quiz.uuid = $quiz_uuid
                GROUP BY row_position, thematic_area, content, objective, performed_classes
            ) AS spect_items;  
            

        RETURN $quiz_items;
    END;



DROP FUNCTION IF EXISTS Get_Questions;
CREATE FUNCTION Get_Questions($quiz_uuid VARCHAR(36)) RETURNS JSON READS SQL DATA
	BEGIN
        DECLARE $quiz_questions JSON;

        SELECT
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'question', question,
                    'question_position', question_position,
                    'answers', answers,
                    'correct_answer_index', correct_answer_index
                )
            )
        INTO $quiz_questions
        FROM
            (
                SELECT 
                    quiz_question.position AS question_position, 
                    question.statement AS question,
                    JSON_ARRAYAGG(answer.statement) AS answers,
                    quiz_question.correct_answer_index
                FROM quiz
                JOIN quiz_question ON quiz_question.quiz_id = quiz.id
                JOIN question ON question.id = quiz_question.question_id
                JOIN quiz_question_answer ON quiz_question_answer.quiz_question_id = quiz_question.id
                JOIN answer ON answer.id = quiz_question_answer.answer_id
                WHERE quiz.uuid = $quiz_uuid
                GROUP BY question_position, question, correct_answer_index
                ORDER BY question_position ASC
            ) AS quiz_question_answers;      

        RETURN $quiz_questions;
    END; 


-- GET QUIZ


DROP FUNCTION IF EXISTS Get_Quiz;

CREATE FUNCTION Get_Quiz($quiz_uuid VARCHAR(36)) RETURNS JSON READS SQL DATA
	BEGIN
		DECLARE $quiz_data JSON;

		DECLARE $quiz_metadata JSON;
		DECLARE $quiz_title VARCHAR(255);
		DECLARE $quiz_subject VARCHAR(255);
		DECLARE $creation_date VARCHAR(255);
		
		DECLARE $quiz_skills JSON;
		DECLARE $spect_items JSON;
		DECLARE $questions JSON;

		SET $quiz_metadata = Get_Quiz_Metadata($quiz_uuid);
		SET $quiz_skills = Get_Quiz_Skills($quiz_uuid);
		SET $spect_items = Get_Spect_Items($quiz_uuid);
		SET $questions = Get_Questions($quiz_uuid);

		SET $quiz_title = JSON_UNQUOTE(JSON_EXTRACT($quiz_metadata, '$.title'));
		SET $quiz_subject = JSON_UNQUOTE(JSON_EXTRACT($quiz_metadata, '$.subject'));

		SET $creation_date = JSON_UNQUOTE(JSON_EXTRACT($quiz_metadata, '$.creation_date'));

		SET $quiz_data = JSON_OBJECT(
			'quiz_id', $quiz_uuid,
			'quiz_title', $quiz_title,
			'quiz_subject', $quiz_subject,
			'creation_date', $creation_date,
			'specifications_table', JSON_OBJECT(
				'total_questions', JSON_LENGTH($questions),
				'quiz_skills', $quiz_skills,
				'items', $spect_items
			),
			'questions', $questions
		);

		RETURN $quiz_data;

	END;


DROP FUNCTION IF EXISTS Get_Quiz2Generate;

CREATE FUNCTION Get_Quiz2Generate($quiz_uuid VARCHAR(36)) RETURNS JSON READS SQL DATA
	BEGIN
		DECLARE $quiz_data JSON;

        DECLARE $quiz_metadata JSON;
        DECLARE $quiz_title VARCHAR(255);
        DECLARE $quiz_questions JSON;

        SET $quiz_metadata = Get_Quiz_Metadata($quiz_uuid);
        SET $quiz_title = JSON_UNQUOTE(JSON_EXTRACT($quiz_metadata, '$.title'));
        SET $quiz_questions = Get_Questions($quiz_uuid);

        SET $quiz_data = JSON_OBJECT(
            'quiz_id', $quiz_uuid,
            'quiz_title', $quiz_title,
            'questions', $quiz_questions
        );

        RETURN $quiz_data;
    END;


DROP FUNCTION IF EXISTS GET_QUIZ_RESULT_ONE;
CREATE FUNCTION GET_QUIZ_RESULT_ONE($google_form_id CHAR(255), $student_email VARCHAR(255)) RETURNS JSON READS SQL DATA
	BEGIN

        DECLARE $student_result JSON;

        SELECT 
            JSON_OBJECT(
                'email', $student_email,
                'results', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'question_position', quiz_question.position,
                    'correct_answer_index', quiz_question.correct_answer_index,
                    'response_answer_index', quiz_question_answer.position - 1
                )
            )
        )
        INTO $student_result
        FROM quiz_performed
        JOIN quiz_performed_response ON quiz_performed_response.quiz_performed_id = quiz_performed.id
        JOIN student ON student.id = quiz_performed_response.student_id
        JOIN quiz_performed_response_result ON quiz_performed_response_result.quiz_performed_response_id = quiz_performed_response.id
        JOIN quiz_question_answer ON quiz_question_answer.id = quiz_performed_response_result.quiz_question_answer_id
        JOIN quiz_question ON quiz_question.id = quiz_question_answer.quiz_question_id
        WHERE quiz_performed.google_form_id = $google_form_id AND student.email = $student_email
        ORDER BY quiz_question.position ASC;

        RETURN $student_result;

    END;







