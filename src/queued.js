export class QueuedPromiseError extends Error {
  constructor(result) {
    super('Reject as another request is in the queue');
    // Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.result = result;
  }
}

export default function queued() {
  let queue = [];
  const processPromise = (isError, fn, processOnlyOnce) => (result) => {
    const { resolve, reject } = queue.splice(0, 1)[0];

    if (processOnlyOnce && queue.find(({ fn: pfn }) => pfn === fn)) {
      reject(new QueuedPromiseError(result));
    } else if (isError) {
      reject(result);
    } else {
      resolve(result);
    }

    if (queue.length > 0) {
      const { callerContext, execute, args } = queue[0];

      queue[0].running = true;
      execute.apply(callerContext, args);
    }
  };

  return ({ processOnlyOnce = false } = {}) => fn => function fnWrapper(...args) {
    const callerContext = this;
    return new Promise((resolve, reject) => {
      function execute() {
        fn.apply(callerContext, args)
            .then(processPromise(false, fn, processOnlyOnce))
            .catch(processPromise(true, fn, processOnlyOnce));
      }

      const isFirstInQueue = queue.length === 0;

      if (!isFirstInQueue && processOnlyOnce) {
        queue = queue.filter(({ fn: pfn, running }) => (running || pfn !== fn));
      }

      queue.push({ fn, callerContext, execute, args, resolve, reject, running: false });

      if (isFirstInQueue) {
        queue[0].running = true;
        execute.apply(callerContext, args);
      }
    });
  };
}
