import * as fs from 'fs';
import * as path from 'path';

/**
 * Structural-privacy guard. The app must never make a network call — all data
 * stays on the device. This test scans the source tree and fails if any network
 * primitive is introduced, so the guarantee can't regress unnoticed.
 */
function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '__tests__' || entry.name === 'node_modules') continue;
      out.push(...walk(full));
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const NETWORK =
  /\bfetch\s*\(|\bXMLHttpRequest\b|new\s+WebSocket|new\s+EventSource|from\s+['"]axios['"]|require\(\s*['"]axios['"]\s*\)/;

describe('privacy: no network code in source', () => {
  it('contains no fetch / XHR / WebSocket / axios usage', () => {
    const srcRoot = path.join(__dirname, '..'); // src/
    const appRoot = path.join(srcRoot, '..', 'app');
    const files = [...walk(srcRoot), ...(fs.existsSync(appRoot) ? walk(appRoot) : [])];

    const offenders = files.filter((f) => NETWORK.test(fs.readFileSync(f, 'utf8')));
    expect(offenders.map((f) => path.relative(srcRoot, f))).toEqual([]);
  });
});
