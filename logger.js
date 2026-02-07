import chalk from "chalk";
import boxen from "boxen";

function buildMessage(title, detail, color) {
  const titleLine = chalk[color].bold(`✅ ${title}\n`);
  const detailLine = chalk.white("Data saved to ") + chalk.cyan.bold(detail);

  return boxen(titleLine + detailLine, {
    padding: 1,
    borderStyle: "round",
    borderColor: color,
  });
}

export function logSuccess(title, detail) {
  console.log(buildMessage(title, detail, "green"));
}

export function logError(title, error) {
  const message =
    chalk.red.bold(`❌ ${title}\n`) + chalk.red(error.message ?? String(error));

  console.log(
    boxen(message, {
      padding: 1,
      borderStyle: "round",
      borderColor: "red",
    }),
  );
}
