import type { Migration } from '../migrator';
import { migration0001 } from './0001_init';

/** Ordered list of all schema migrations. Append new versions here. */
export const migrations: Migration[] = [migration0001];
