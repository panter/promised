const { flow, mapResponse } = Promises;

describe('flow', () => {
  it('calls function in a flow', async () => {
    const resolve1 = sinon.spy(d => Promise.resolve(d + 10));
    const promised1 = mapResponse(resolve1);

    const resolve2 = sinon.spy(d => Promise.resolve(d + 10));
    const promised2 = mapResponse(resolve2);

    const call = flow([promised1, promised2])(delayedPromiseCall());

    const endValue = await call(10);

    expect(endValue).to.equal(30);
    expect(resolve1).to.have.been.calledWith(20);
    expect(resolve2).to.have.been.calledWith(10);
  });
});
