const { asEvent, debounce, last, queued } = Promises;

describe('asEvent', () => {
  it('returns a function', (done) => {
    const apiCall = v => Promise.resolve(v);
    const { next, subscribe } = asEvent()(apiCall);
    subscribe({
      resolve(r) {
        expect(r).to.equal('a');
        done();
      },
    });
    next('a');
  });

  it('reject', (done) => {
    const apiCall = (b, v) => {
      if (b) {
        return Promise.resolve(v);
      }
      return Promise.reject(v);
    };
    const { next, subscribe } = asEvent()(apiCall);
    subscribe({
      reject(r) {
        expect(r).to.equal('b');
        return done();
      },
    });
    next(true, 'a');
    next(false, 'b');
  });

  it('reject silently', (done) => {
    const apiCall = (b, v) => {
      if (b) {
        return Promise.resolve(v);
      }
      return Promise.reject(v);
    };
    const { next, subscribe } = asEvent()(apiCall);
    subscribe({
      resolve(r) {
        return r;
      },
    });
    next(false, 'b');
    setTimeout(done, 100);
  });

  it('unsubscribe', (done) => {
    const apiCall = (b, v) => new Promise((resolve, reject) => {
      setTimeout(() => {
        if (b) {
          return resolve(v);
        }
        return reject(v);
      }, 1500);
    });

    const { next, subscribe, unsubscribe } = asEvent()(apiCall);
    const listener = subscribe({
      resolve() {
        throw new Error('should not be called');
      },
      reject() {
        throw new Error('should not be called');
      },
    });
    next(true, 'a');
    next(false, 'b');
    unsubscribe(listener);
    unsubscribe(null);
    setTimeout(done, 500);
  });

  it('with flow', (done) => {
    const apiCall = delayedPromiseCall();
    const { next, subscribe } = asEvent({
      once: true,
      flowConfig: [
        last(),
        queued()({ processOnlyOnce: true }),
        debounce({ minTime: 100 }),
      ],
    })(apiCall);
    subscribe({
      resolve(r) {
        expect(r).to.equal(50);
        done();
      },
    });
    next(500);
    setTimeout(() => next(50), 150);
  });
});
