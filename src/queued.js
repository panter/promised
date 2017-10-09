// @flow

export class QueuedPromiseError extends Error {
  result: ?any;

  constructor(result: ?any) {
    super('Reject as another request is in the queue');
    // Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.result = result;
  }
}

export default function queued() {
  let queue = [];

  type PropsType = {
    processOnlyOnce: boolean,
  }

  return ({ processOnlyOnce = false }: PropsType = {}) => (fn: Function) => {
    const isLegit = ({ fn: pfn, running }) => (running || pfn !== fn);

    const processPromise = isError => (result) => {
      const { resolve, reject } = queue.splice(0, 1)[0];

      if (processOnlyOnce && queue.find(({ fn: pfn }) => pfn === fn)) {
        reject(new QueuedPromiseError(result));
      } else if (isError) {
        reject(result);
      } else {
        resolve(result);
      }

      setTimeout(() => {
        if (queue.length > 0) {
          const { callerContext, execute, args } = queue[0];

          queue[0].running = true;
          execute.apply(callerContext, args);
        }
      }, 0);
    };

    return function fnWrapper(...args: []): Promise<any> {
      const callerContext = this;
      return new Promise((resolve, reject) => {
        function execute() {
          fn.apply(callerContext, args)
            .then(processPromise(false))
            .catch(processPromise(true));
        }

        const isFirstInQueue = queue.length === 0;

        if (!isFirstInQueue && processOnlyOnce) {
          queue.forEach((q) => {
            if (!isLegit(q)) {
              q.reject(new QueuedPromiseError(null));
            }
          });
          queue = queue.filter(isLegit);
        }

        queue.push({ fn, callerContext, execute, args, resolve, reject, running: false });

        if (isFirstInQueue) {
          queue[0].running = true;
          execute.apply(callerContext, args);
        }
      });
    };
  };
}
