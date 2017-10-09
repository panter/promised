const { mapResponse } = Promises;

describe('mapResponse', () => {
  it('resolves the promise if callback return promise', async () => {
    const call = mapResponse(
      d => Promise.resolve(d),
      null,
    )(delayedPromiseCall());

    return call(50).then((d) => {
      expect(d).to.equal(50);
      return d;
    });
  });

  it('resolves the promise if callback does not return a promise', async () => {
    const call = mapResponse(
      d => d,
      null,
    )(delayedPromiseCall());

    return call(50).then((d) => {
      expect(d).to.equal(50);
      return d;
    });
  });

  it('catches the promise', async () => {
    const call = mapResponse(
      null,
      e => e,
    )(d => Promise.reject(d));

    return call(50).catch((e) => {
      expect(e).to.equal(50);
      return e;
    });
  });

  it('rejects the promise if callback rejects', async () => {
    const call = mapResponse(
      v => Promise.reject(v),
      null,
    )(d => Promise.resolve(d));

    const reject = sinon.spy(v => v);

    await call(50)
      .catch(reject);

    expect(reject).to.have.been.calledWith(50);
  });

  it('process multiple calls', async () => {
    const results = [];
    let call1Done = false;

    const call1 = mapResponse(
      d => d,
      null,
    )(delayedPromiseCall());

    const call2 = mapResponse(
      null,
      e => e,
    )(d => Promise.reject(d));

    results.push(call1(50).then((d) => {
      call1Done = true;
      expect(d).to.equal(50);
      return d;
    }));

    results.push(call2('a').catch((d) => {
      expect(call1Done).to.be.false;
      expect(d).to.equal('a');
      return d;
    }));

    return Promise.all(results);
  });
});
