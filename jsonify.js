import * as fs from "fs";
import Papa from "papaparse";
import chalk from "chalk";
import boxen from "boxen";
import {
  rsiState,
  momentum,
  oversoldConfluence,
  rsiVolatility,
  biasScore,
  reversalCandidate,
  normalizeRSI,
} from "./calculations.js";

try {
  const csv = fs.readFileSync("crypto-rsi.csv", "utf8");

  const parsed = Papa.parse(csv, { header: true });

  const cleaned = parsed.data
    .map((row) => {
      const oversold = oversoldConfluence([
        row.rsi_15m,
        row.rsi_1h,
        row.rsi_4h,
        row.rsi_24h,
      ]);

      const rsiRange = rsiVolatility([
        row.rsi_15m,
        row.rsi_1h,
        row.rsi_4h,
        row.rsi_24h,
      ]);

      const trendBias =
        biasScore(row.rsi_15m) +
        biasScore(row.rsi_1h) +
        biasScore(row.rsi_4h) +
        biasScore(row.rsi_24h);

      const potentialReversal = reversalCandidate(
        row.rsi_15m,
        row.rsi_1h,
        row.rsi_4h,
        row.rsi_24h,
      );

      const normalized_24h = normalizeRSI(row.rsi_24h);
      const normalized_7d = normalizeRSI(row.rsi_7d);

      return {
        ...row,
        rsi_15m: row.rsi_15m,
        rsi_1h: row.rsi_1h,
        rsi_4h: row.rsi_4h,
        rsi_24h: row.rsi_24h,
        rsi_7d: row.rsi_7d,
        rsi_1h_state: rsiState(row.rsi_1h),
        rsi_24h_state: rsiState(row.rsi_24h),
        oversoldConfluence: oversold,
        momentum_1h_vs_4h: momentum(row.rsi_1h, row.rsi_4h),
        momentum_4h_vs_24h: momentum(row.rsi_4h, row.rsi_24h),
        isReversalCandidate: potentialReversal,
        rsiRange,
        trendBias,
        normalized_24h,
        normalized_7d,
      };
    })
    .sort((a, b) => a.rsi_24h - b.rsi_24h);

  fs.writeFileSync("crypto-rsi-clean.json", JSON.stringify(cleaned, null, 2));

  const message =
    chalk.green.bold("✅ BUILD COMPLETE\n") +
    chalk.white("Data saved to ") +
    chalk.cyan.bold("crypto-rsi-clean.json");

  console.log(
    boxen(message, {
      padding: 1,
      borderStyle: "round",
      borderColor: "green",
    }),
  );
} catch (error) {
  const message =
    chalk.red.bold("❌ BUILD FAILED\n") + chalk.red(error.message);

  console.log(
    boxen(message, {
      padding: 1,
      borderStyle: "round",
      borderColor: "red",
    }),
  );
}
