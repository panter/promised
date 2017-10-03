// @flow
export type PropsType = {
  delay: number,
}

export default function debounce({ delay = 200 } : PropsType = {}) {
  return (fn: Function) => {
    let timeoutId = null;
    const promiseResolve = [];

    const processPromise = (isError, currentTimeoutId) => (result) => {
      if (currentTimeoutId !== timeoutId) { return; }

      timeoutId = null;
      promiseResolve.forEach(({ resolve, reject }) => {
        if (isError) {
          reject(result);
        } else {
          resolve(result);
        }
      });
      promiseResolve.splice(0, promiseResolve.length);
    };

    return function fnWrapper(...args: []): Promise<any> {
      const callerContext = this;

      return new Promise((resolve: Function, reject: Function) => {
        promiseResolve.push({ resolve, reject });
        function execute() {
          const thisArguments = args;

          clearTimeout(timeoutId);
          const currentTimeoutId = timeoutId = setTimeout(() => {
            fn.apply(this, thisArguments)
            .then(processPromise(false, currentTimeoutId))
            .catch(processPromise(true, currentTimeoutId));
          }, delay);
        }

        execute.apply(callerContext, args);
      });
    };
  };
}
