// @flow
export type PropsType = {
  delay: number,
}

export default function debounce({ delay = 200 } : PropsType = {}) {
  return (fn: Function) => {
    let timeoutId = null;

    return function fnWrapper(...args: []): Promise<any> {
      const callerContext = this;

      return new Promise((resolve: Function, reject: Function) => {
        function execute() {
          const thisArguments = args;

          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fn.apply(this, thisArguments)
            .then(resolve)
            .catch(reject);
          }, delay);
        }

        execute.apply(callerContext, args);
      });
    };
  };
}
