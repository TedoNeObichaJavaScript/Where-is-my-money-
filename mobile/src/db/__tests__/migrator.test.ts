import { runMigrations } from '../migrator';

function fakeDb() {
  let userVersion = 0;
  const exec: string[] = [];
  const db = {
    getFirstAsync: async (sql: string) =>
      sql.includes('user_version') ? { user_version: userVersion } : null,
    execAsync: async (sql: string) => {
      const m = sql.match(/PRAGMA user_version = (\d+)/);
      if (m) userVersion = Number(m[1]);
      else exec.push(sql);
    },
    withTransactionAsync: async (fn: () => Promise<void>) => {
      await fn();
    },
  };
  return { db, exec, version: () => userVersion };
}

describe('migration runner', () => {
  it('applies schema v1 once and is idempotent on re-run', async () => {
    const f = fakeDb();

    await runMigrations(f.db as any);
    expect(f.version()).toBe(1);
    expect(f.exec.filter((s) => s.includes('CREATE TABLE')).length).toBe(4);

    const before = f.exec.length;

    await runMigrations(f.db as any);
    expect(f.exec.length).toBe(before);
  });
});
