import { en } from '../en';
import { bg } from '../bg';

/**
 * EN + BG parity is a structural rule of the project: a string ships in both
 * languages, or it doesn't ship. TypeScript enforces this at compile time
 * (bg is typed as Resources), and this test guards it at runtime too.
 */
describe('i18n parity', () => {
  it('has identical key sets in EN and BG', () => {
    expect(Object.keys(bg).sort()).toEqual(Object.keys(en).sort());
  });

  it('has no empty BG translations', () => {
    const empties = Object.entries(bg)
      .filter(([, value]) => value.length === 0)
      .map(([key]) => key);
    expect(empties).toEqual([]);
  });

  it('keeps interpolation placeholders consistent across languages', () => {
    const placeholders = (s: string) => (s.match(/\{\{(\w+)\}\}/g) ?? []).sort();
    const mismatches = (Object.keys(en) as (keyof typeof en)[]).filter(
      (key) => placeholders(bg[key]).join() !== placeholders(en[key]).join(),
    );
    expect(mismatches).toEqual([]);
  });
});
