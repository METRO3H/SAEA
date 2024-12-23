import express from "express";
import Process_Form from "./process_form.js";
import Get_Quiz_All from "./get_quiz_all.js";
import Get_Quiz_Draft from "./get_quiz_draft.js";
import Get_Quiz_Performed from "./get_quiz_performed.js";
const router = express.Router();

router.use("/quiz", Process_Form);
router.use("/get/quiz/all", Get_Quiz_All);
router.use("/get/quiz/draft", Get_Quiz_Draft);
router.use("/get/quiz/performed", Get_Quiz_Performed);
export default router;
