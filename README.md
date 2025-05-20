<h1 align="center">@nevware21/ts-utils</h1>
<h2 align="center">Comprehensive TypeScript/JavaScript Utility Library</h2>

![GitHub Workflow Status (main)](https://img.shields.io/github/actions/workflow/status/nevware21/ts-utils/ci.yml?branch=main)
[![codecov](https://codecov.io/gh/nevware21/ts-utils/branch/main/graph/badge.svg?token=8YCAMUA7VB)](https://codecov.io/gh/nevware21/ts-utils)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fts-utils.svg)](https://badge.fury.io/js/%40nevware21%2Fts-utils)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![Sponsor](https://img.shields.io/badge/Sponsor-444444?logo=githubsponsors
)](https://github.com/sponsors/nevware21)

## Overview

A comprehensive TypeScript/JavaScript utility library that provides:

- **Cross-Environment Support**: Works seamlessly in Node.js, browsers, and web workers
- **Helper Functions**: Extensive collection of utility functions for common operations
- **Type Checking**: Robust type checking utilities to improve code reliability
- **Optimized for Minification**: Function naming designed for better minification
- **Zero Dependencies**: Lightweight and self-contained
- **ECMAScript Support**: Supports modern JavaScript features across ES5 to ES2023, ensuring broad usability in various environments
- **Polyfills**: Uses built-in functions to support older environments, providing modern JavaScript features without sacrificing compatibility

If you find this library useful, please consider [sponsoring @nevware21](https://github.com/sponsors/nevware21) to support ongoing development and maintenance.

## Installation

```bash
npm install @nevware21/ts-utils --save
```

**Recommended Version Specification:**
```json
"@nevware21/ts-utils": ">= 0.12.5 < 2.x"
```

> Note: v0.x and v1.x maintain ES5 compatibility. Future v2.x releases will update the baseline to newer ECMAScript versions.

## Key Features

### Environment Utilities
- Global object detection and access
- Environment detection (Node.js, browser, web worker)
- Safe access to environment-specific APIs

### Type Checking
- Comprehensive type checking for all JavaScript types
- Value validation helpers
- Advanced type checks for promises, iterables, and more

### Array Helpers
- Safe array manipulation with polyfills for older environments
- Cross-environment array utilities
- Performance-optimized implementations

### Object Utilities
- Property manipulation
- Deep copy/extend
- Object transformation helpers

### String Manipulation
- Case conversion (camelCase, kebab-case, snake_case)
- String transformation utilities
- HTML and JSON encoding

### Function Helpers
- Function binding and proxying utilities
- Argument manipulation
- Function creation helpers

### Time and Performance
- Consistent timing APIs across environments
- Performance measurement utilities
- Scheduling helpers with automatic polyfills
- [Customizable timeout handling](https://nevware21.github.io/ts-utils/timeout-overrides.html) via package-level and global overrides

For advanced timeout customization options, including global overrides, see our [Timeout Overrides Guide](https://nevware21.github.io/ts-utils/timeout-overrides.html).

### And More
- Math utilities
- Symbol polyfills
- RegExp helpers
- Iterator utilities

## Documentation & API Reference

Visit our [documentation site](https://nevware21.github.io/ts-utils/) for comprehensive guides and references.
- Full API documentation is available [in the TypeDoc documentation](https://nevware21.github.io/ts-utils/typedoc/index.html).
- For practical examples and usage patterns, check out our [Usage Guide](https://nevware21.github.io/ts-utils/usage-guide.html).
- For detailed documentation on creating and using custom deep copy handlers, see the [Advanced Deep Copy Handlers](https://nevware21.github.io/ts-utils/advanced-deep-copy.html) guide.

### Documentation Quick Links

| Category | Documentation |
|----------|---------------|
| Getting Started | [Usage Guide](https://nevware21.github.io/ts-utils/usage-guide.html) |
| Advanced Features | [Timeout Overrides](https://nevware21.github.io/ts-utils/timeout-overrides.html), [Deep Copy](https://nevware21.github.io/ts-utils/advanced-deep-copy.html) |
| Performance | [Bundle Size Optimization](https://nevware21.github.io/ts-utils/size-optimization.html) |
| API Reference | [TypeDoc Documentation](https://nevware21.github.io/ts-utils/typedoc/index.html) |

### Available Utilities

Below is a categorized list of all available utilities with direct links to their documentation:

| Type                       | Functions / Helpers / Aliases / Polyfills
|----------------------------|---------------------------------------------------
| Runtime Environment Checks | <code>[getCancelIdleCallback](https://nevware21.github.io/ts-utils/typedoc/functions/getCancelIdleCallback.html)(); [getDocument](https://nevware21.github.io/ts-utils/typedoc/functions/getDocument.html)(); [getGlobal](https://nevware21.github.io/ts-utils/typedoc/functions/getGlobal.html)(); [getHistory](https://nevware21.github.io/ts-utils/typedoc/functions/getHistory.html)(); [getIdleCallback](https://nevware21.github.io/ts-utils/typedoc/functions/getIdleCallback.html)(); [getInst](https://nevware21.github.io/ts-utils/typedoc/functions/getInst.html)(); [getNavigator](https://nevware21.github.io/ts-utils/typedoc/functions/getNavigator.html)(); [getPerformance](https://nevware21.github.io/ts-utils/typedoc/functions/getPerformance.html)(); [getWindow](https://nevware21.github.io/ts-utils/typedoc/functions/getWindow.html)(); [hasDocument](https://nevware21.github.io/ts-utils/typedoc/functions/hasDocument.html)(); [hasHistory](https://nevware21.github.io/ts-utils/typedoc/functions/hasHistory.html)(); [hasNavigator](https://nevware21.github.io/ts-utils/typedoc/functions/hasNavigator.html)(); [hasPerformance](https://nevware21.github.io/ts-utils/typedoc/functions/hasPerformance.html)(); [hasWindow](https://nevware21.github.io/ts-utils/typedoc/functions/hasWindow.html)(); [isNode](https://nevware21.github.io/ts-utils/typedoc/functions/isNode.html)(); [isWebWorker](https://nevware21.github.io/ts-utils/typedoc/functions/isWebWorker.html)(); [hasIdleCallback](https://nevware21.github.io/ts-utils/typedoc/functions/hasIdleCallback.html)(); [lazySafeGetInst](https://nevware21.github.io/ts-utils/typedoc/functions/lazySafeGetInst.html)(); </code>
| Type Identity              | <code>[isArray](https://nevware21.github.io/ts-utils/typedoc/functions/isArray.html)(); [isArrayBuffer](https://nevware21.github.io/ts-utils/typedoc/functions/isArrayBuffer.html)(); [isAsyncFunction](https://nevware21.github.io/ts-utils/typedoc/functions/isAsyncFunction.html)(); [isAsyncGenerator](https://nevware21.github.io/ts-utils/typedoc/functions/isAsyncGenerator.html)(); [isBigInt](https://nevware21.github.io/ts-utils/typedoc/functions/isBigInt.html)(); [isBlob](https://nevware21.github.io/ts-utils/typedoc/functions/isBlob.html)(); [isBoolean](https://nevware21.github.io/ts-utils/typedoc/functions/isBoolean.html)(); [isDate](https://nevware21.github.io/ts-utils/typedoc/functions/isDate.html)(); [isElement](https://nevware21.github.io/ts-utils/typedoc/functions/isElement.html)(); [isElementLike](https://nevware21.github.io/ts-utils/typedoc/functions/isElementLike.html)(); [isError](https://nevware21.github.io/ts-utils/typedoc/functions/isError.html)(); [isFile](https://nevware21.github.io/ts-utils/typedoc/functions/isFile.html)(); [isFiniteNumber](https://nevware21.github.io/ts-utils/typedoc/functions/isFiniteNumber.html)(); [isFormData](https://nevware21.github.io/ts-utils/typedoc/functions/isFormData.html)(); [isFunction](https://nevware21.github.io/ts-utils/typedoc/functions/isFunction.html)(); [isGenerator](https://nevware21.github.io/ts-utils/typedoc/functions/isGenerator.html)(); [isInteger](https://nevware21.github.io/ts-utils/typedoc/functions/isInteger.html)(); [isIterable](https://nevware21.github.io/ts-utils/typedoc/functions/isIterable.html)(); [isIterator](https://nevware21.github.io/ts-utils/typedoc/functions/isIterator.html)(); [isMap](https://nevware21.github.io/ts-utils/typedoc/functions/isMap.html)(); [isMapLike](https://nevware21.github.io/ts-utils/typedoc/functions/isMapLike.html)(); [isNullOrUndefined](https://nevware21.github.io/ts-utils/typedoc/functions/isNullOrUndefined.html)(); [isNumber](https://nevware21.github.io/ts-utils/typedoc/functions/isNumber.html)(); [isObject](https://nevware21.github.io/ts-utils/typedoc/functions/isObject.html)(); [isPlainObject](https://nevware21.github.io/ts-utils/typedoc/functions/isPlainObject.html)(); [isPrimitive](https://nevware21.github.io/ts-utils/typedoc/functions/isPrimitive.html)(); [isPrimitiveType](https://nevware21.github.io/ts-utils/typedoc/functions/isPrimitiveType.html)(); [isPromise](https://nevware21.github.io/ts-utils/typedoc/functions/isPromise.html)(); [isPromiseLike](https://nevware21.github.io/ts-utils/typedoc/functions/isPromiseLike.html)(); [isRegExp](https://nevware21.github.io/ts-utils/typedoc/functions/isRegExp.html)(); [isSet](https://nevware21.github.io/ts-utils/typedoc/functions/isSet.html)(); [isSetLike](https://nevware21.github.io/ts-utils/typedoc/functions/isSetLike.html)(); [isStrictNullOrUndefined](https://nevware21.github.io/ts-utils/typedoc/functions/isStrictNullOrUndefined.html)(); [isStrictUndefined](https://nevware21.github.io/ts-utils/typedoc/functions/isStrictUndefined.html)(); [isString](https://nevware21.github.io/ts-utils/typedoc/functions/isString.html)(); [isThenable](https://nevware21.github.io/ts-utils/typedoc/functions/isThenable.html)(); [isTypeof](https://nevware21.github.io/ts-utils/typedoc/functions/isTypeof.html)(); [isUndefined](https://nevware21.github.io/ts-utils/typedoc/functions/isUndefined.html)(); [isWeakMap](https://nevware21.github.io/ts-utils/typedoc/functions/isWeakMap.html)(); [isWeakSet](https://nevware21.github.io/ts-utils/typedoc/functions/isWeakSet.html)();</code>
| Value Check                | <code>[hasValue](https://nevware21.github.io/ts-utils/typedoc/functions/hasValue.html)(); [isDefined](https://nevware21.github.io/ts-utils/typedoc/functions/isDefined.html)(); [isEmpty](https://nevware21.github.io/ts-utils/typedoc/functions/isEmpty.html)(); [isNotTruthy](https://nevware21.github.io/ts-utils/typedoc/functions/isNotTruthy.html)(); [isNullOrUndefined](https://nevware21.github.io/ts-utils/typedoc/functions/isNullOrUndefined.html)(); [isStrictNullOrUndefined](https://nevware21.github.io/ts-utils/typedoc/functions/isStrictNullOrUndefined.html)(); [isStrictUndefined](https://nevware21.github.io/ts-utils/typedoc/functions/isStrictUndefined.html)(); [isTruthy](https://nevware21.github.io/ts-utils/typedoc/functions/isTruthy.html)(); [isUndefined](https://nevware21.github.io/ts-utils/typedoc/functions/isUndefined.html)();</code>
| Value                      | <code>[getValueByKey](https://nevware21.github.io/ts-utils/typedoc/functions/getValueByKey.html)(); [setValueByKey](https://nevware21.github.io/ts-utils/typedoc/functions/setValueByKey.html)(); [getValueByIter](https://nevware21.github.io/ts-utils/typedoc/functions/getValueByIter.html)(); [setValueByIter](https://nevware21.github.io/ts-utils/typedoc/functions/setValueByIter.html)(); [encodeAsJson](https://nevware21.github.io/ts-utils/typedoc/functions/encodeAsJson.html)(); [encodeAsHtml](https://nevware21.github.io/ts-utils/typedoc/functions/encodeAsHtml.html)(); [asString](https://nevware21.github.io/ts-utils/typedoc/functions/asString.html)(); [getIntValue](https://nevware21.github.io/ts-utils/typedoc/functions/getIntValue.html)(); [normalizeJsName](https://nevware21.github.io/ts-utils/typedoc/functions/normalizeJsName.html)();</code>
| &nbsp;                     | &nbsp;
| Array                      | <code>[arrAppend](https://nevware21.github.io/ts-utils/typedoc/functions/arrAppend.html)(); [arrContains](https://nevware21.github.io/ts-utils/typedoc/functions/arrContains.html)(); [arrEvery](https://nevware21.github.io/ts-utils/typedoc/functions/arrEvery.html)(); [arrFilter](https://nevware21.github.io/ts-utils/typedoc/functions/arrFilter.html)(); [arrFind](https://nevware21.github.io/ts-utils/typedoc/functions/arrFind.html)(); [arrFindIndex](https://nevware21.github.io/ts-utils/typedoc/functions/arrFindIndex.html)(); [arrFindLast](https://nevware21.github.io/ts-utils/typedoc/functions/arrFindLast.html)(); [arrFindLastIndex](https://nevware21.github.io/ts-utils/typedoc/functions/arrFindLastIndex.html)(); [arrForEach](https://nevware21.github.io/ts-utils/typedoc/functions/arrForEach.html)(); [arrFrom](https://nevware21.github.io/ts-utils/typedoc/functions/arrFrom.html)(); [arrIncludes](https://nevware21.github.io/ts-utils/typedoc/functions/arrIncludes.html)(); [arrIndexOf](https://nevware21.github.io/ts-utils/typedoc/functions/arrIndexOf.html)(); [arrLastIndexOf](https://nevware21.github.io/ts-utils/typedoc/functions/arrLastIndexOf.html)(); [arrMap](https://nevware21.github.io/ts-utils/typedoc/functions/arrMap.html)(); [arrReduce](https://nevware21.github.io/ts-utils/typedoc/functions/arrReduce.html)(); [arrSlice](https://nevware21.github.io/ts-utils/typedoc/functions/arrSlice.html)(); [arrSome](https://nevware21.github.io/ts-utils/typedoc/functions/arrSome.html)(); [getLength](https://nevware21.github.io/ts-utils/typedoc/functions/getLength.html)(); [isArray](https://nevware21.github.io/ts-utils/typedoc/functions/isArray.html)();<br/>[polyIsArray](https://nevware21.github.io/ts-utils/typedoc/functions/polyIsArray.html)(); [polyArrIncludes](https://nevware21.github.io/ts-utils/typedoc/functions/polyArrIncludes.html)(); [polyArrFind](https://nevware21.github.io/ts-utils/typedoc/functions/polyArrFind.html)(); [polyArrFindIndex](https://nevware21.github.io/ts-utils/typedoc/functions/polyArrFindIndex.html)(); [polyArrFindLastIndex](https://nevware21.github.io/ts-utils/typedoc/functions/polyArrFindLastIndex.html)(); [polyArrFindLast](https://nevware21.github.io/ts-utils/typedoc/functions/polyArrFindLast.html)(); [polyArrFindLastIndex](https://nevware21.github.io/ts-utils/typedoc/functions/polyArrFindLastIndex.html)(); [polyArrFrom](https://nevware21.github.io/ts-utils/typedoc/functions/polyArrFrom.html)();</code>
| ArrayLike                  | <code>[arrContains](https://nevware21.github.io/ts-utils/typedoc/functions/arrContains.html)(); [arrEvery](https://nevware21.github.io/ts-utils/typedoc/functions/arrEvery.html)(); [arrFilter](https://nevware21.github.io/ts-utils/typedoc/functions/arrFilter.html)(); [arrFind](https://nevware21.github.io/ts-utils/typedoc/functions/arrFind.html)(); [arrFindIndex](https://nevware21.github.io/ts-utils/typedoc/functions/arrFindIndex.html)(); [arrFindLast](https://nevware21.github.io/ts-utils/typedoc/functions/arrFindLast.html)(); [arrFindLastIndex](https://nevware21.github.io/ts-utils/typedoc/functions/arrFindLastIndex.html)(); [arrForEach](https://nevware21.github.io/ts-utils/typedoc/functions/arrForEach.html)(); [arrFrom](https://nevware21.github.io/ts-utils/typedoc/functions/arrFrom.html)(); [arrIncludes](https://nevware21.github.io/ts-utils/typedoc/functions/arrIncludes.html)(); [arrIndexOf](https://nevware21.github.io/ts-utils/typedoc/functions/arrIndexOf.html)(); [arrLastIndexOf](https://nevware21.github.io/ts-utils/typedoc/functions/arrLastIndexOf.html)(); [arrMap](https://nevware21.github.io/ts-utils/typedoc/functions/arrMap.html)(); [arrReduce](https://nevware21.github.io/ts-utils/typedoc/functions/arrReduce.html)(); [arrSlice](https://nevware21.github.io/ts-utils/typedoc/functions/arrSlice.html)(); [arrSome](https://nevware21.github.io/ts-utils/typedoc/functions/arrSome.html)(); [getLength](https://nevware21.github.io/ts-utils/typedoc/functions/getLength.html)(); [objEntries](https://nevware21.github.io/ts-utils/typedoc/functions/objEntries.html)(); [objValues](https://nevware21.github.io/ts-utils/typedoc/functions/objValues.html)();</code>
| DOM                        | <code>[isElement](https://nevware21.github.io/ts-utils/typedoc/functions/isElement.html)(); [isElementLike](https://nevware21.github.io/ts-utils/typedoc/functions/isElementLike.html)();</code>
| Enum                       | <code>[createEnum](https://nevware21.github.io/ts-utils/typedoc/functions/createEnum.html)(); [createEnumKeyMap](https://nevware21.github.io/ts-utils/typedoc/functions/createEnumKeyMap.html)(); [createEnumValueMap](https://nevware21.github.io/ts-utils/typedoc/functions/createEnumValueMap.html)(); [createSimpleMap](https://nevware21.github.io/ts-utils/typedoc/functions/createSimpleMap.html)(); [createTypeMap](https://nevware21.github.io/ts-utils/typedoc/functions/createTypeMap.html)();</code>
| Error                      | <code>[createCustomError](https://nevware21.github.io/ts-utils/typedoc/functions/createCustomError.html)(); [isError](https://nevware21.github.io/ts-utils/typedoc/functions/isError.html)(); [throwError](https://nevware21.github.io/ts-utils/typedoc/functions/throwError.html)(); [throwRangeError](https://nevware21.github.io/ts-utils/typedoc/functions/throwRangeError.html)(); [throwTypeError](https://nevware21.github.io/ts-utils/typedoc/functions/throwTypeError.html)(); [throwUnsupported](https://nevware21.github.io/ts-utils/typedoc/functions/throwUnsupported.html)();</code>
| Function                   | <code>[fnApply](https://nevware21.github.io/ts-utils/typedoc/functions/fnApply.html)(); [fnBind](https://nevware21.github.io/ts-utils/typedoc/functions/fnBind.html)(); [fnCall](https://nevware21.github.io/ts-utils/typedoc/functions/fnCall.html)(); [createFnDeferredProxy](https://nevware21.github.io/ts-utils/typedoc/functions/createFnDeferredProxy.html)(); [createProxyFuncs](https://nevware21.github.io/ts-utils/typedoc/functions/createProxyFuncs.html)(); [readArgs](https://nevware21.github.io/ts-utils/typedoc/functions/readArgs.html)();</code>
| Idle                       | <code>[getCancelIdleCallback](https://nevware21.github.io/ts-utils/typedoc/functions/getCancelIdleCallback.html)(); [getIdleCallback](https://nevware21.github.io/ts-utils/typedoc/functions/getIdleCallback.html)(); [hasIdleCallback](https://nevware21.github.io/ts-utils/typedoc/functions/hasIdleCallback.html)(); [setDefaultIdleTimeout](https://nevware21.github.io/ts-utils/typedoc/functions/setDefaultIdleTimeout.html)(); [setDefaultMaxExecutionTime](https://nevware21.github.io/ts-utils/typedoc/functions/setDefaultMaxExecutionTime.html)(); </code>
| Iterator                   | <code>[createArrayIterator](https://nevware21.github.io/ts-utils/typedoc/functions/createArrayIterator.html)(); [createIterator](https://nevware21.github.io/ts-utils/typedoc/functions/createIterator.html)(); [createIterable](https://nevware21.github.io/ts-utils/typedoc/functions/createIterable.html)(); [createRangeIterator](https://nevware21.github.io/ts-utils/typedoc/functions/createRangeIterator.html)(); [iterForOf](https://nevware21.github.io/ts-utils/typedoc/functions/iterForOf.html)(); [isIterable](https://nevware21.github.io/ts-utils/typedoc/functions/isIterable.html)(); [isIterator](https://nevware21.github.io/ts-utils/typedoc/functions/isIterator.html)(); [makeIterable](https://nevware21.github.io/ts-utils/typedoc/functions/makeIterable.html)(); [arrAppend](https://nevware21.github.io/ts-utils/typedoc/functions/arrAppend.html)(); [arrFrom](https://nevware21.github.io/ts-utils/typedoc/functions/arrFrom.html)();</code>
| Number                     | <code>[getIntValue](https://nevware21.github.io/ts-utils/typedoc/functions/getIntValue.html)(); [isInteger](https://nevware21.github.io/ts-utils/typedoc/functions/isInteger.html)(); [isFiniteNumber](https://nevware21.github.io/ts-utils/typedoc/functions/isFiniteNumber.html)(); [isNumber](https://nevware21.github.io/ts-utils/typedoc/functions/isNumber.html)();</code>
| Math                       | <code>[mathAbs](https://nevware21.github.io/ts-utils/typedoc/functions/mathAbs.html)(); [mathAcos](https://nevware21.github.io/ts-utils/typedoc/functions/mathAcos.html)(); [mathAsin](https://nevware21.github.io/ts-utils/typedoc/functions/mathAsin.html)(); [mathAtan](https://nevware21.github.io/ts-utils/typedoc/functions/mathAtan.html)(); [mathAtan2](https://nevware21.github.io/ts-utils/typedoc/functions/mathAtan2.html)(); [mathCeil](https://nevware21.github.io/ts-utils/typedoc/functions/mathCeil.html)(); [mathCos](https://nevware21.github.io/ts-utils/typedoc/functions/mathCos.html)(); [mathExp](https://nevware21.github.io/ts-utils/typedoc/functions/mathExp.html)(); [mathFloor](https://nevware21.github.io/ts-utils/typedoc/functions/mathFloor.html)(); [mathLog](https://nevware21.github.io/ts-utils/typedoc/functions/mathLog.html)(); [mathMax](https://nevware21.github.io/ts-utils/typedoc/functions/mathMax.html)(); [mathMin](https://nevware21.github.io/ts-utils/typedoc/functions/mathMin.html)(); [mathPow](https://nevware21.github.io/ts-utils/typedoc/functions/mathPow.html)(); [mathRandom](https://nevware21.github.io/ts-utils/typedoc/functions/mathRandom.html)(); [mathRound](https://nevware21.github.io/ts-utils/typedoc/functions/mathRound.html)(); [mathSin](https://nevware21.github.io/ts-utils/typedoc/functions/mathSin.html)(); [mathSqrt](https://nevware21.github.io/ts-utils/typedoc/functions/mathSqrt.html)(); [mathTan](https://nevware21.github.io/ts-utils/typedoc/functions/mathTan.html)(); [mathToInt](https://nevware21.github.io/ts-utils/typedoc/functions/mathToInt.html)(); [mathTrunc](https://nevware21.github.io/ts-utils/typedoc/functions/mathTrunc.html)();</code>
| Object                     | <code>[deepExtend](https://nevware21.github.io/ts-utils/typedoc/functions/deepExtend.html)(); [isObject](https://nevware21.github.io/ts-utils/typedoc/functions/isObject.html)(); [objAssign](https://nevware21.github.io/ts-utils/typedoc/functions/objAssign.html)(); [objCopyProps](https://nevware21.github.io/ts-utils/typedoc/functions/objCopyProps.html)(); [objCreate](https://nevware21.github.io/ts-utils/typedoc/functions/objCreate.html)(); [objDeepCopy](https://nevware21.github.io/ts-utils/typedoc/functions/objDeepCopy.html)(); [objDeepFreeze](https://nevware21.github.io/ts-utils/typedoc/functions/objDeepFreeze.html)(); [objDefine](https://nevware21.github.io/ts-utils/typedoc/functions/objDefine.html)(); [objDefineAccessors](https://nevware21.github.io/ts-utils/typedoc/functions/objDefineAccessors.html)(); [objDefineGet](https://nevware21.github.io/ts-utils/typedoc/functions/objDefineGet.html)(); [objDefineProp](https://nevware21.github.io/ts-utils/typedoc/functions/objDefineProp.html)(); [objDefineProps](https://nevware21.github.io/ts-utils/typedoc/functions/objDefineProps.html)(); [objDefineProperties](https://nevware21.github.io/ts-utils/typedoc/functions/objDefineProperties.html)(); [objEntries](https://nevware21.github.io/ts-utils/typedoc/functions/objEntries.html)(); [objExtend](https://nevware21.github.io/ts-utils/typedoc/functions/objExtend.html)(); [objForEachKey](https://nevware21.github.io/ts-utils/typedoc/functions/objForEachKey.html)(); [objFreeze](https://nevware21.github.io/ts-utils/typedoc/functions/objFreeze.html)(); [objFromEntries](https://nevware21.github.io/ts-utils/typedoc/functions/objFromEntries.html)(); [objGetOwnPropertyDescriptor](https://nevware21.github.io/ts-utils/typedoc/functions/objGetOwnPropertyDescriptor.html)(); [objGetOwnPropertyDescriptors](https://nevware21.github.io/ts-utils/typedoc/functions/objGetOwnPropertyDescriptors.html)(); [objGetOwnPropertyNames](https://nevware21.github.io/ts-utils/typedoc/functions/objGetOwnPropertyNames.html)(); [objGetOwnPropertySymbols](https://nevware21.github.io/ts-utils/typedoc/functions/objGetOwnPropertySymbols.html)(); [objHasOwn](https://nevware21.github.io/ts-utils/typedoc/functions/objHasOwn.html)(); [objHasOwnProperty](https://nevware21.github.io/ts-utils/typedoc/functions/objHasOwnProperty.html)(); [objIs](https://nevware21.github.io/ts-utils/typedoc/functions/objIs.html)(); [objIsExtensible](https://nevware21.github.io/ts-utils/typedoc/functions/objIsExtensible.html)(); [objIsFrozen](https://nevware21.github.io/ts-utils/typedoc/functions/objIsFrozen.html)(); [objIsSealed](https://nevware21.github.io/ts-utils/typedoc/functions/objIsSealed.html)(); [objKeys](https://nevware21.github.io/ts-utils/typedoc/functions/objKeys.html)(); [objPreventExtensions](https://nevware21.github.io/ts-utils/typedoc/functions/objPreventExtensions.html)(); [objPropertyIsEnumerable](https://nevware21.github.io/ts-utils/typedoc/functions/objPropertyIsEnumerable.html)(); [objSeal](https://nevware21.github.io/ts-utils/typedoc/functions/objSeal.html)(); [objGetPrototypeOf](https://nevware21.github.io/ts-utils/typedoc/functions/objGetPrototypeOf.html)(); [objSetPrototypeOf](https://nevware21.github.io/ts-utils/typedoc/functions/objSetPrototypeOf.html)(); [objToString](https://nevware21.github.io/ts-utils/typedoc/functions/objToString.html)(); [objValues](https://nevware21.github.io/ts-utils/typedoc/functions/objValues.html)();<br/>[polyObjEntries](https://nevware21.github.io/ts-utils/typedoc/functions/polyObjEntries.html)(); [polyObjIs](https://nevware21.github.io/ts-utils/typedoc/functions/polyObjIs.html)(); [polyObjKeys](https://nevware21.github.io/ts-utils/typedoc/functions/polyObjKeys.html)();</code>
| String                     | <code>[asString](https://nevware21.github.io/ts-utils/typedoc/functions/asString.html)(); [getLength](https://nevware21.github.io/ts-utils/typedoc/functions/getLength.html)(); [isString](https://nevware21.github.io/ts-utils/typedoc/functions/isString.html)(); [strEndsWith](https://nevware21.github.io/ts-utils/typedoc/functions/strEndsWith.html)(); [strIndexOf](https://nevware21.github.io/ts-utils/typedoc/functions/strIndexOf.html)(); [strIsNullOrEmpty](https://nevware21.github.io/ts-utils/typedoc/functions/strIsNullOrEmpty.html)(); [strIsNullOrWhiteSpace](https://nevware21.github.io/ts-utils/typedoc/functions/strIsNullOrWhiteSpace.html)(); [strLastIndexOf](https://nevware21.github.io/ts-utils/typedoc/functions/strLastIndexOf.html)(); [strLeft](https://nevware21.github.io/ts-utils/typedoc/functions/strLeft.html)(); [strPadEnd](https://nevware21.github.io/ts-utils/typedoc/functions/strPadEnd.html)(); [strPadStart](https://nevware21.github.io/ts-utils/typedoc/functions/strPadStart.html)(); [strRepeat](https://nevware21.github.io/ts-utils/typedoc/functions/strRepeat.html)(); [strRight](https://nevware21.github.io/ts-utils/typedoc/functions/strRight.html)(); [strSlice](https://nevware21.github.io/ts-utils/typedoc/functions/strSlice.html)(); [strSplit](https://nevware21.github.io/ts-utils/typedoc/functions/strSplit.html)(); [strStartsWith](https://nevware21.github.io/ts-utils/typedoc/functions/strStartsWith.html)(); [strSubstr](https://nevware21.github.io/ts-utils/typedoc/functions/strSubstr.html)(); [strSubstring](https://nevware21.github.io/ts-utils/typedoc/functions/strSubstring.html)(); [strSymSplit](https://nevware21.github.io/ts-utils/typedoc/functions/strSymSplit.html)(); [strTrim](https://nevware21.github.io/ts-utils/typedoc/functions/strTrim.html)(); [strTrimEnd](https://nevware21.github.io/ts-utils/typedoc/functions/strTrimEnd.html)(); [strTrimLeft](https://nevware21.github.io/ts-utils/typedoc/functions/strTrimLeft.html)(); [strTrimRight](https://nevware21.github.io/ts-utils/typedoc/functions/strTrimRight.html)(); [strTrimStart](https://nevware21.github.io/ts-utils/typedoc/functions/strTrimStart.html)(); [strLetterCase](https://nevware21.github.io/ts-utils/typedoc/functions/strLetterCase.html)(); [strCamelCase](https://nevware21.github.io/ts-utils/typedoc/functions/strCamelCase.html)(); [strKebabCase](https://nevware21.github.io/ts-utils/typedoc/functions/strKebabCase.html)(); [strSnakeCase](https://nevware21.github.io/ts-utils/typedoc/functions/strSnakeCase.html)(); [strUpper](https://nevware21.github.io/ts-utils/typedoc/functions/strUpper.html)(); [strLower](https://nevware21.github.io/ts-utils/typedoc/functions/strLower.html)(); [strContains](https://nevware21.github.io/ts-utils/typedoc/functions/strContains.html)(); [strIncludes](https://nevware21.github.io/ts-utils/typedoc/functions/strIncludes.html)(); <br/>[polyStrSubstr](https://nevware21.github.io/ts-utils/typedoc/functions/polyStrSubstr.html)(); [polyStrTrim](https://nevware21.github.io/ts-utils/typedoc/functions/polyStrTrim.html)(); [polyStrTrimEnd](https://nevware21.github.io/ts-utils/typedoc/functions/polyStrTrimEnd.html)(); [polyStrTrimStart](https://nevware21.github.io/ts-utils/typedoc/functions/polyStrTrimStart.html)(); [polyStrIncludes](https://nevware21.github.io/ts-utils/typedoc/functions/polyStrIncludes.html)(); </code>
| Symbol                     | <code>[WellKnownSymbols](https://nevware21.github.io/ts-utils/typedoc/enums/WellKnownSymbols.html) (const enum);<br/>[getKnownSymbol](https://nevware21.github.io/ts-utils/typedoc/functions/getKnownSymbol.html)(); [getSymbol](https://nevware21.github.io/ts-utils/typedoc/functions/getSymbol.html)(); [hasSymbol](https://nevware21.github.io/ts-utils/typedoc/functions/hasSymbol.html)(); [isSymbol](https://nevware21.github.io/ts-utils/typedoc/functions/isSymbol.html)(); [newSymbol](https://nevware21.github.io/ts-utils/typedoc/functions/newSymbol.html)(); [symbolFor](https://nevware21.github.io/ts-utils/typedoc/functions/symbolFor.html)(); [symbolKeyFor](https://nevware21.github.io/ts-utils/typedoc/functions/symbolKeyFor.html)();<br/>[polyGetKnownSymbol](https://nevware21.github.io/ts-utils/typedoc/functions/polyGetKnownSymbol.html)(); [polyNewSymbol](https://nevware21.github.io/ts-utils/typedoc/functions/polyNewSymbol.html)(); [polySymbolFor](https://nevware21.github.io/ts-utils/typedoc/functions/polySymbolFor.html)(); [polySymbolKeyFor](https://nevware21.github.io/ts-utils/typedoc/functions/polySymbolKeyFor.html)();</code><br/>Polyfills are used to automatically backfill runtimes that do not support `Symbol`, not all of the Symbol functionality is provided.
| Timer                      | <code>[createTimeout](https://nevware21.github.io/ts-utils/typedoc/functions/createTimeout.html)(); [createTimeoutWith](https://nevware21.github.io/ts-utils/typedoc/functions/createTimeoutWith.html)(); [elapsedTime](https://nevware21.github.io/ts-utils/typedoc/functions/elapsedTime.html)(); [perfNow](https://nevware21.github.io/ts-utils/typedoc/functions/perfNow.html)(); [setGlobalTimeoutOverrides](https://nevware21.github.io/ts-utils/typedoc/functions/setGlobalTimeoutOverrides.html)(); [setTimeoutOverrides](https://nevware21.github.io/ts-utils/typedoc/functions/setTimeoutOverrides.html)(); [utcNow](https://nevware21.github.io/ts-utils/typedoc/functions/utcNow.html)(); [scheduleIdleCallback](https://nevware21.github.io/ts-utils/typedoc/functions/scheduleIdleCallback.html)(); [scheduleInterval](https://nevware21.github.io/ts-utils/typedoc/functions/scheduleInterval.html)(); [scheduleTimeout](https://nevware21.github.io/ts-utils/typedoc/functions/scheduleTimeout.html)(); [scheduleTimeoutWith](https://nevware21.github.io/ts-utils/typedoc/functions/scheduleTimeoutWith.html)(); [hasIdleCallback](https://nevware21.github.io/ts-utils/typedoc/functions/hasIdleCallback.html)();</code><br/>For runtimes that don't support `requestIdleCallback` normal setTimeout() is used with the values from [`setDefaultIdleTimeout`](https://nevware21.github.io/ts-utils/typedoc/functions/setDefaultIdleTimeout.html)() and [`setDefaultMaxExecutionTime`](https://nevware21.github.io/ts-utils/typedoc/functions/setDefaultMaxExecutionTime.html)(); <br /><code>[polyUtcNow](https://nevware21.github.io/ts-utils/typedoc/functions/polyUtcNow.html)();</code>
| Conversion                 | <code>[encodeAsJson](https://nevware21.github.io/ts-utils/typedoc/functions/encodeAsJson.html)(); [encodeAsHtml](https://nevware21.github.io/ts-utils/typedoc/functions/encodeAsHtml.html)(); [asString](https://nevware21.github.io/ts-utils/typedoc/functions/asString.html)(); [getIntValue](https://nevware21.github.io/ts-utils/typedoc/functions/getIntValue.html)(); [normalizeJsName](https://nevware21.github.io/ts-utils/typedoc/functions/normalizeJsName.html)(); [strLetterCase](https://nevware21.github.io/ts-utils/typedoc/functions/strLetterCase.html)(); [strCamelCase](https://nevware21.github.io/ts-utils/typedoc/functions/strCamelCase.html)(); [strKebabCase](https://nevware21.github.io/ts-utils/typedoc/functions/strKebabCase.html)(); [strSnakeCase](https://nevware21.github.io/ts-utils/typedoc/functions/strSnakeCase.html)(); [strUpper](https://nevware21.github.io/ts-utils/typedoc/functions/strUpper.html)(); [strLower](https://nevware21.github.io/ts-utils/typedoc/functions/strLower.html)(); </code>
| Cache                      | <code>[createCachedValue](https://nevware21.github.io/ts-utils/typedoc/functions/createCachedValue.html)(); [createDeferredCachedValue](https://nevware21.github.io/ts-utils/typedoc/functions/createDeferredCachedValue.html)(); [getDeferred](https://nevware21.github.io/ts-utils/typedoc/functions/getDeferred.html)(); [getWritableDeferred](https://nevware21.github.io/ts-utils/typedoc/functions/getWritableDeferred.html)();</code>
| Lazy                       | <code>[getLazy](https://nevware21.github.io/ts-utils/typedoc/functions/getLazy.html)(); [getWritableLazy](https://nevware21.github.io/ts-utils/typedoc/functions/getWritableLazy.html)(); [lazySafeGetInst](https://nevware21.github.io/ts-utils/typedoc/functions/lazySafeGetInst.html)(); [safeGetLazy](https://nevware21.github.io/ts-utils/typedoc/functions/safeGetLazy.html)(); [safeGetLazy](https://nevware21.github.io/ts-utils/typedoc/functions/safeGetLazy.html)(); [setBypassLazyCache](https://nevware21.github.io/ts-utils/typedoc/functions/setBypassLazyCache.html)();</code>
| Safe                       | <code>[safe](https://nevware21.github.io/ts-utils/typedoc/functions/safe.html)(); [safeGetLazy](https://nevware21.github.io/ts-utils/typedoc/functions/safeGetLazy.html)(); [safeGet](https://nevware21.github.io/ts-utils/typedoc/functions/safeGet.html)(); [safeGetDeferred](https://nevware21.github.io/ts-utils/typedoc/functions/safeGetDeferred.html)(); [safeGetWritableDeferred](https://nevware21.github.io/ts-utils/typedoc/functions/safeGetWritableDeferred.html)(); [lazySafeGetInst](https://nevware21.github.io/ts-utils/typedoc/functions/lazySafeGetInst.html)(); [safeGetWritableLazy](https://nevware21.github.io/ts-utils/typedoc/functions/safeGetWritableLazy.html)(); </code>
| Diagnostic                 | <code>[dumpObj](https://nevware21.github.io/ts-utils/typedoc/functions/dumpObj.html)(); </code>
| RegEx                 | <code>[createFilenameRegex](https://nevware21.github.io/ts-utils/typedoc/functions/createFilenameRegex.html)(); [createWildcardRegex](https://nevware21.github.io/ts-utils/typedoc/functions/createWildcardRegex.html)(); [makeGlobRegex](https://nevware21.github.io/ts-utils/typedoc/functions/makeGlobRegex.html)(); </code>

> Unless otherwise stated in the functions documentation polyfills are used to automatically backfill unsupported functions in older ES5 runtimes

## Why Use ts-utils?

### 1. Better Minification

Using ts-utils helper functions can significantly reduce your bundle size compared to standard JavaScript methods:

```typescript
// Standard JavaScript - Can't be minified effectively
function stdCode(obj) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        // Do something
      }
    }
  }
}

// Using ts-utils - Allows better minification
import { isArray, arrForEach, objHasOwnProperty } from "@nevware21/ts-utils";

function optimizedCode(obj) {
  if (isArray(obj)) {
    arrForEach(obj, (value, idx) => {
      if (objHasOwnProperty(obj, idx)) {
        // Do something
      }
    });
  }
}
```

When minified, the ts-utils version is significantly smaller as function names can be reduced to single characters.

### 2. Cross-Environment Compatibility

Write code once that works across all environments without worrying about platform-specific APIs:

```typescript
import { getGlobal, isNode, isWebWorker } from "@nevware21/ts-utils";

// Safely access the global object in any environment
const globalObj = getGlobal();

// Environment detection
if (isNode()) {
  // Node.js specific code
} else if (isWebWorker()) {
  // Web Worker specific code
} else {
  // Browser specific code
}
```

### 3. Type Safety

Robust type checking utilities to make your code more reliable:

```typescript
import { 
  isString, isNumber, isObject, isArray, 
  isNullOrUndefined, isPromise 
} from "@nevware21/ts-utils";

function processValue(value: any) {
  if (isString(value)) {
    return value.toUpperCase();
  } else if (isNumber(value)) {
    return value * 2;
  } else if (isArray(value)) {
    return value.length;
  } else if (isPromise(value)) {
    return value.then(result => result);
  } else if (isNullOrUndefined(value)) {
    return "No value provided";
  }
  
  return "Unknown type";
}
```

### 4. Modern ECMAScript Features

Support for newer ECMAScript features with backward compatibility:

```typescript
import {
  arrFindLast, arrFindLastIndex, // ES2023
  objGetOwnPropertyDescriptors, // ES2017
  strPadStart, strPadEnd, // ES2017
  isBigInt, // ES2020
  isWeakMap, isWeakSet // ES2015+
} from "@nevware21/ts-utils";

// Using ES2023 array methods with backward compatibility
const numbers = [5, 12, 8, 130, 44];
const lastBigNumber = arrFindLast(numbers, num => num > 10); // 44
const lastBigNumberIndex = arrFindLastIndex(numbers, num => num > 10); // 4

// Safe property descriptor access (ES2017)
const descriptors = objGetOwnPropertyDescriptors(myObject);

// String padding (ES2017)
const paddedString = strPadStart("123", 5, "0"); // "00123"
const paddedEnd = strPadEnd("hello", 10, "."); // "hello....."

// Safe type checks for modern types
if (isBigInt(someValue)) {
  // Handle BigInt (ES2020) safely
}
```

## Test Environments

This library is thoroughly tested in:

- Node.js (16, 18, 20, 22)
- Modern browsers (via Chromium headless)
- Web Workers (via Chromium headless)

All polyfill functions are tested against native implementations to ensure full compatibility.

## Module Support

The library supports multiple module formats to accommodate different project setups:

- ES Modules (ESM)
- CommonJS (CJS)
- Universal Module Definition (UMD)

## Language Support

### ES5 Compatibility

This library maintains ES5 compatibility for all v0.x and v1.x releases, ensuring support for any runtime that supports ES5 or higher.

Internal polyfills are used to backfill ES5 functionality which is not provided by older runtimes / browsers.

#### Future ECMAScript Support

Starting with v2.x, the library plans to update its baseline to target newer ECMAScript versions, reducing the need for polyfills as browser and runtime support evolves.

### Browser Support

![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Opera](https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![IE](https://raw.githubusercontent.com/alrra/browser-logos/36.0.0/internet-explorer/internet-explorer_48x48.png)
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔  | Latest ✔ | Latest ✔ | Latest ✔ | <center>9+ ✔</center> |

> Internet Explorer support will be dropped in v2.x

### Polyfills

All of the included polyfills are tested against the current native implementation running in `node`, `browser` and `worker` environments to ensure that they conform to the current specification, these polyfills are only internally used for ES5 compatibility and when running in an environment (mostly IE) that does not support the required function.

Some additional polyfills are provided for simple backward compatibility to enable the utility functions in older environments, however, you don't have to use or include these provided polyfils. If you need to use them you will need to import the pre-packaged "polyfill" bundle (`bundle/ts-polyfills-utils.min.js`) directly by hosting it on your own CDN or all of the non-internal polyfill implementations are exported so you could implement your own version of the [polyfill initializer](https://github.com/nevware21/ts-utils/blob/main/lib/src/polyfills.ts) or more simply provide your own alternatives.

> Notes:
> - While some polyfills are provided to "somewhat" support older environments this library does not intend to become a fully fledged polyfill library. And the polyfills provided (or contributed) are just the minimum set that have been required over time. And should be less necessary are time moves forward.
> - Several functions use the [Object.defineProperty](https://caniuse.com/?search=Object.defineProperty) and therefore support is limited to runtimes or good polyfills that can correctly implement this functionality. (eg. createIterator; createIterable)

### TypeScript Support

Built with TypeScript v5.2.2, with minimal requirements of TypeScript v2.8+ for the type definitions.

## Size Analysis and Bundle Optimization

### Bundle Size Impact

The ts-utils library is designed with size optimization as a primary goal. Each function is independently importable and has been optimized for tree-shaking in modern bundlers like Webpack and Rollup. This allows you to include only what you need in your final bundle.

Here's a comparison of bundle sizes when using ts-utils versus standard JavaScript approaches:

| Scenario | Standard JS | With ts-utils | Size Reduction |
|----------|-------------|---------------|----------------|
| Basic type checking | ~1.2KB | ~0.3KB | ~75% |
| Array operations | ~0.9KB | ~0.4KB | ~55% |
| String utilities | ~1.5KB | ~0.6KB | ~60% |
| Object helpers | ~2.1KB | ~0.8KB | ~62% |

For detailed byte-level measurements and concrete size optimization strategies, check out our [Bundle Size Optimization Guide](https://nevware21.github.io/ts-utils/size-optimization.html).


> Note: Actual size savings depend on your specific usage patterns, minification settings, and bundler configuration.

### When to Use ts-utils for Repeated Functions

You should consider using ts-utils helper functions when:

1. **Your code uses the same operations repeatedly**: If you're frequently checking types, manipulating arrays/objects, or working with strings, using ts-utils can reduce repetition and improve minification.

2. **Bundle size is a concern**: For applications where download size matters (e.g., mobile web apps, SPAs), ts-utils can significantly reduce your bundle size through better minification.

3. **Cross-environment compatibility is needed**: When your code needs to run across Node.js, browsers, and web workers without environment-specific code paths.

4. **You want better tree-shaking**: The library is designed to allow bundlers to eliminate unused code effectively.

5. **Consistent API access is important**: ts-utils provides a unified API for accessing functionality that might be implemented differently across environments.

For example, instead of repeating this pattern across your codebase:

```javascript
// Before: Multiple instances of this pattern across your code
if (typeof value === 'object' && value !== null && Array.isArray(value)) {
  for (let i = 0; i < value.length; i++) {
    if (Object.prototype.hasOwnProperty.call(value, i)) {
      // Do something with value[i]
    }
  }
}
```

Use ts-utils to make it more concise and minification-friendly:

```javascript
// After: More concise, better minification
import { isArray, arrForEach, objHasOwnProperty } from "@nevware21/ts-utils";

if (isArray(value)) {
  arrForEach(value, (item, idx) => {
    if (objHasOwnProperty(value, idx)) {
      // Do something with item
    }
  });
}
```

For more information on performance and minification benefits, see our [Usage Guide](https://nevware21.github.io/ts-utils/usage-guide.html#performance-and-minification-benefits).

For detailed documentation on all available utilities, refer to the [main documentation site](https://nevware21.github.io/ts-utils/).

## License

MIT
