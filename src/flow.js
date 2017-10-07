// @flow

export default function flow(promisedChain: Array<Function>) {
  return (fn: Function) =>
    promisedChain.reverse().reduce((lastFn, promised) => promised(lastFn), fn);
}
