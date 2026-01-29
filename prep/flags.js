export function addFlags(coin) {
  const reversalCandidate =
    coin.rsi.d1 <= 35 &&
    coin.rsi.h1 > coin.rsi.h4 &&
    coin.rsi.m15 > coin.rsi.h1;

  return {
    ...coin,
    flags: {
      reversalCandidate,
    },
  };
}
