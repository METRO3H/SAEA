DROP PROCEDURE IF EXISTS $PROCESS_QUIZ;
CREATE PROCEDURE $PROCESS_QUIZ(IN $quiz_data JSON, IN $quiz_uuid CHAR(36))
  BEGIN 
    DECLARE $creation_date DATETIME;
    DECLARE $teacher_id INT;
    DECLARE $subject_statement VARCHAR(255);
    DECLARE $subject_id INT;
    DECLARE $quiz_title VARCHAR(255);
    DECLARE $quiz_id INT;

    DECLARE $quiz_skills JSON;
    DECLARE $spect_items JSON;
    DECLARE $question_items JSON;

    SET $creation_date = NOW();
    SET $teacher_id = 1;
    SET $quiz_title = JSON_UNQUOTE(JSON_EXTRACT($quiz_data, '$.quiz_title'));
    SET $subject_statement = JSON_UNQUOTE(JSON_EXTRACT($quiz_data, '$.quiz_subject'));
    
    CALL $SAVE_TEACHER("bob", "esponja", "bob@esponja.cl");
    CALL $SAVE_SPECT_SUBJECT ($subject_statement, $teacher_id, $creation_date);
    CALL $SAVE_QUIZ_METADATA($quiz_uuid, $subject_statement, $teacher_id, $quiz_title, $creation_date);
		
    SET $quiz_id = Get_Quiz_ID($quiz_title, $teacher_id, $creation_date);

    SET $quiz_skills = JSON_EXTRACT($quiz_data, '$.specifications_table.quiz_skills');
    CALL $PROCESS_SKILLS($quiz_id, $teacher_id, $creation_date, $quiz_skills);

    SET $spect_items = JSON_EXTRACT($quiz_data, '$.specifications_table.items');
    CALL $PROCESS_SPECTIFICATIONS_TABLE($quiz_id, $teacher_id, $creation_date, $spect_items, $quiz_skills);

    SET $question_items = JSON_EXTRACT($quiz_data, '$.questions');
    CALL $PROCESS_QUESTIONS($quiz_id, $teacher_id, $creation_date, $question_items);

    
  END