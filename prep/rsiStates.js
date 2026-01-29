export function rsiState(value) {
  if (value >= 70) return "overbought";
  if (value <= 30) return "oversold";
  if (value >= 60) return "bullish";
  if (value <= 40) return "bearish";
  return "neutral";
}

export function addRsiStates(coin) {
  return {
    ...coin,
    rsiStates: {
      m15: rsiState(coin.rsi.m15),
      h1: rsiState(coin.rsi.h1),
      h4: rsiState(coin.rsi.h4),
      d1: rsiState(coin.rsi.d1),
      w1: rsiState(coin.rsi.w1),
    },
  };
}
