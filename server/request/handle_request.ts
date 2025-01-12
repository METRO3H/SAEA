
import express from "express";

export async function Process_Request(response: express.Response, Handler: () => Promise<void>) {
    try {
 
       await Handler();
 
    } catch (error) {
       console.error(error);
       response.status(400).send({ message: "Error al procesar los datos" });
    }
 }