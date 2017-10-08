# promised

[![Build Status](https://travis-ci.org/panter/promised.svg?branch=master)](https://travis-ci.org/panter/promised)
[![Coverage Status](https://coveralls.io/repos/github/panter/promised/badge.svg?branch=master)](https://coveralls.io/github/panter/promised?branch=master) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Utils function that return promises

# Installation

Source can be loaded via

```
# npm package
$ npm install @panter/promised
```


# Promised


## debounce

``` js
import { debounced } from '@panter/promised';

const apiCall = (p) => Promise.resolve(p);

const debounced = debounce()(apiCall);
debounced('Debounced call 1').then((d) => {
  console.log(d);
  return d;
});

debounced('Debounced call 2').then((d) => {
  console.log(d);
  return d;
});

// console output:
// Debounced call 1
// Debounced call 2
```

## last

``` js
import { last } from '@panter/promised';

const apiCall = (delay) => return new Promise((resolve) => {
  setTimeout(() => resolve(v), delay);
});;

const debounced = last()(apiCall);
debounced(200).then((d) => {
  console.log('first');
  return d;
});

debounced(10).then((d) => {
  console.log('second');
  return d;
});

// console output:
// second
// first
```

## delay

``` js
import { delay } from '@panter/promised';

const apiCall = (p) => Promise.resolve(p);

const wrappedCall = delay({ minTime: 100 })(apiCall);
wrappedCall(new Date().getTime()).catch((start) => {
  console.log(new Date().getTime() - start);
  return d;
});

// output will be >=100
```

## mapPromise

``` js
import { mapPromise } from '@panter/promised';

const call = mapPromise(
  d => Promise.resolve(d+10),
  null,
)((d) => Promise.resolve(d)));

call(50).then((d) => {
  console.log(d);
  return d;
});

// console output:
// 50
```


## mapResponse

``` js
import { mapResponse } from '@panter/promised';

const call = mapResponse(
  d => Promise.resolve(d),
  null,
)((d) => Promise.resolve(d)));

call(50).then((d) => {
  console.log(d);
  return d;
});

// console output:
// 50
```

## mapArgs

``` js
import { mapArgs } from '@panter/promised';

const call = mapArgs(
  args => {
    return [args[0] + 10]
  },
)((d) => Promise.resolve(d)));

call(10).then((d) => {
  console.log(d);
  return d;
});

// console output:
// 20
```

## queued

``` js
import { queued } from '@panter/promised';

const queue = queued();

const sequencedCall1 = queue()((d) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(v), 500);
  });
});
const sequencedCall2 = queue()((d) => Promise.resolve(d));

sequencedCall1('a').then((d) => {
  console.log(d);
  return d;
});

sequencedCall2('b').then((d) => {
  console.log(d);
  return d;
});

// console output:
// a
// b
```

## retry

``` js
import { retry } from '@panter/promised';

const onError = d => {
  console.log('onError');
  return d === 'retry';
};

const fn = d => {
  console.log('call fn');
  return Promise.reject(d);
};

const call = retry({ maxRetry: 1, onError })(fn);
call('retry').catch((d) = console.log(d));

// console output:
// call fn
// onError
// call fn
// retry
```

## waitFor

``` js
import { waitFor } from '@panter/promised';

const waitForFn = waitFor();
const mainFunc = waitForFn.main((v) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(v), 500);
  });
});
const waitForMainFunc = waitForFn.addChild(v => Promise.resolve(v));

mainFunc('main1').then((v) => {
  console.log(v);
})

waitForMainFunc('waitForFunc').then((v) => {
  console.log(v);
})

mainFunc('main2').then((v) => {
  console.log(v);
})

// output
// main1
// main2
// waitForFunc
```

## flow

``` js
import { debounce, mapResponse, flow } from '@panter/promised';

const promised1 = mapResponse((d) => d + 10);
const promised2 = mapResponse((d) => d + 10);

const call = flow([promised1, promised2])((d) => Promise.resolve(d));

call(0).then((d) => {
  console.log(d);
  return d;
});

// console output:
// 20
```
