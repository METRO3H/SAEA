import { spawnSync } from "node:child_process";

export default function Print_JSON_Table(data) {
  const data_json = JSON.stringify(data);
  spawnSync("nu", ["-c", `${data_json} | get questions | get metadata`], { stdio: "inherit" });
}
