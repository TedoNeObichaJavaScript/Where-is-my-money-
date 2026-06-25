/** English strings. Keys mirror the Android resource names + seeded nameKeys. */
export const en = {
  // seeded account / category names (resolved from nameKey)
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

  // theme names
  theme_aurora: 'Aurora',
  theme_prism: 'Prism',
  theme_nebula: 'Nebula',

  // home
  home_balance: 'Total balance',
  home_today: 'Today',
  home_month: 'This month',
  home_recent: 'Recent',
  home_seeAll: 'See all',
  home_empty_title: 'Nothing logged yet',
  home_empty_sub: 'Tap the glowing + to add your first transaction.',

  // add
  add_new: 'New transaction',
  add_edit: 'Edit',
  add_expense: 'Expense',
  add_income: 'Income',
  add_category: 'Category',
  add_note: 'Note',
  add_optional: 'Optional',
  add_date: 'Date',
  add_save: 'Add',
  add_saveChanges: 'Save changes',
  add_selectAccount: 'Select account',

  // history
  history_title: 'History',
  history_search: 'Search notes…',
  history_all: 'All',
  history_today: 'Today',
  history_yesterday: 'Yesterday',
  history_empty: 'No transactions yet',
  history_noMatches: 'No matches',

  // analytics
  analytics_income: 'Income',
  analytics_expense: 'Expense',
  analytics_spent: 'Spent',
  analytics_daily: 'Daily spending',
  analytics_top: 'Top categories',
  analytics_noData: 'No data this month',

  // settings
  settings_title: 'Settings',
  settings_security: 'Security',
  settings_biometric: 'Biometric lock',
  settings_appearance: 'Appearance',
  settings_theme: 'Theme',
  settings_language: 'Language',
  settings_currency: 'Display currency',
  settings_auto: 'Auto',
  settings_data: 'Data',
  settings_backup: 'Back up to file',
  settings_restore: 'Restore from file',
  settings_lastBackup: 'Last backup',
  settings_about: 'About',
  settings_version: 'Version',
  settings_privacy: 'Privacy',
  settings_danger: 'Danger zone',
  settings_erase: 'Erase all data',

  // common
  common_undo: 'Undo',
  common_deleted: 'Transaction deleted',
  common_cancel: 'Cancel',
  common_delete: 'Delete',
};

export type Resources = typeof en;
