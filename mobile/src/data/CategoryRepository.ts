import { bumpData } from './reactive';
import { getDb } from '@/db/connection';
import { toCategory } from '@/db/mappers';
import { fromBool, type CategoryRow } from '@/db/types';
import type { Category, NewCategory } from '@/domain/models';
import type { CategoryKind } from '@/domain/enums';

export const CategoryRepository = {
  async all(includeHidden = false): Promise<Category[]> {
    const db = await getDb();
    const where = includeHidden ? '' : 'WHERE hidden = 0';
    const rows = await db.getAllAsync<CategoryRow>(
      `SELECT * FROM categories ${where} ORDER BY sortOrder, id;`,
    );
    return rows.map(toCategory);
  },

  async byKind(kind: CategoryKind, includeHidden = false): Promise<Category[]> {
    const db = await getDb();
    const hiddenClause = includeHidden ? '' : 'AND hidden = 0';
    const rows = await db.getAllAsync<CategoryRow>(
      `SELECT * FROM categories WHERE kind = ? ${hiddenClause} ORDER BY sortOrder, id;`,
      kind,
    );
    return rows.map(toCategory);
  },

  async byId(id: number): Promise<Category | null> {
    const db = await getDb();
    const r = await db.getFirstAsync<CategoryRow>('SELECT * FROM categories WHERE id = ?;', id);
    return r ? toCategory(r) : null;
  },

  async create(c: NewCategory): Promise<number> {
    const db = await getDb();
    const res = await db.runAsync(
      `INSERT INTO categories (name,nameKey,kind,emoji,colorHex,sortOrder,hidden)
       VALUES (?,?,?,?,?,?,?);`,
      c.name,
      c.nameKey,
      c.kind,
      c.emoji,
      c.colorHex,
      c.sortOrder,
      fromBool(c.hidden),
    );
    bumpData();
    return res.lastInsertRowId;
  },

  async update(c: Category): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `UPDATE categories SET name=?, nameKey=?, kind=?, emoji=?, colorHex=?, sortOrder=?, hidden=?
       WHERE id=?;`,
      c.name,
      c.nameKey,
      c.kind,
      c.emoji,
      c.colorHex,
      c.sortOrder,
      fromBool(c.hidden),
      c.id,
    );
    bumpData();
  },

  async setHidden(id: number, hidden: boolean): Promise<void> {
    const db = await getDb();
    await db.runAsync('UPDATE categories SET hidden=? WHERE id=?;', fromBool(hidden), id);
    bumpData();
  },
};
