import express from "express";
import Report_Status from "../../util/report_status.js";
import type { Quiz } from "@QuizTypes";
import { Execute_Query, Close_Pool } from "../database/db.js";

const router = express.Router();

router.post("/save", async (request, response) => {
	try {
		const quiz_data: Quiz = request.body;
		const query = /*sql*/ ` CALL $PROCESS_QUIZ(?) `;

		await Execute_Query(query, [JSON.stringify(quiz_data)]);
		const message = "Quiz '" + quiz_data.quiz_title + "' guardado con exito";
		Report_Status("success", message);
		return response.status(200).send({ message });
	} catch (error) {
		console.error(error);
		return response.status(400).send({ message: "Error al procesar los datos" });
	}
	finally {
		await Close_Pool();
	}
});

export default router;
