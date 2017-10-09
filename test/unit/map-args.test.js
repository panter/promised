const { mapArgs } = Promises;

describe('mapArgs', () => {
  it('maps arguments', async () => {
    const call = mapArgs(
      a => [`${a[0]}b`],
    )(v => Promise.resolve(v));

    return call('a').then((d) => {
      expect(d).to.equal('ab');
      return d;
    });
  });

  it('throw error', async () => {
    const call = mapArgs(
      () => { throw new Error('wrong arguments'); },
    )(v => Promise.resolve(v));

    return call('a').catch((error) => {
      expect(error.message).to.equal('wrong arguments');
      return error;
    });
  });
});
