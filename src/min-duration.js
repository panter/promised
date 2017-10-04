// @flow

export type PropsType = {
  minTime: number,
}

export default function minDuration({ minTime = 1000 } : PropsType = {}) {
  const processPromise = (cb, startTime) => (result) => {
    const endTime = new Date().getTime();

    const callDuration = (endTime - startTime);
    if (callDuration < minTime) {
      setTimeout(() => cb(result), minTime - callDuration);
    } else {
      cb(result);
    }
  };

  return (fn: Function) => function fnWrapper(...args: []): Promise<any> {
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
