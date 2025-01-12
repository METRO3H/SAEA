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




DROP FUNCTION IF EXISTS Get_Quiz_All_Draft;


CREATE FUNCTION Get_Quiz_All_Draft() RETURNS JSON READS SQL DATA
BEGIN
    DECLARE $quizzes JSON;
    DECLARE $drafts JSON;
    DECLARE $performed JSON;

    SELECT JSON_ARRAYAGG(JSON_OBJECT('uuid', quiz.uuid, 'title', quiz.title, 'subject', spect_subject.statement, 'creation_date', quiz.creation_date)) INTO $drafts
        FROM quiz 
        JOIN spect_subject ON spect_subject.id = quiz.spect_subject_id
        WHERE quiz.teacher_id = 1
        AND NOT EXISTS (SELECT 1 FROM quiz_performed WHERE quiz_performed.quiz_id = quiz.uuid)
        ORDER BY quiz.creation_date DESC;


    SELECT 
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'title', title,
            'subject', statement,
            'google_form_id', google_form_id,
            'google_form_url', google_form_url,
            'creation_date', creation_date
        )
    )
    INTO $performed
        FROM (
            SELECT 
                quiz.uuid, quiz.title, spect_subject.statement, quiz_performed.google_form_id ,quiz_performed.google_form_url, quiz_performed.creation_date
            FROM quiz
            JOIN spect_subject ON spect_subject.id = quiz.spect_subject_id
            JOIN quiz_performed ON quiz_performed.quiz_id = quiz.id
            WHERE quiz.teacher_id = 1
            ORDER BY quiz_performed.creation_date DESC
        ) AS ordered_data;


    RETURN JSON_OBJECT('drafts', $drafts, 'performed', $performed);
END;








