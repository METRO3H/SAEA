
import express from "express";
import create_form from "./save_form.js"

const router = express.Router()

router.use("/save_form", create_form)

export default router