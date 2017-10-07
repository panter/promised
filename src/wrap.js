export default function wrap(onSuccess: ?Function, onError: ?Function) {
  return (fn: Function) => function apiFunctionWrapper(...args: []) {
    return fn
        .apply(this, args)
        .then(onSuccess)
        .catch(onError);
  };
}
