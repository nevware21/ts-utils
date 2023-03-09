<h1 align="center">@nevware21 ts-utils</h1>
<h2 align="center">Common JavaScript/TypeScript helper functions for better minification</h2>


![GitHub Workflow Status (main)](https://img.shields.io/github/actions/workflow/status/nevware21/ts-utils/ci.yml?branch=main)
[![codecov](https://codecov.io/gh/nevware21/ts-utils/branch/main/graph/badge.svg?token=8YCAMUA7VB)](https://codecov.io/gh/nevware21/ts-utils)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fts-utils.svg)](https://badge.fury.io/js/%40nevware21%2Fts-utils)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)

## Description

This is a collection of general JavaScript functions (written in and for TypeScript) to aid with removing code duplication to assist with minification, the provided functions are expected to only rarely be included in their namespaced environment.

Support for standard JavaScript functions (ES5+) that are not support in all environments will be backed by internal polyfill implementations when not available.

### Test Environments 
- Node (12, 14, 16, 18)
- Browser (Chromium - headless)
- Web Worker (Chromium - headless)

All of the polyfill functions are tested against the standard native implementations for node, browser and web-worker to ensure compatibility.

### Documentation and details

See the documentation [generated from source code](https://nevware21.github.io/ts-utils/typedoc/index.html) via typedoc for a full list and details of all of the available types,  functions and interfaces.

See [Browser Support](#browser-support) for details.

| Type                       | Functions / Helpers / Aliases / Polyfills
|----------------------------|---------------------------------------------------
| Runtime Environment Checks | <code>getDocument(); getGlobal(); getHistory(); getInst(); getNavigator(); getPerformance(); getWindow(); hasDocument(); hasHistory(); hasNavigator(); hasPerformance(); hasWindow(); isNode(); isWebWorker(); hasIdleCallback();</code>
| Type Identity              | <code>isArray(); isArrayBuffer(); isBlob(); isBoolean(); isDate(); isError(); isFile(); isFormData(); isFunction(); isIterable(); isIterator(); isNullOrUndefined(); isNumber(); isObject(); isPlainObject(); isPrimitive(); isPromise(); isPromiseLike(); isThenable(); isRegExp(); isStrictNullOrUndefined(); isStrictUndefined(); isString(); isTypeof(); isUndefined();</code>
| Value Check                | <code>hasValue(); isDefined(); isNotTruthy(); isNullOrUndefined(); isStrictNullOrUndefined(); isStrictUndefined(); isTruthy(); isUndefined();</code>
| &nbsp;                     | &nbsp;
| Array                      | <code>arrAppend(); arrContains(); arrEvery(); arrFilter(); arrFind(); arrFindIndex(); arrFindLast(); arrFindLastIndex(); arrForEach(); arrIncludes(); arrIndexOf(); arrLastIndexOf(); arrMap(); arrReduce(); arrSome(); getLength(); isArray();<br/>polyIsArray(); polyArrIncludes(); polyArrFind(); polyArrFindIndex(); polyArrFindLast(); polyArrFindLast(); polyArrFindLastIndex();</code>
| ArrayLike                  | <code>arrContains(); arrEvery(); arrFilter(); arrFind(); arrFindIndex(); arrFindLast(); arrFindLastIndex(); arrForEach(); arrIncludes(); arrIndexOf(); arrLastIndexOf(); arrMap(); arrReduce(); arrSome(); getLength();</code>
| Enum                       | <code>createEnum(); createEnumKeyMap(); createEnumValueMap(); createSimpleMap(); createTypeMap();</code>
| Error                      | <code>createCustomError(); isError(); throwError(); throwRangeError(); throwTypeError(); throwUnsupported();</code>
| Iterator                   | <code>createArrayIterator(); createIterator(); createIterable(); createRangeIterator(); iterForOf(); isIterable(); isIterator(); makeIterable(); arrAppend();</code>
| Math                       | <code>mathCeil(); mathFloor(); mathMax(); mathMin(); mathToInt(); mathTrunc();</code>
| Object                     | <code>deepExtend(); isObject(); objAssign(); objCopyProps(); objCreate(); objDeepCopy(); objDeepFreeze(); objDefine(); objDefineAccessors(); objDefineGet(); objDefineProp(); objDefineProps(); objDefineProperties(); objExtend(); objForEachKey(); objFreeze(); objGetOwnPropertyDescriptor(); objHasOwn(); objHasOwnProperty(); objKeys(); objSeal(); objGetPrototypeOf(); objSetPrototypeOf(); objToString();<br/>polyObjKeys(); polyObjHasOwn()</code>
| String                     | <code>asString(); getLength(); isString(); strEndsWith(); strIndexOf(); strIsNullOrEmpty(); strIsNullOrWhiteSpace(); strLastIndexOf(); strLeft(); strPadEnd(); strPadStart(); strRepeat(); strRight(); strSlice(); strStartsWith(); strSubstr(); strSubstring(); strTrim(); strTrimEnd(); strTrimLeft(); strTrimRight(); strTrimStart(); strLetterCase(); strCamelCase(); strKebabCase(); strSnakeCase(); strUpper(); strLower(); <br/>polyStrSubstr(); polyStrTrim(); polyStrTrimEnd(); polyStrTrimStart();</code>
| Symbol                     | <code>WellKnownSymbols (const enum);<br/>getKnownSymbol(); getSymbol(); hasSymbol(); isSymbol(); newSymbol(); symbolFor(); symbolKeyFor();<br/>polyGetKnownSymbol(); polyNewSymbol(); polySymbolFor(); polySymbolKeyFor();</code><br/>Polyfills are used to automatically backfill runtimes that do not support `Symbol`, not all of the Symbol functionality is provided.
| Timer                      | <code>elapsedTime(); perfNow(); utcNow(); scheduleIdleCallback(); scheduleInterval(); scheduleTimeout(); scheduleTimeoutWith(); hasIdleCallback(); </code><br/>For runtimes that don't support `requestIdleCallback` normal setTimeout() is used with the values from `setDefaultIdleTimeout()` and `setDefaultMaxExecutionTime()`<br /><code>polyUtcNow();</code>
| Conversion                 | <code>encodeAsJson(); encodeAsHtml(); asString(); getIntValue(); normalizeJsName(); strLetterCase(); strCamelCase(); strKebabCase(); strSnakeCase(); strUpper(); strLower(); </code>
| Lazy                       | <code>getLazy();</code>

> Unless otherwise stated in the functions documentation polyfills are used to automatically backfill unsupported functions in older ES5 runtimes

## Quickstart

Install the npm packare: `npm install @nevware21/ts-utils --save`

And then just import the helpers and use them.

### Simple Example

These are simple representations of using some of the basic function vs the standard provided JavaScript versions.
Examples are also being included in the source and generated typedoc documentation.

__Using Helpers__

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

__Using standard JS functions__

```TypeScript
export function simpleTest2(theValue: any): string[] {
    let result: any[] = [];

    if (Array.isArray(theValue)) {
        for (let idx = 0; idx < theValue.length; idx++) {
            if (idx in theValue) {
                let value = theValue[idx];
                if (theValue.hasOwnProperty(value)) {
                    result.push(idx + ":" + value);
                }
            }
        }
    } else {
        Object.keys(theValue).forEach((key) => {
            let value = theValue[key];
            if (value) {
                result.push(key + "=" + value);
            }
        });
    }

    return result;
}
```

Just from use the helpers you can visually see that the code you write is visually simpler and it removes the need for some standard biolerplate code that you should use when iterating over objects.

But if we have a look at what the minified version might look like the difference becomes even more obvious, as while the helper function names can be minified (because they are not global and they are not namespaced against any object) while the standard public classes and their any functions cannot (normally) be minified. (There are tricks you can do in your own code but it can become messy, this library actually uses those techniques internally to aid with minification).

__Minified Using Helpers (~160 bytes)__
but <u>not</u> including the actual helpers

```JavaScript
function simpleTest(t){var r=[];if (a(t)) {f(t,function(v, i){if (h(t,v)) {r.push(i+":"+v);}});}else{e(t,function(k,v){if(v){r.push(k+"="+v);}});}return r;}
```

__Minified Without helpers (~240 bytes)__

```JavaScript
function simpleTest2(t){var r=[];if(Array.isArray(t)){for(var i=0;i<t.length;i++){if(i in t){var v=t[i];if(t.hasOwnProperty(v)){r.push(i+":"+v);}}}}else{Object.keys(t).forEach(function(k){var v=t[k];if(v){r.push(k+"="+v);}});}return r;}
```

While there are obvious savings here (~80 bytes), for this derrived simple case once you add the helper implementations back to the `simpleTest` instance (about 240 bytes the 4 used functions) then you would be better off just using the normal functions as you would still be using 160 bytes less.

For any real world code though you will find that the normal JS functions are repeated a lot and that is when the savings kick in. Lets just take these 2 sinple examples and assume some very simple duplication of the same code.

| Instances | Real functions<br/>Total = count * 240 bytes | Using Helpers<br/>Total = (count * 160) + 240 bytes<br/><sub>assuming 240 bytes are only required once as the helpers don't need to be duplicated</sub><br/> | Delta
|-----------|---------------|--------------|------
| 1 | 240 | 400 | -160 bytes
| 2 | 480 | 560 | -80 bytes
| 3 | 720 | 720 | 0 bytes (break even)
| 4 | 960 | 880 | 80 bytes
| 5 | 1200 | 1040 | 160 bytes
| 10 | 2400 | 1840 | 560 bytes

In practice the savings are not so easily calculated as it really does depend on which functions you are using, how many times and the "length" of the function name and how you call the function. For example in the above this calls __`theValue.hasOwnProperty`__`(value)` which assumes that the `any` value passed is always an object and therefore has this function available, while the helper actually always calls __`Object.prototype.hasOwnProperty.call`__`(theValue,value)`, so it will always call the object instance and if you do this in your code suddenly you have 37 bytes of uncompressable code vs 15 (for just `hasOwnProperty`), while when you always use the helper each usage generally becomes a single byte __`h`__`(theValue)`.

What does this mean? Generally, that you savings will vary, but you _should_ find that by using these utility functions instead of the standard JavaScript versions (when available) you code will be smaller.

Could you do all of this yourself and create your own "helper" function -- Yes. In fact before publishing this set of utilities that is exactly what we did in every project, mostly just copying from the previous project. And whenever we "fixed" a bug or updated the functionality guess what happened... Update nightmare finding all of the instances in every project.

## Browser Support

General support is currently set to ES5 supported runtimes higher.

Internal polyfills are used to backfill ES5 functionality which is not provided by older browsers.

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png)
--- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | <center>9+ ✔</center> | Latest ✔ | Latest ✔ |

> Note: While some polyfills are provided to "somewhat" support ES3/IE8 this library does not intend to become a fully fledged polyfill library. And the polyfills provided (or contributed) are just the minimum set that have been required over time. And should be less necessary are time moves forward.

### Polyfills

All of the included polyfills are tested against the current native implementation running in `node`, `browser` and `worker` environments to ensure that they conform to the current specification, these polyfills are only internally used for ES5 compatibility and when running in an environment (mostly IE) that does not support the required function.

Some additional polyfills are provided for simple backward compatability to enable the utility functions in older environments (such as ES3 / IE8), however, you don't have to use or include these provided polyfils. If you need to use them you will need to import the pre-packaged "polyfill" bundle (`bundle/ts-polyfills-utils.min.js`) directly by hosting it on your own CDN or all of the non-internal polyfill implementations are exported so you could implement your own version of the [polyfill initializer](https://github.com/nevware21/ts-utils/blob/main/lib/src/polyfills.ts) or more simply provide your own alternatives.

> Note: Several functions use the [Object.defineProperty](https://caniuse.com/?search=Object.defineProperty) and therefore support is limited to runtimes or good polyfills that can correctly implement this functionality. (eg. createIterator; createIterable)

## Contributing

Read our [contributing guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

