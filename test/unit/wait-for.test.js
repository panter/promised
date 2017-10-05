const { waitFor } = Promises;

describe('wairFor', () => {
  it('runs immedialy if no main is running', async () => {
    const waitForFn = waitFor();
    waitForFn.main()(delayedPromiseCall());
    const waitForMainFunc = waitForFn.addChild()(v => Promise.resolve(v));
    return waitForMainFunc(1).then((d) => {
      expect(d).to.equal(1);
      return d;
    });
  });

  it('runs immedialy if no main specified', async () => {
    const waitForFn = waitFor();
    const waitForMainFunc = waitForFn.addChild()(v => Promise.resolve(v));
    return waitForMainFunc(1).then((d) => {
      expect(d).to.equal(1);
      return d;
    });
  });

  it('wait that main is complete', async () => {
    const waitForFn = waitFor();
    const mainFunc = waitForFn.main()(delayedPromiseCall());
    const waitForMainFunc = waitForFn.addChild()(v => Promise.resolve(v));

    let mainCalled = 0;
    mainFunc(300).then((d) => {
      mainCalled += 1;
      expect(d).to.equal(300);
      return d;
    });

    const waitForMainresult = waitForMainFunc().then((d) => {
      expect(mainCalled).to.equal(2);
      return d;
    });

    mainFunc(10).then((d) => {
      mainCalled += 1;
      return d;
    });

    return waitForMainresult;
  });
});
