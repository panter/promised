export default function processAfter(onSuccess, onError) {
  return fn => function apiFunctionWrapper(...args) {
    return fn
        .apply(this, args)
        .then(onSuccess)
        .catch(onError);
  };
}
