import 'babel-polyfill';
import Promises from '../../src';


const delayedPromiseCall = () => v =>
  new Promise((resolve) => {
    setTimeout(() => resolve(v), v);
  });

window.delayedPromiseCall = delayedPromiseCall;
window.Promises = Promises;
