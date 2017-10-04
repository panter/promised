export default function processAfter(onSuccess: ?Function, onError: ?Function) {
  return (fn: Function) => function apiFunctionWrapper(...args: []) {
    return fn
        .apply(this, args)
        .then(onSuccess)
        .catch(onError);
  };
}
