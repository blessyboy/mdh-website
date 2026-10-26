export function formatGhs(amountMinor: number) {
  return `GH¢${new Intl.NumberFormat("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amountMinor / 100)}`;
}

export function roomSubtotal(nightlyRateMinor: number, nights: number): number | null {
  if (!Number.isSafeInteger(nightlyRateMinor) || nightlyRateMinor < 0 || !Number.isSafeInteger(nights) || nights < 1) return null;
  const total = nightlyRateMinor * nights;
  return Number.isSafeInteger(total) ? total : null;
}
