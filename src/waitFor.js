// @flow

export default function waitFor() {
  let mainCount = 0;
  const queue = [];

  return {
    main(fn: Function) {
      const processPromise = cb => (result) => {
        cb(result);
        mainCount -= 1;
        if (mainCount === 0) {
          queue.forEach(({ execute, args, callerContext }) => execute.apply(callerContext, args));
          queue.splice(0, queue.length);
        }
      };

      return function fnWrapper(...args: []): Promise<any> {
        const callerContext = this;
        return new Promise((resolve, reject) => {
          function execute() {
            mainCount += 1;
            fn.apply(callerContext, args)
              .then(processPromise(resolve))
              .catch(processPromise(reject));
          }
          execute.apply(callerContext, args);
        });
      };
    },
    addChild(fn: Function) {
      return function fnWrapper(...args: []): Promise<any> {
        const callerContext = this;
        return new Promise((resolve, reject) => {
          function execute() {
            fn.apply(callerContext, args)
                .then(resolve)
                .catch(reject);
          }

          if (mainCount > 0) {
            queue.push({ execute, args, callerContext });
          } else {
            execute.apply(callerContext, args);
          }
        });
      };
    },
  };
}
