<h1 align="center">@nevware21 ts-utils</h1>
<h2 align="center">Common JavaScript/TypeScript helper functions for better minification</h2>


![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/nevware21/ts-utils/NodeCI/main)
[![codecov](https://codecov.io/gh/nevware21/ts-utils/branch/main/graph/badge.svg?token=8YCAMUA7VB)](https://codecov.io/gh/nevware21/ts-utils)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fts-utils.svg)](https://badge.fury.io/js/%40nevware21%2Fts-utils)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)

## Description

This is a collection of general JavaScript functions (written in and for TypeScript) to aid with removing code duplication to assist with minification, the provided functions are expected to only rarely be included in their namespaced environment.

Support for standard JavaScript functions (ES5+) that are not support in all environments will be backed by internal polyfill implementations when not available. 

### Test Environments 
- Node (12, 14, 16)
- Browser (Chromium - headless)
- Web Worker (Chromium - headless)

All of the polyfill functions are tested against the standard native implementations for node, browser and web-worker to ensure compatibility.

### Documentation and details

See the documentation [generated from source code](https://nevware21.github.io/ts-utils/typedoc/index.html) via typedoc for a full list and details of all of the available types,  functions and interfaces.

See [Browser Support](#browser-support) for details.

| Type                       | Functions / Helpers / Aliases / Polyfills
|----------------------------|---------------------------------------------------
| Runtime Environment Checks | <code>getDocument(); getGlobal(); getHistory(); getInst(); getNavigator(); getWindow(); hasDocument(); hasHistory(); hasNavigator(); hasWindow(); isNode(); isWebWorker();</code>
| Type Identity              | <code>isArray(); isArrayBuffer(); isBlob(); isBoolean(); isDate(); isError(); isFile(); isFormData(); isFunction(); isIterable(); isIterator(); isNullOrUndefined(); isNumber(); isObject(); isPromise(); isPromiseLike(); isThenable(); isRegExp(); isStrictNullOrUndefined(); isStrictUndefined(); isString(); isTypeof(); isUndefined();</code>
| Value Check                | <code>hasValue(); isDefined(); isNotTruthy(); isNullOrUndefined(); isStrictNullOrUndefined(); isStrictUndefined(); isTruthy(); isUndefined();</code>
| &nbsp;                     | &nbsp;
| Array                      | <code>arrAppend(); arrForEach(); arrIndexOf(); arrMap(); arrReduce(); getLength(); isArray();<br/>polyIsArray</code>
| Enum                       | <code>createEnum(); createEnumKeyMap(); createEnumValueMap(); createSimpleMap(); createTypeMap();</code>
| Error                      | <code>createCustomError(); isError(); throwError(); throwRangeError(); throwTypeError(); throwUnsupported();</code>
| Iterator                   | <code>createArrayIterator(); createIterator(); createIterable(); createRangeIterator(); iterForOf(); isIterable(); isIterator(); makeIterable();</code>
| Math                       | <code>mathCeil(); mathFloor(); mathMax(); mathMin(); mathToInt(); mathTrunc();</code>
| Object                     | <code>deepExtend(); isObject(); objAssign(); objCopyProps(); objCreate(); objDeepCopy(); objDeepFreeze(); objDefineAccessors(); objDefineGet(); objDefineProp(); objExtend(); objForEachKey(); objFreeze(); objGetOwnPropertyDescriptor(); objHasOwn(); objHasOwnProperty(); objKeys(); objSeal(); objSetPrototypeOf(); objToString();<br/>polyObjKeys(); polyObjHasOwn()</code>
| String                     | <code>asString(); getLength(); isString(); strEndsWith(); strIndexOf(); strIsNullOrEmpty(); strIsNullOrWhiteSpace(); strLastIndexOf(); strLeft(); strPadEnd(); strPadStart(); strRepeat(); strRight(); strSlice(); strStartsWith(); strSubstr(); strSubstring(); strTrim(); strTrimEnd(); strTrimLeft(); strTrimRight(); strTrimStart();<br/>polyStrSubstr(); polyStrTrim(); polyStrTrimEnd(); polyStrTrimStart();</code>
| Symbol                     | <code>WellKnownSymbols (const enum);<br/>getKnownSymbol(); getSymbol(); hasSymbol(); isSymbol(); newSymbol(); symbolFor(); symbolKeyFor();<br/>polyGetKnownSymbol(); polyNewSymbol(); polySymbolFor(); polySymbolKeyFor();</code><br/>Polyfills are used to automatically backfill runtimes that do not support `Symbol`, not all of the Symbol functionality is provided.

> Unless otherwise stated in the functions documentation polyfills are used to automatically backfill unsupported functions in older ES5 runtimes

## Quickstart

Install the npm packare: `npm install @nevware21/ts-utils --save`

And then just import the helpers and use them.

```TypeScript
import { isArray, arrForEach, objForEachKey, objHasOwnProperty } from "@nevware21/ts-utils";

export function simpleTest(theValue: any): string[] {
    let result: any[] = [];

    if (isArray(theValue)) {
        arrForEach(theValue, (value, idx) => {
            if (objHasOwnProperty(theValue, value)) {
                result.push(idx + ":" + value);
            }
        });
    } else {
        objForEachKey(theValue, (key, value) => {
            if (value) {
                result.push(key + "=" + value);
            }
        });
    }
    return result;
}
```

Or checking if a variable is a string

```TypeScript

import { isString } from "@nevware21/ts-utils";

function checkString(value: any) {
    let ug = 1;

    return isString(value);
}
```

## Browser Support

General support is currently set to ES5 supported runtimes higher.
![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Latest ? | Latest ? | <center>9+ ?</center> | Latest ? | Latest ? |
> Note: While some polyfills are provided to "somewhat" support ES3/IE8 this library does not intend to become a fully fledged polyfill library. And the polyfills provided (or contributed) are just the minimum set that have been required over time. And should be less necessary are time moves forward.

#### Polyfills

All of the included polyfills are tested against the current native implementation running in `node`, `browser` and `worker` environments to ensure that they conform to the current specification, these polyfills are only internally used for ES5 compatibility and when running in an environment (mostly IE) that does not support the required function.

Some additional polyfills are provided for simple backward compatability to enable the utility functions in older environments (such as ES3 / IE8), however, you don't have to use or include these provided polyfils. If you need to use them you will need to import the pre-packaged "polyfill" bundle (`bundle/ts-polyfills-utils.min.js`) directly by hosting it on your own CDN or all of the non-internal polyfill implementations are exported so you could implement your own version of the [polyfill initializer](https://github.com/nevware21/ts-utils/blob/main/lib/src/polyfills.ts) or more simply provide your own alternatives.

> Note: Several functions use the [Object.defineProperty](https://caniuse.com/?search=Object.defineProperty) and therefore support is limited to runtimes or good polyfills that can correctly implement this functionality. (eg. createIterator; createIterable)

## Contributing

Read our [contributing guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

