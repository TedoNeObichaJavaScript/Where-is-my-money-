/**
 * Money is always integer **minor units** (cents) + a currency code — never a float.
 * Mirrors the Android `Money` value class. The per-currency scale (10^fractionDigits)
 * is derived from Intl so JPY (0 digits) and most currencies (2) are handled correctly.
 */
export type Minor = number;

const scaleCache = new Map<string, number>();

function fractionDigits(currency: string): number {
  try {
    return (
      new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions()
        .maximumFractionDigits ?? 2
    );
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

  /** Localized currency string, e.g. format(1840,'EUR','bg') → "18,40 €". */
  format(minor: Minor, currency: string, locale: string): string {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
      Money.toMajor(minor, currency),
    );
  },

  /** Localized number without the currency symbol (for compact chart labels). */
  formatPlain(minor: Minor, currency: string, locale: string): string {
    const digits = Math.log10(Money.scale(currency));
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(Money.toMajor(minor, currency));
  },

  /** Major decimal → minor units (rounded to the currency scale). */
  fromMajor(major: number, currency: string): Minor {
    return Math.round(major * Money.scale(currency));
  },

  /**
   * Parse user input → minor units. Accepts '.' or ',' as the decimal separator
   * and ignores spaces. Returns null on empty/invalid input.
   */
  fromString(input: string, currency: string): Minor | null {
    const norm = input.trim().replace(/\s/g, '').replace(',', '.');
    if (norm === '' || norm === '.') return null;
    const n = Number(norm);
    if (!Number.isFinite(n)) return null;
    return Money.fromMajor(n, currency);
  },
};
