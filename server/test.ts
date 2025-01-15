import { Execute_Query, Close_Pool } from "./database/db";

const quiz_uuid = "608100b4-cf11-11ef-a393-0242ac120002"
const query = /*sql*/ `CALL $GET_QUIZ(?)`;

const result:any = await Execute_Query(query, [quiz_uuid]);
const [[quiz]] = result;
console.log(quiz);

await Close_Pool();