import { getDb, type Db } from './connection';

/** Runs `fn` inside a single DB transaction; rolls back if it throws. */
export async function withTxn<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const db = await getDb();
  let result: T;
  await db.withTransactionAsync(async () => {
    result = await fn(db);
  });
  return result!;
}
