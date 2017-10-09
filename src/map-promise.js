export default function mapPromise(promiseFn: Function<Promise<[]>>) {
  return (fn: Function) => function apiFunctionWrapper(...args: []) {
    return promiseFn.apply(this, args)
      .then(r => fn.apply(this, [r]));
  };
}
