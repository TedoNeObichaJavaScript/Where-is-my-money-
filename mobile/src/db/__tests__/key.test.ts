import { getOrCreateDbKey } from '../key';

const store: Record<string, string> = {};

jest.mock('expo-secure-store', () => ({
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'whenUnlockedThisDeviceOnly',
  getItemAsync: jest.fn(async (k: string) => store[k] ?? null),
  setItemAsync: jest.fn(async (k: string, v: string) => {
    store[k] = v;
  }),
  deleteItemAsync: jest.fn(async (k: string) => {
    delete store[k];
  }),
}));

jest.mock('expo-crypto', () => ({
  getRandomBytes: (n: number) => new Uint8Array(Array.from({ length: n }, (_, i) => (i * 7) % 256)),
}));

describe('db key', () => {
  it('generates a 32-byte (64 hex char) key and reuses it', async () => {
    const a = await getOrCreateDbKey();
    const b = await getOrCreateDbKey();
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
    expect(/^[0-9a-f]+$/.test(a)).toBe(true);
  });
});
