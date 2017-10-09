// @flow

export default function last() {
  return (fn: Function) => {
    let lastId = null;
    const promiseResolve = [];

    const processPromise = (isError, time) => (result) => {
      if (time !== lastId) { return; }

      lastId = null;
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
        function execute() {
          const thisArguments = args;
          const time = lastId = new Date().getTime();

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
