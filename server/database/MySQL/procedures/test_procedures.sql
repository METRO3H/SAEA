

DROP PROCEDURE IF EXISTS $TEST_PROCEDURE;
CREATE PROCEDURE $TEST_PROCEDURE(IN $quiz_data JSON)
  BEGIN 
    DECLARE $quiz_title VARCHAR(255);

    SET $quiz_title = JSON_UNQUOTE(JSON_EXTRACT($quiz_data, '$.quiz_title'));

    SELECT $quiz_title;


  END;







