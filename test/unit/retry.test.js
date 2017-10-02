const { retry } = Promises;

describe('retry', () => {
  it('calls max retryCount', async () => {
    let count = 0;

    const call = retry()(() => {
      count += 1;
      if (count === 3) {
        return Promise.resolve(count);
      }
      return Promise.reject(count);
    });

    const endValue = await call(0);

    expect(endValue).to.equal(3);
  });

  it('rejects after too many rejected calls', async () => {
    const call = retry({ maxRetry: 1 })(() => Promise.reject());

    const catcher = sinon.spy(d => d);
    await call(0).catch(catcher);

    expect(catcher).to.have.been.called.once;
  });

  it('uses function to decide if retry after rejection', async () => {
    const onError = d => d === 'retry';
    const fn = sinon.spy(d => Promise.reject(d));
    const call = retry({ maxRetry: 2, onError })(fn);

    const catcher = sinon.spy(d => d);
    await call('no retry').catch(catcher);

    expect(fn).to.have.been.called.once;
    expect(catcher).to.have.been.called.once;
  });

  it('uses function to decide if retry two times after rejection', async () => {
    const onError = d => d === 'retry';
    const fn = sinon.spy(d => Promise.reject(d));
    const call = retry({ maxRetry: 1, onError })(fn);

    const catcher = sinon.spy(d => d);
    await call('retry').catch(catcher);

    expect(fn).to.have.been.called.twice;
    expect(catcher).to.have.been.called.once;
  });

  it('rejects after too many resolved calls', async () => {
    const onSuccess = sinon.spy(d => d === 'retry');
    const call = retry({ maxRetry: 1, onSuccess })(d => Promise.resolve(d));

    await call('retry').then(d => d);

    expect(onSuccess).to.have.been.called.twice;
  });

  it('uses function to decide if retry after resolve', async () => {
    const onSuccess = d => d === 'retry';
    const fn = sinon.spy(d => Promise.resolve(d));
    const call = retry({ maxRetry: 2, onSuccess })(fn);

    const catcher = sinon.spy(d => d);
    await call('no retry').then(catcher);

    expect(fn).to.have.been.called.once;
    expect(catcher).to.have.been.called.once;
  });

  it('uses function to decide if retry two times after resolve', async () => {
    const onSuccess = d => d === 'retry';
    const fn = sinon.spy(d => Promise.resolve(d));
    const call = retry({ maxRetry: 1, onSuccess })(fn);

    const catcher = sinon.spy(d => d);
    await call('retry').then(catcher);

    expect(fn).to.have.been.called.twice;
    expect(catcher).to.have.been.called.once;
  });
});
