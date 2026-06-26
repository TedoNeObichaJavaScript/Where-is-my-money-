import type { Freq } from './enums';
import type { RecurringRule } from './models';

/** Safety cap on how many occurrences a single rule can post in one catch-up pass. */
const MAX_CATCHUP = 400;

/** Advance a timestamp by one `interval`-sized step of `freq` (calendar-aware). */
export function advance(ms: number, freq: Freq, interval = 1): number {
  const n = Math.max(1, Math.floor(interval));
  const d = new Date(ms);
  switch (freq) {
    case 'DAILY':
      d.setDate(d.getDate() + n);
      break;
    case 'WEEKLY':
      d.setDate(d.getDate() + 7 * n);
      break;
    case 'MONTHLY':
      d.setMonth(d.getMonth() + n);
      break;
    case 'YEARLY':
      d.setFullYear(d.getFullYear() + n);
      break;
  }
  return d.getTime();
}

/** True once a rule's next occurrence has passed its (optional) end date. */
export function isExhausted(rule: RecurringRule, nextDueAt = rule.nextDueAt): boolean {
  return rule.endAt != null && nextDueAt > rule.endAt;
}

/**
 * Occurrence timestamps due at or before `now` (and within endAt), oldest first.
 * These are the transactions a catch-up pass should post. Capped to MAX_CATCHUP.
 */
export function dueOccurrences(rule: RecurringRule, now: number, cap = MAX_CATCHUP): number[] {
  const out: number[] = [];
  let due = rule.nextDueAt;
  while (due <= now && (rule.endAt == null || due <= rule.endAt) && out.length < cap) {
    out.push(due);
    due = advance(due, rule.freq, rule.intervalCount);
  }
  return out;
}

/** The rule's next due timestamp after consuming every occurrence at or before `now`. */
export function nextDueAfter(rule: RecurringRule, now: number, cap = MAX_CATCHUP): number {
  let due = rule.nextDueAt;
  let i = 0;
  while (due <= now && (rule.endAt == null || due <= rule.endAt) && i < cap) {
    due = advance(due, rule.freq, rule.intervalCount);
    i++;
  }
  return due;
}
