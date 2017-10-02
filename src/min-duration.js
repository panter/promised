export default function minDuration({ minTime = 1000 } = {}) {
  const processPromise = (cb, startTime) => (result) => {
    const endTime = new Date().getTime();

    const callDuration = (endTime - startTime);
    if (callDuration < minTime) {
      setTimeout(() => cb(result), minTime - callDuration);
    } else {
      cb(result);
    }
  };

  return fn => function fnWrapper(...args) {
    const callerContext = this;

    return new Promise((resolve, reject) => {
      const startTime = new Date().getTime();
      function execute() {
        fn.apply(this, args)
          .then(processPromise(resolve, startTime))
          .catch(processPromise(reject, startTime));
      }

      execute.apply(callerContext, args);
    });
  };
}
