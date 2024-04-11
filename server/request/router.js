
import express from "express";
import Create_Form from "./save_form.js"
import Get_Quiz_All from "./get_quiz_all.js"

const router = express.Router()

router.use("/save_form", Create_Form)
router.use("/get/quiz/all", Get_Quiz_All)

export default router