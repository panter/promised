/* eslint no-use-before-define: ["error", { "functions": false }]*/
export default function retry({
    maxRetry = 3,
    onError = () => true,
    onSuccess = () => false } = {}) {
  return fn => function fnWrapper(...args) {
    const callerContext = this;

    return new Promise((resolve, reject) => {
      let retryCount = 0;

      const processPromise = (decider, cb) => (result) => {
        if (retryCount < maxRetry && decider(result)) {
          retryCount += 1;
          execute.apply(callerContext, args);
        } else {
          cb(result);
        }
      };

      function execute() {
        fn.apply(this, args)
          .then(processPromise(onSuccess, resolve))
          .catch(processPromise(onError, reject));
      }

      execute.apply(callerContext, args);
    });
  };
}
