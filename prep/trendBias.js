function score(rsi) {
  if (rsi >= 70) return 2;
  if (rsi >= 60) return 1;
  if (rsi <= 30) return -2;
  if (rsi <= 40) return -1;
  return 0;
}

export function addTrendBias(coin) {
  const bias =
    score(coin.rsi.m15) +
    score(coin.rsi.h1) +
    score(coin.rsi.h4) +
    score(coin.rsi.d1);

  return {
    ...coin,
    trendBias: bias,
  };
}
