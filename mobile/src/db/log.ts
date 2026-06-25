/** Lightweight query logger — first line of SQL + params, dev builds only. */
export function logQuery(sql: string, params?: readonly unknown[]): void {
  if (__DEV__) {
    const head = sql.trim().split('\n')[0];
    // eslint-disable-next-line no-console
    console.warn('[db]', head, params?.length ? params : '');
  }
}
