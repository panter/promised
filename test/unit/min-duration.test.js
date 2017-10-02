const { minDuration } = Promises;

describe('minDuration', () => {
  it('delays the request if faster', async () => {
    const start = new Date().getTime();
    const call = minDuration({ minTime: 100 })(v => Promise.resolve(v));
    return call().then((d) => {
      expect(new Date().getTime() - start).to.be.above(100);
      return d;
    });
  });

  it('return the reject', async () => {
    const start = new Date().getTime();
    const call = minDuration({ minTime: 100 })(v => Promise.reject(v));
    return call().catch((d) => {
      expect(new Date().getTime() - start).to.be.above(100);
      return d;
    });
  });

  it('resolves immediatly the request if slower', async () => {
    const start = new Date().getTime();
    const call = minDuration({ minTime: 100 })(delayedPromiseCall());
    return call(150).then((d) => {
      expect(new Date().getTime() - start).to.be.above(150);
      return d;
    });
  });
});
