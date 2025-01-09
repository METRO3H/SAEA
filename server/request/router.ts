import express from "express";
import Process_Quiz from "./process_quiz";

const router = express.Router();

router.use("/quiz", Process_Quiz);


export default router;
