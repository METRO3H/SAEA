import chalk from "chalk";

export default function Report_Status(status, message) {
  switch (status) {
    case "status":
      console.log(chalk.magentaBright(`[Status]`), chalk.whiteBright(message));
      break;

    case "success":
      console.log(chalk.greenBright(`[Status]`, chalk.whiteBright(message)));
      break;

    case "error":
      console.log(chalk.red(`[Status]`, message));
      break;
    case "divider":
      console.log(
        chalk.grey("--------------------------------------------------------------------")
      );
      break;

    default:
      console.log("Status no encontrado");
      break;
  }

  return;
}
