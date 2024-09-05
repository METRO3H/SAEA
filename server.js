import express from "express";
import { handler as ssrHandler } from "./dist/server/entry.mjs";
import bodyParser from "body-parser";
import router from "./server/request/router.js";
import chalk from "chalk";
import Report_Status from "./util/report_status.js";
import cors from "cors"
const app = express();
// Change this based on your astro.config.mjs, `base` option.
// They should match. The default value is "/".
// const base = "/";
// app.use(base, express.static("dist/client"));
// app.use(ssrHandler);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())


app.use("/request", router);

app.listen(8080, () => {
  
  console.log(
    chalk.bgGreen.hex("#ffffff")("\n Server "),
    chalk.whiteBright("Listening on"),
    chalk.blueBright("http://localhost:8080/")
  );
  Report_Status("divider")
});
