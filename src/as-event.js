import flow from './flow';

export default function asEvent({ flowConfig = null, once = false } = {}) {
  const listeners = [];
  return (fn: Function) => {
    let isRunning = false;
    const wrappedFn = flowConfig
      ? flow(flowConfig)(fn)
      : fn;

    return {
      next(...args) {
        if (once && isRunning) {
          wrappedFn.apply(this, args);
        } else {
          isRunning = true;
          wrappedFn.apply(this, args)
          .then(
            (r) => {
              listeners.forEach(({ resolve = p => p }) => resolve(r));
              isRunning = false;
              return r;
            },
            (r) => {
              listeners.forEach(({ reject = p => p }) => reject(r));
              isRunning = false;
              return r;
            });
        }
      },
      subscribe(listener) {
        listeners.push(listener);
        return listener;
      },
      unsubscribe(listener) {
        const index = listeners.indexOf(listener);

        if (index > -1) {
          listeners.splice(index, 1);
        }
      },
    };
  };
}
