import { parseNumber } from "./utils.js";

export function normalizeRaw(raw) {
  const [name, symbol] = raw.name.split("\n");

  const rsi = {
    m15: parseNumber(raw.rsi_15m),
    h1: parseNumber(raw.rsi_1h),
    h4: parseNumber(raw.rsi_4h),
    d1: parseNumber(raw.rsi_24h),
    w1: parseNumber(raw.rsi_7d),
  };

  return {
    id: symbol,
    name,
    symbol,

    rank: Number(raw.rank),
    price: parseNumber(raw.price),
    marketCap: parseNumber(raw.marketCap),
    volume24h: parseNumber(raw.volume24h),

    rsi,
  };
}
