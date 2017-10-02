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
debounced('Debounced call 1').catch((d) => {
  console.log(d);
  return d;
});

debounced('Debounced call 2').catch((d) => {
  console.log(d);
  return d;
});

// console output:
// Debounced call 1
// Debounced call 2
```

## minDuration

``` js
import { minDuration } from '@panter/promised';

const apiCall = (p) => Promise.resolve(p);

const wrappedCall = minDuration({ minTime: 100 })(apiCall);
wrappedCall(new Date().getTime()).catch((start) => {
  console.log(new Date().getTime() - start);
  return d;
});

// output will be more then 100
```

## processAfter

``` js
import { processAfter } from '@panter/promised';

const call = processAfter(
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

## queued

``` js
import { queued } from '@panter/promised';

const queue = queued();

const sequencedCall1 = sequence()((d) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(v), 500);
  });
});
const sequencedCall2 = sequence()((d) => Promise.resolve(d));

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

## sequence

``` js
import { debounce, processAfter } from '@panter/promised';

const promised1 = processAfter((d) => d + 10);
const promised2 = processAfter((d) => d + 10);

const call = sequence([promised1, promised2])((d) => Promise.resolve(d));

call(0).then((d) => {
  console.log(d);
  return d;
});

// console output:
// 20
```
