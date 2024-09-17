
import express from "express";
import Process_Form from "./process_form.js"
import Get_Quiz_All from "./get_quiz_all.js"
import Get_Quiz_Template_One from "./get_quiz_template_one.js"
import Get_Quiz_Performed_One from "./get_quiz_performed_one.js"
const router = express.Router()

router.use("/quiz", Process_Form)
router.use("/get/quiz/all", Get_Quiz_All)
router.use("/get/quiz/template", Get_Quiz_Template_One)
router.use("/get/quiz/performed", Get_Quiz_Performed_One)
export default router