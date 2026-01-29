export function parseNumber(value) {
  if (value == null) return null;

  return Number(
    value.replace(/[$,%]/g, "").replace(/M/g, "e6").replace(/B/g, "e9").trim(),
  );
}

export function normalizeRSI(value) {
  return (value - 50) / 50;
}
