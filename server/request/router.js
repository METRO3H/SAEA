
import express from "express";
import create_form from "./create_form.js"

const router = express.Router()

router.use("/create_form", create_form)

export default router