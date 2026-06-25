/**
 * Tiny calculator for the amount keypad. The display is an expression string like
 * "12+3×2"; evaluate() resolves it with ×÷-before-+− precedence. Money is parsed
 * from the result in major units by the caller.
 */
export type Op = '+' | '-' | '×' | '÷';
const OPS: readonly string[] = ['+', '-', '×', '÷'];

function tokenize(s: string): (number | Op)[] {
  const tokens: (number | Op)[] = [];
  let num = '';
  for (const ch of s) {
    if (OPS.includes(ch)) {
      if (num) {
        tokens.push(Number(num));
        num = '';
      }
      tokens.push(ch as Op);
    } else {
      num += ch;
    }
  }
  if (num) tokens.push(Number(num));
  return tokens;
}

/** Evaluate the expression, or null if empty/invalid. */
export function evaluate(expr: string): number | null {
  const tokens = tokenize(expr.replace(/,/g, '.'));
  if (tokens.length === 0 || typeof tokens[0] !== 'number') return null;

  // pass 1: × ÷
  const p1: (number | Op)[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tk = tokens[i];
    if (tk === '×' || tk === '÷') {
      const prev = p1.pop() as number;
      const next = tokens[++i] as number;
      if (typeof next !== 'number') return null;
      p1.push(tk === '×' ? prev * next : next === 0 ? NaN : prev / next);
    } else {
      p1.push(tk);
    }
  }

  // pass 2: + -
  let acc = p1[0] as number;
  for (let i = 1; i < p1.length; i += 2) {
    const op = p1[i] as Op;
    const n = p1[i + 1] as number;
    if (typeof n !== 'number') break;
    acc = op === '+' ? acc + n : acc - n;
  }
  return Number.isFinite(acc) ? acc : null;
}

/** Apply a key press to the current display string. */
export function applyKey(display: string, key: string): string {
  const last = display.slice(-1);
  switch (key) {
    case 'C':
      return '';
    case '⌫':
      return display.slice(0, -1);
    case '.':
      // only one decimal per number segment
      {
        const seg = display.split(/[+\-×÷]/).pop() ?? '';
        if (seg.includes('.')) return display;
        return display === '' || OPS.includes(last) ? `${display}0.` : `${display}.`;
      }
    default:
      if (OPS.includes(key)) {
        if (display === '') return key === '-' ? '-' : display; // allow leading minus only
        if (OPS.includes(last)) return display.slice(0, -1) + key; // replace trailing op
        return display + key;
      }
      return display + key; // digit
  }
}

export const hasOperator = (display: string): boolean =>
  OPS.some((o) => display.slice(1).includes(o));
