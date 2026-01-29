import { normalizeRSI } from "./utils.js";

export function addNormalizedRsi(coin) {
  return {
    ...coin,
    normalized: {
      m15: normalizeRSI(coin.rsi.m15),
      h1: normalizeRSI(coin.rsi.h1),
      h4: normalizeRSI(coin.rsi.h4),
      d1: normalizeRSI(coin.rsi.d1),
      w1: normalizeRSI(coin.rsi.w1),
    },
  };
}
