export function addChartSeries(coin) {
  return {
    ...coin,
    rsiArray: [
      coin.rsi.m15,
      coin.rsi.h1,
      coin.rsi.h4,
      coin.rsi.d1,
      coin.rsi.w1,
    ],

    rsiSeries: [
      { tf: "15m", value: coin.rsi.m15 },
      { tf: "1h", value: coin.rsi.h1 },
      { tf: "4h", value: coin.rsi.h4 },
      { tf: "24h", value: coin.rsi.d1 },
      { tf: "7d", value: coin.rsi.w1 },
    ],
  };
}
