import { addDays, addMonths, dayKey, daysInMonth, startOfDay, startOfMonth } from '../dates';

describe('date helpers', () => {
  const ref = new Date(2025, 5, 15, 13, 30, 0).getTime(); // 15 Jun 2025, 13:30 local

  it('startOfDay zeroes the time', () => {
    const d = new Date(startOfDay(ref));
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
    expect(d.getDate()).toBe(15);
  });

  it('startOfMonth returns day 1 at midnight', () => {
    const d = new Date(startOfMonth(ref));
    expect(d.getDate()).toBe(1);
    expect(d.getMonth()).toBe(5);
    expect(d.getHours()).toBe(0);
  });

  it('addMonths and addDays shift correctly', () => {
    expect(new Date(addMonths(startOfMonth(ref), 1)).getMonth()).toBe(6);
    expect(new Date(addDays(startOfDay(ref), 1)).getDate()).toBe(16);
  });

  it('daysInMonth knows month lengths', () => {
    expect(daysInMonth(new Date(2025, 1, 1).getTime())).toBe(28); // Feb 2025
    expect(daysInMonth(new Date(2024, 1, 1).getTime())).toBe(29); // Feb 2024 (leap)
    expect(daysInMonth(new Date(2025, 5, 1).getTime())).toBe(30); // Jun
  });

  it('dayKey is stable per calendar day', () => {
    expect(dayKey(ref)).toBe('2025-06-15');
    expect(dayKey(startOfDay(ref))).toBe(dayKey(ref));
  });
});
