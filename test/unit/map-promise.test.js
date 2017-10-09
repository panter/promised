const { mapPromise } = Promises;

describe('mapPromise', () => {
  it('map call to another promise', async () => {
    const call = mapPromise(
      p => new Promise((resolve) => {
        setTimeout(() => resolve(p + 10), 50);
      }),
    )(delayedPromiseCall());

    return call(40).then((d) => {
      expect(d).to.equal(50);
      return d;
    });
  });
});
