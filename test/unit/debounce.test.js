const { debounce } = Promises;

describe('debounce', () => {
  it('returns a function', async () => {
    const apiCall = v => Promise.resolve(v);
    const func = debounce()(apiCall);
    return func('a').then((d) => {
      expect(d).to.equal('a');
      return d;
    });
  });

  it('catches rejection', async () => {
    const apiCall = v => Promise.reject(v);
    const func = debounce()(apiCall);
    return func('a').catch((d) => {
      expect(d).to.equal('a');
      return d;
    });
  });

  it('returns every debounce', async () => {
    const func = debounce()(delayedPromiseCall());
    let call1Done = false;

    const call1 = func(350).then((d) => {
      call1Done = true;
      expect(d).to.equal(350);
      return d;
    });

    setTimeout(() => {
      func(10).then((d) => {
        expect(call1Done).to.be.false;
        expect(d).to.equal(10);
        return d;
      });
    }, 250);

    return call1;
  });
});
