export function addConfluence(coin) {
  const values = Object.values(coin.rsi);

  return {
    ...coin,
    confluence: {
      oversold: values.filter((v) => v <= 30).length,
      overbought: values.filter((v) => v >= 70).length,
    },
    rsiRange: Math.max(...values) - Math.min(...values),
  };
}
