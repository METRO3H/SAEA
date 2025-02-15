import express from "express";
import Process_Quiz from "./process_quiz";
import Get_Quiz_All from "./get_quiz_all.ts";
import Get_Quiz_Draft from "./get_quiz_draft.ts";
import Get_Quiz_Performed from "./get_quiz_performed.ts"
import Get_Quiz_Results from "./get_quiz_results.ts"
import Oauth2 from "./oauth2.ts";
const router = express.Router();

router.use("/quiz", Process_Quiz);
router.use("/get/quiz/all", Get_Quiz_All);
router.use("/get/quiz/draft", Get_Quiz_Draft);
router.use("/get/quiz/performed/results", Get_Quiz_Results);
router.use("/get/quiz/performed", Get_Quiz_Performed);
router.use("/oauth2/google", Oauth2)



export default router;
