
import express from "express";
import Process_Form from "./process_form.js"
import Get_Quiz_All from "./get_quiz_all.js"

const router = express.Router()

router.use("/quiz", Process_Form)
router.use("/get/quiz/all", Get_Quiz_All)

export default router