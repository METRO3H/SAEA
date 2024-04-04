import chalk from "chalk";

export default function Report_Status(status, message) {
  switch (status) {
    case "status":
      console.log(chalk.magenta(`[Status]`), message);
      break;

    case "success":
      console.log(chalk.green(`[Status]`, message));
      break;

    case "error":
      console.log(chalk.red(`[Status]`, message));
      break;
    default:
      console.log("Status no encontrado");
      break;
  }

  return;
}
