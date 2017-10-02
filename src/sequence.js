export default function sequence(promisedChain) {
  return fn => promisedChain.reverse().reduce((lastFn, promised) => promised(lastFn), fn);
}
