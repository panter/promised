export default function mapArgs(map: Function) {
  return (fn: Function) => function apiFunctionWrapper(...args: []) {
    let newArgs;
    try {
      newArgs = map(args);
    } catch (e) {
      return Promise.reject(e);
    }
    return fn.apply(this, newArgs);
  };
}
