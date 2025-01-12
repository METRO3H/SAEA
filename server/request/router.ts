import express from "express";
import Process_Quiz from "./process_quiz";
import Get_Quiz_All from "./get_quiz_all.ts";
const router = express.Router();

router.use("/quiz", Process_Quiz);
router.use("/get/quiz/all", Get_Quiz_All);


export default router;
