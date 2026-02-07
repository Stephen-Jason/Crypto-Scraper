import test from "node:test";
import assert from "node:assert/strict";

import {
  rsiState,
  oversoldConfluence,
  momentum,
  rsiVolatility,
  biasScore,
  reversalCandidate,
  normalizeRSI,
} from "../calculations.js";

test("rsiState returns neutral for non-numeric inputs", () => {
  assert.equal(rsiState(null), "neutral");
  assert.equal(rsiState(""), "neutral");
});

test("rsiState classifies thresholds correctly", () => {
  assert.equal(rsiState(72), "overbought");
  assert.equal(rsiState(28), "oversold");
  assert.equal(rsiState(65), "bullish");
  assert.equal(rsiState(35), "bearish");
  assert.equal(rsiState(50), "neutral");
});

test("oversoldConfluence counts only numeric oversold values", () => {
  assert.equal(oversoldConfluence([25, 40, "30", null, 20]), 2);
});

test("momentum compares values", () => {
  assert.equal(momentum(55, 50), "rising");
  assert.equal(momentum(45, 50), "falling");
  assert.equal(momentum(50, 50), "flat");
});

test("rsiVolatility returns range or zero when empty", () => {
  assert.equal(rsiVolatility([]), 0);
  assert.equal(rsiVolatility([null, 10, 35, "40"]), 25);
});

test("biasScore returns zero for invalid values", () => {
  assert.equal(biasScore(undefined), 0);
  assert.equal(biasScore(75), 2);
  assert.equal(biasScore(62), 1);
  assert.equal(biasScore(25), -2);
  assert.equal(biasScore(38), -1);
});

test("reversalCandidate requires all numeric inputs", () => {
  assert.equal(reversalCandidate(60, 55, 50, 30), true);
  assert.equal(reversalCandidate(30, 40, null, 33), false);
});

test("normalizeRSI handles invalid data and scales values", () => {
  assert.equal(normalizeRSI(null), 0);
  assert.equal(normalizeRSI(50), 0);
  assert.equal(normalizeRSI(100), 1);
  assert.equal(normalizeRSI(0), -1);
});
