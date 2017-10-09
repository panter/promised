const { last } = Promises;

describe('last', () => {
  it('returns a function', async () => {
    const apiCall = v => Promise.resolve(v);
    const func = last()(apiCall);
    return func('a').then((d) => {
      expect(d).to.equal('a');
      return d;
    });
  });

  it('catches rejection', async () => {
    const apiCall = v => Promise.reject(v);
    const func = last()(apiCall);
    return func('a').catch((d) => {
      expect(d).to.equal('a');
      return d;
    });
  });

  it('returns only the last result', async () => {
    const results = [];
    const func = last()(delayedPromiseCall());
    const lastTimeout = 50;

    const call1 = func(150).then((d) => {
      expect(d).to.equal(lastTimeout);
      return d;
    });
    results.push(call1);

    setTimeout(() => {
      results.push(func(lastTimeout).then((d) => {
        expect(d).to.equal(lastTimeout);
        return d;
      }));
    }, 50);

    await call1;

    return Promise.all(results);
  });
});
