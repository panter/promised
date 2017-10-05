// @flow

export default function sameResult() {
  return (fn: Function) => {
    let last = null;
    const promiseResolve = [];

    const processPromise = (isError, time) => (result) => {
      if (time !== last) { return; }

      last = null;
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
      debugger;
      const callerContext = this;

      return new Promise((resolve: Function, reject: Function) => {
        function execute() {
          const thisArguments = args;
          const time = last = new Date().getTime();

          fn.apply(this, thisArguments)
            .then(processPromise(false, time))
            .catch(processPromise(true, time));
        }
        promiseResolve.push({ resolve, reject });
        execute.apply(callerContext, args);
      });
    };
  };
}
