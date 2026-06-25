import * as SQLite from 'expo-sqlite';
import { getOrCreateDbKey } from './key';
import { runMigrations } from './migrator';

const DB_NAME = 'parite.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function open(): Promise<SQLite.SQLiteDatabase> {
  const key = await getOrCreateDbKey();
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // SQLCipher: the key PRAGMA MUST be the first statement on the connection.
  await db.execAsync(`PRAGMA key = "x'${key}'";`);
  await db.execAsync('PRAGMA foreign_keys = ON;');
  await db.execAsync('PRAGMA journal_mode = WAL;');

  await runMigrations(db);
  return db;
}

/** Lazily opens (and caches) the single encrypted connection. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) dbPromise = open();
  return dbPromise;
}

/** Closes + forgets the connection (e.g. before a destructive restore). */
export async function closeDb(): Promise<void> {
  if (!dbPromise) return;
  const db = await dbPromise;
  await db.closeAsync();
  dbPromise = null;
}

export type Db = SQLite.SQLiteDatabase;
