/**
 * Money is always integer **minor units** (cents) + a currency code — never a float.
 * Mirrors the Android `Money` value class. The per-currency scale (10^fractionDigits)
 * is derived from Intl so JPY (0 digits) and most currencies (2) are handled correctly.
 */
export type Minor = number;

const scaleCache = new Map<string, number>();

function fractionDigits(currency: string): number {
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
      .maximumFractionDigits;
  } catch {
    return 2;
  }
}

export const Money = {
  /** 10^fractionDigits for the currency (e.g. 100 for EUR, 1 for JPY). */
  scale(currency: string): number {
    let s = scaleCache.get(currency);
    if (s == null) {
      s = Math.pow(10, fractionDigits(currency));
      scaleCache.set(currency, s);
    }
    return s;
  },

  /** Minor units → major decimal number (for display/charts only). */
  toMajor(minor: Minor, currency: string): number {
    return minor / Money.scale(currency);
  },
};
