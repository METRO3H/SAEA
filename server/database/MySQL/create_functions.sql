--  Con privilegios de root

DROP FUNCTION IF EXISTS Get_Quiz_ID;
DROP FUNCTION IF EXISTS Get_Quiz_Question_ID;

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