const { delay } = Promises;

describe('delay', () => {
  it('delays the request if faster', async () => {
    const start = new Date().getTime();
    const call = delay({ minTime: 100 })(v => Promise.resolve(v));
    return call().then((d) => {
      expect(new Date().getTime() - start).to.be.above(99);
      return d;
    });
  });

  it('return the reject', async () => {
    const start = new Date().getTime();
    const call = delay({ minTime: 100 })(v => Promise.reject(v));
    return call().catch((d) => {
      expect(new Date().getTime() - start).to.be.above(99);
      return d;
    });
  });

  it('return the reject if the request is slower', async () => {
    const start = new Date().getTime();
    const call = delay({ minTime: 100 })(delayedPromiseCall());
    return call(150).catch((d) => {
      expect(new Date().getTime() - start).to.be.above(149);
      return d;
    });
  });


  it('resolves immediatly the request if slower', async () => {
    const start = new Date().getTime();
    const call = delay({ minTime: 100 })(delayedPromiseCall());
    return call(150).then((d) => {
      expect(new Date().getTime() - start).to.be.above(149);
      return d;
    });
  });
});
