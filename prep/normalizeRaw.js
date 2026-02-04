import { parseNumber } from "./utils.js";

export function normalizeRaw(raw) {
  const [name, symbol] = raw.name.split("\n");

  const rsi = {
    d1: parseNumber(raw.rsi_24h),
    w1: parseNumber(raw.rsi_7d),
  };

  return {
    id: symbol,
    name,
    symbol,

    price: parseNumber(raw.price),
    marketCap: parseNumber(raw.marketCap),
    volume24h: parseNumber(raw.volume24h),

    rsi,
  };
}
