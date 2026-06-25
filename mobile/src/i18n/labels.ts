/**
 * STOPGAP name resolver for seeded rows (which carry a nameKey, empty display name).
 * Replaced by the i18next bundles in Phase 11 (task 199); the API stays the same so
 * call sites won't change.
 */
const LABELS_EN: Record<string, string> = {
  acc_cash: 'Cash',
  acc_card: 'Card',
  acc_savings: 'Savings',
  cat_food: 'Food',
  cat_groceries: 'Groceries',
  cat_transport: 'Transport',
  cat_housing: 'Housing',
  cat_bills: 'Bills',
  cat_fun: 'Entertainment',
  cat_clothing: 'Clothing',
  cat_health: 'Health',
  cat_education: 'Education',
  cat_gifts: 'Gifts',
  cat_travel: 'Travel',
  cat_other_exp: 'Other',
  cat_salary: 'Salary',
  cat_gift_in: 'Gift',
  cat_other_inc: 'Other',
};

/** Resolve a display name: explicit name wins, else the nameKey label, else the key. */
export function resolveName(nameKey: string | null, name: string): string {
  if (name) return name;
  if (nameKey && LABELS_EN[nameKey]) return LABELS_EN[nameKey];
  return nameKey ?? '';
}
