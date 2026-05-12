const USD_TO_TSHS = 2600;

/**
 * Convert a USD price string like "$1,500" or "$2,000/day" to TShs.
 * Non-dollar strings (phone numbers, etc.) are returned unchanged.
 */
export function convertPrice(priceStr: string): string {
  if (!priceStr.includes("$")) return priceStr;

  // Match optional leading sign, dollar sign, number, optional suffix like /day or /hr
  return priceStr.replace(/([+-]?)\$([0-9,]+)(\/\w+)?/g, (_, sign, numStr, suffix) => {
    const usdAmount = parseFloat(numStr.replace(/,/g, ""));
    if (isNaN(usdAmount)) return _;
    const tshs = Math.round(usdAmount * USD_TO_TSHS);
    const formatted = tshs.toLocaleString("en-US");
    return `${sign}TShs ${formatted}${suffix ?? ""}`;
  });
}

/** Format a raw USD number to TShs string. */
export function usdToTShs(usdAmount: number, suffix = ""): string {
  const tshs = Math.round(usdAmount * USD_TO_TSHS);
  return `TShs ${tshs.toLocaleString("en-US")}${suffix}`;
}
