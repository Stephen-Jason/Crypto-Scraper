import fs from "fs";
import chalk from "chalk";
import boxen from "boxen";
import rawData from "../crypto-rsi-clean.json" with { type: "json" };

import { normalizeRaw } from "./normalizeRaw.js";
import { addRsiStates } from "./rsiStates.js";
import { addNormalizedRsi } from "./normalizeRsi.js";
import { addConfluence } from "./confluence.js";
import { addTrendBias } from "./trendBias.js";
import { addChartSeries } from "./chartSeries.js";
import { addFlags } from "./flags.js";

try {
  const prepared = rawData
    .map(normalizeRaw)
    .map(addRsiStates)
    .map(addNormalizedRsi)
    .map(addConfluence)
    .map(addTrendBias)
    .map(addChartSeries)
    .map(addFlags)
    .sort((a, b) => b.trendBias - a.trendBias);

  fs.writeFileSync(
    "../Crypto Dashboard/dashboard/src/coins.json",
    JSON.stringify(prepared, null, 2),
  );
  const message =
    chalk.green.bold("✅ PREP COMPLETE\n") +
    chalk.white("Data prepared, and saved to ") +
    chalk.cyan.bold("data/coins.json");
  console.log(boxen(message, { padding: 1, borderColor: "green" }));
} catch (error) {
  const message =
    chalk.red.bold("❌ PREP FAILED\n") +
    chalk.white("An error occurred during data preparation:\n") +
    chalk.yellow(error.message);
  console.log(boxen(message, { padding: 1, borderColor: "red" }));
}
