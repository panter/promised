// @flow

export default function sequence(promisedChain: Array<Function>) {
  return (fn: Function) =>
    promisedChain.reverse().reduce((lastFn, promised) => promised(lastFn), fn);
}
