import { bumpData, subscribeData } from '../reactive';

describe('reactive pub-sub', () => {
  it('notifies all subscribers on bumpData', () => {
    let a = 0;
    let b = 0;
    const un1 = subscribeData(() => (a += 1));
    const un2 = subscribeData(() => (b += 1));
    bumpData();
    bumpData();
    expect(a).toBe(2);
    expect(b).toBe(2);
    un1();
    un2();
  });

  it('stops notifying after unsubscribe', () => {
    let count = 0;
    const unsub = subscribeData(() => (count += 1));
    bumpData();
    expect(count).toBe(1);
    unsub();
    bumpData();
    expect(count).toBe(1); // no further notifications
  });
});
