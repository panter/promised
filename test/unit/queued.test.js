const { queued } = Promises;

describe('queued', () => {
  it('calls queue sequencially', async () => {
    const results = [];
    const sequence = queued();

    const sequencedCall1 = sequence()(delayedPromiseCall());
    const sequencedCall2 = sequence()(delayedPromiseCall());

    let call2Done = false;

    results.push(sequencedCall2(100).then((d) => {
      call2Done = true;
      expect(d).to.equal(100);
      return d;
    }));

    results.push(await sequencedCall1(50).then((d) => {
      expect(call2Done).to.be.true;
      expect(d).to.equal(50);
      return d;
    }));

    return Promise.all(results);
  });

  it('rejects the promise', async () => {
    const sequence = queued();

    const reject = sinon.spy(v => v);
    const call1 = sequence()(v => Promise.reject(v));

    await call1(50).catch(reject);

    expect(reject).to.have.been.calledWith(50);
  });

  it('processes only once', async () => {
    const results = [];
    const sequence = queued();

    const sequencedCall1 = sequence({ processOnlyOnce: true })(delayedPromiseCall());


    results.push(sequencedCall1(200).catch((error) => {
      expect(error.result).to.equal(200);
      return error.result;
    }));


    results.push(sequencedCall1(100).catch((error) => {
      expect(error.result).to.equal(null);
      return error.result;
    }));

    results.push(sequencedCall1(1).then((d) => {
      expect(d).to.equal(1);
      return d;
    }));

    return Promise.all(results);
  });

  it('processes only once after promise comes back', async () => {
    const results = [];
    const sequence = queued();

    const sequencedCall1 = sequence()(delayedPromiseCall());
    const sequencedCall2 = sequence({ processOnlyOnce: true })(delayedPromiseCall());
    const sequencedCall3 = sequence()(delayedPromiseCall());

    let call2Done = false;

    results.push(sequencedCall2(100).catch((error) => {
      expect(error.result).to.equal(100);
      return error.result;
    }));

    results.push(sequencedCall1(50).then((d) => {
      expect(call2Done).to.be.false;
      expect(d).to.equal(50);
      return d;
    }));

    results.push(sequencedCall2(101).then((d) => {
      call2Done = true;
      expect(d).to.equal(101);
      return d;
    }));

    results.push(await sequencedCall3(70).then((d) => {
      expect(call2Done).to.be.true;
      expect(d).to.equal(70);
      return d;
    }));

    return Promise.all(results);
  });
});
