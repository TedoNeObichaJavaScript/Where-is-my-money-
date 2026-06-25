import type { Migration } from '../migrator';

/**
 * Schema v1 — ported 1:1 from the Android Room schema. Booleans are stored as
 * INTEGER 0/1; money as INTEGER minor units; timestamps as INTEGER millis.
 * DDL is appended table-by-table in the steps that follow.
 */
const STATEMENTS: string[] = [];

export const migration0001: Migration = {
  version: 1,
  name: 'init',
  up: async (db) => {
    for (const sql of STATEMENTS) {
      await db.execAsync(sql);
    }
  },
};
