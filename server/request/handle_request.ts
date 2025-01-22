
import express from "express";
import Report_Status from "../../util/report_status";

export async function Process_Request(response: express.Response, Handler: () => Promise<void>) {
    try {
 
       await Handler();
 
    } catch (err) {
       const error = err as Error; 
       response.status(400).send({ message: "Error al procesar los datos" });
       Report_Status("error", error.stack);
       Report_Status("divider");
    }
 }