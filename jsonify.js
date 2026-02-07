import * as fs from "fs";
import Papa from "papaparse";
import {
  rsiState,
  momentum,
  oversoldConfluence,
  rsiVolatility,
  biasScore,
  reversalCandidate,
  normalizeRSI,
} from "./calculations.js";
import { logError, logSuccess } from "./logger.js";

const RSI_FIELDS = ["rsi_15m", "rsi_1h", "rsi_4h", "rsi_24h", "rsi_7d"];

const toNumber = (value) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

try {
  const csv = fs.readFileSync("crypto-rsi.csv", "utf8");

  const parsed = Papa.parse(csv, { header: true });

  const cleaned = parsed.data
    .map((row) => {
      const rsiValues = RSI_FIELDS.map((field) => toNumber(row[field]));
      const rsiByField = Object.fromEntries(
        RSI_FIELDS.map((field, index) => [field, rsiValues[index]]),
      );

      const oversold = oversoldConfluence(rsiValues);

      const rsiRange = rsiVolatility(rsiValues);

      const trendBias =
        biasScore(rsiByField.rsi_15m) +
        biasScore(rsiByField.rsi_1h) +
        biasScore(rsiByField.rsi_4h) +
        biasScore(rsiByField.rsi_24h);

      const potentialReversal = reversalCandidate(
        rsiByField.rsi_15m,
        rsiByField.rsi_1h,
        rsiByField.rsi_4h,
        rsiByField.rsi_24h,
      );

      const normalized_24h = normalizeRSI(rsiByField.rsi_24h);
      const normalized_7d = normalizeRSI(rsiByField.rsi_7d);

      return {
        ...row,
        ...rsiByField,
        rsi_1h_state: rsiState(rsiByField.rsi_1h),
        rsi_24h_state: rsiState(rsiByField.rsi_24h),
        oversoldConfluence: oversold,
        momentum_1h_vs_4h: momentum(rsiByField.rsi_1h, rsiByField.rsi_4h),
        momentum_4h_vs_24h: momentum(rsiByField.rsi_4h, rsiByField.rsi_24h),
        isReversalCandidate: potentialReversal,
        rsiRange,
        trendBias,
        normalized_24h,
        normalized_7d,
      };
    })
    .sort((a, b) => a.rsi_24h - b.rsi_24h);

  fs.writeFileSync("crypto-rsi-clean.json", JSON.stringify(cleaned, null, 2));

  logSuccess("BUILD COMPLETE", "crypto-rsi-clean.json");
} catch (error) {
  logError("BUILD FAILED", error);
}
