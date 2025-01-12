import express from "express";
import bodyParser from "body-parser";
import router from "./request/router.js";
import chalk from "chalk";
import Report_Status from "../util/report_status.js";
import cors from "cors";
import { Close_Pool } from "./database/db.js"; // Asegúrate de importar la función de cierre del pool

const app = express();

// Configuración de middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use("/request", router);

// Iniciar el servidor
const PORT = 8080;
const server = app.listen(PORT, () => {
   console.log(
      chalk.bgGreen.hex("#ffffff")("\n Server "),
      chalk.whiteBright("Listening on"),
      chalk.blueBright(`http://localhost:${PORT}/`)
   );
   Report_Status("divider");
});

// Manejador de cierre ordenado
const shutdownHandler = async (signal: string) => {
   console.log(chalk.yellow(`\nRecibida la señal ${signal}. Cerrando el servidor...`));

   // Cerrar el servidor HTTP
   server.close(async () => {
      console.log(chalk.red("Servidor HTTP cerrado."));

      // Cerrar el pool de conexiones
      await Close_Pool();

      console.log(chalk.green("Conexiones de la base de datos cerradas correctamente."));
      
      // Si la señal es SIGUSR2, no terminamos el proceso, dejamos que nodemon lo maneje
      if (signal === "SIGUSR2") {
         console.log(chalk.bgBlue.white("Reinicio gestionado por nodemon."));
         process.kill(process.pid, "SIGUSR2"); // Deja que nodemon haga el reinicio
      } else {
         console.log(chalk.bgRed.white("Proceso terminado."));
         process.exit(0); // Finaliza el proceso correctamente
      }
   });
};

// Escuchar señales del sistema
process.on("SIGINT", shutdownHandler); // Ctrl+C
process.on("SIGTERM", shutdownHandler); // Señal de apagado del sistema
