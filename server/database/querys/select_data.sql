SELECT test.id AS "test_id", test.title AS "test_title", subject.text AS "subject", test.creation_date AS "creation_date"
FROM test 
JOIN subject ON subject.id = test.subject_id 
WHERE test.created_by = 1 
ORDER BY test.creation_date
