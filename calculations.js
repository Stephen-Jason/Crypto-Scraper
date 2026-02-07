// RSI State Classification
// Add per timeframe
export function rsiState(rsi) {
  if (!Number.isFinite(rsi)) return "neutral";
  if (rsi >= 70) return "overbought";
  if (rsi <= 30) return "oversold";
  if (rsi >= 60) return "bullish";
  if (rsi <= 40) return "bearish";
  return "neutral";
}

// Multi-Timeframe Confluence (alpha signal). Single RSI is weak.
// Agreement across timeframes = power. Example: Oversold Confluence
// 0 → noise 2+ → potential setup 4 → 🔥 extreme condition
export function oversoldConfluence(rsiValues) {
  return rsiValues.filter((rsi) => Number.isFinite(rsi) && rsi <= 30).length;
}

// Momentum Direction (RSI slope)
export function momentum(short, long) {
  if (short > long) return "rising";
  if (short < long) return "falling";
  return "flat";
}

// RSI Compression / Expansion (volatility proxy)
// rsiRange < 5 → compression (coiling)
// rsiRange > 20 → expansion (trend in play)
export function rsiVolatility(rsiValues) {
  const numericValues = rsiValues.filter((rsi) => Number.isFinite(rsi));
  if (numericValues.length === 0) {
    return 0;
  }

  return Math.max(...numericValues) - Math.min(...numericValues);
}

// Trend Bias Score
export function biasScore(rsi) {
  if (!Number.isFinite(rsi)) return 0;
  if (rsi >= 70) return 2;
  if (rsi >= 60) return 1;
  if (rsi <= 30) return -2;
  if (rsi <= 40) return -1;
  return 0;
}

// Reversal Candidates
// We define this
export function reversalCandidate(rsi_15m, rsi_1h, rsi_4h, rsi_24h) {
  if (![rsi_15m, rsi_1h, rsi_4h, rsi_24h].every(Number.isFinite)) {
    return false;
  }
  return rsi_24h <= 35 && rsi_1h > rsi_4h && rsi_15m > rsi_1h;
}

// Normalized RSI Score (for charts)
// Convert RSI into -1 → 1 scale
export function normalizeRSI(rsi) {
  if (!Number.isFinite(rsi)) return 0;
  return (rsi - 50) / 50;
}
