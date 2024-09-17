/* GET title, subject*/
SELECT
    test.title as test_title,
    subject.text AS test_subject
FROM
    test
    JOIN subject ON subject.id = test.subject_id
WHERE
    unique_id = "aa5abb81-e7b4-4870-868e-bb598a8cd676";

/* GET skills */
SELECT
    question_skill.text AS skill,
    specifications_table_skill.position AS "index"
FROM
    test
    JOIN specifications_table ON specifications_table.test_id = test.id
    JOIN specifications_table_skill ON specifications_table_skill.specifications_table_id = specifications_table.id
    JOIN question_skill ON question_skill.id = specifications_table_skill.question_skill_id
WHERE
    unique_id = "aa5abb81-e7b4-4870-868e-bb598a8cd676"
GROUP BY
    position;

/* GET table_data */
SELECT
    question_thematic_area.text AS thematic_area,
    question_content_area.text AS content,
    question_objetive.text as objetive,
    specifications_table.performed_classes,
    specifications_table_skill.position AS skill_index,
    specifications_table_skill.questions_range AS skill_content
FROM
    test
    JOIN specifications_table ON specifications_table.test_id = test.id
    JOIN question_thematic_area ON question_thematic_area.id = specifications_table.thematic_area_id
    JOIN question_content_area ON question_content_area.id = specifications_table.content_id
    JOIN question_objetive ON question_objetive.id = specifications_table.objective_id
    JOIN specifications_table_skill ON specifications_table_skill.specifications_table_id = specifications_table.id
WHERE
    Test.unique_id = "9d798821-c8f3-4a55-8efb-d160e301879b";

/*GET questions*/
SELECT
    *
FROM