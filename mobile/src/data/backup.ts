import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { bumpData } from './reactive';
import { getDb } from '@/db/connection';
import { wipeAllData } from '@/db/reset';
import { flags } from '@/storage/flags';
import { settings } from '@/storage/settings';

/** Backup format version — parity with the Android JSON schema. */
export const BACKUP_VERSION = 1;

type Backup = {
  version: number;
  exportedAt: number;
  accounts: unknown[];
  categories: unknown[];
  transactions: unknown[];
  recurringRules: unknown[];
};

/** Export all data to a JSON file and open the share sheet (SAF on Android). */
export async function exportBackup(): Promise<boolean> {
  const db = await getDb();
  const payload: Backup = {
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    accounts: await db.getAllAsync('SELECT * FROM accounts;'),
    categories: await db.getAllAsync('SELECT * FROM categories;'),
    transactions: await db.getAllAsync('SELECT * FROM transactions;'),
    recurringRules: await db.getAllAsync('SELECT * FROM recurring_rules;'),
  };
  const uri = `${FileSystem.cacheDirectory}parite-backup-${payload.exportedAt}.json`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(payload, null, 2));
  settings.setLastBackupAt(payload.exportedAt);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Parite backup' });
  }
  return true;
}

/** REPLACE-mode restore: wipe everything, then load the chosen JSON backup. */
export async function importBackup(): Promise<{ ok: boolean; count?: number; error?: string }> {
  const res = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });
  if (res.canceled || !res.assets?.[0]) return { ok: false };

  let data: Backup;
  try {
    data = JSON.parse(await FileSystem.readAsStringAsync(res.assets[0].uri));
  } catch {
    return { ok: false, error: 'File is not valid JSON.' };
  }
  if (data.version !== BACKUP_VERSION) return { ok: false, error: 'Unsupported backup version.' };

  const db = await getDb();
  await wipeAllData();
  await db.withTransactionAsync(async () => {
    for (const a of data.accounts as Record<string, unknown>[]) {
      await db.runAsync(
        `INSERT INTO accounts (id,name,nameKey,currency,openingMinor,colorHex,emoji,sortOrder,archived)
         VALUES (?,?,?,?,?,?,?,?,?);`,
        ...vals(a, ['id', 'name', 'nameKey', 'currency', 'openingMinor', 'colorHex', 'emoji', 'sortOrder', 'archived']),
      );
    }
    for (const c of data.categories as Record<string, unknown>[]) {
      await db.runAsync(
        `INSERT INTO categories (id,name,nameKey,kind,emoji,colorHex,sortOrder,hidden)
         VALUES (?,?,?,?,?,?,?,?);`,
        ...vals(c, ['id', 'name', 'nameKey', 'kind', 'emoji', 'colorHex', 'sortOrder', 'hidden']),
      );
    }
    for (const r of (data.recurringRules ?? []) as Record<string, unknown>[]) {
      await db.runAsync(
        `INSERT INTO recurring_rules (id,accountId,categoryId,type,amountMinor,currency,freq,intervalCount,startAt,endAt,nextDueAt,note,active)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`,
        ...vals(r, ['id', 'accountId', 'categoryId', 'type', 'amountMinor', 'currency', 'freq', 'intervalCount', 'startAt', 'endAt', 'nextDueAt', 'note', 'active']),
      );
    }
    for (const tx of data.transactions as Record<string, unknown>[]) {
      await db.runAsync(
        `INSERT INTO transactions (id,accountId,categoryId,type,amountMinor,currency,occurredAt,note,recurringRuleId,createdAt)
         VALUES (?,?,?,?,?,?,?,?,?,?);`,
        ...vals(tx, ['id', 'accountId', 'categoryId', 'type', 'amountMinor', 'currency', 'occurredAt', 'note', 'recurringRuleId', 'createdAt']),
      );
    }
  });

  flags.markSeeded();
  bumpData();
  return { ok: true, count: (data.transactions ?? []).length };
}

type SqlArg = string | number | null;
function vals(row: Record<string, unknown>, keys: string[]): SqlArg[] {
  return keys.map((k) => (row[k] ?? null) as SqlArg);
}
