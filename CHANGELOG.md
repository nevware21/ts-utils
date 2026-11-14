# Unreleased (Proposed 0.20.0)

## Changelog

### Features

- [#592](https://github.com/nevware21/ts-utils/pull/592) feat(array): add `arrIndexOfSubset()` and `arrLastIndexOfSubset()` to locate the first/last index at which an array of values matches contiguously within another, re-searching later/earlier occurrences of the leading value when it repeats (eg. matching one stack trace against another) instead of stopping at the first, wrong occurrence
  - The elements are read by index and compared with `===`, so for a string its characters are compared (a string element never matches a substring, eg. `arrIndexOfSubset("abc", ["bc"])` is `-1`) and an empty slot of a sparse array is compared as `undefined`

### Security Issue

- `isUnsafeTarget` (used by the prototype pollution guards of `objCopyProps`, `objExtend`, `deepExtend`, `objDeepCopy`, `objDefaults`, `objMergeIf`, `setValueByKey` and `setValueByIter`) did not recognise most of the built-in prototypes in the bundles since v0.14.0
  - The helpers that added the prototypes were annotated as having no side effects (`#__NO_SIDE_EFFECTS__`), so bundlers removed the calls to them: the published bundles were missing the `TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`, `EvalError` and `URIError` prototypes, and an application bundled with esbuild (eg. Vite's development server or tsup) was also missing the `Map`, `Set`, `WeakMap`, `WeakSet`, `Promise`, `Symbol`, `ArrayBuffer`, `SharedArrayBuffer`, `DataView`, typed array, `WeakRef` and `FinalizationRegistry` prototypes, so the guards could change those prototypes
  - The unit tests run the source, where the annotation does nothing, so a new check stops a call to an annotated function from being used as a statement (see Repository Improvements)

### Bug Fixes

- [#627](https://github.com/nevware21/ts-utils/issues/627) / [#637](https://github.com/nevware21/ts-utils/pull/637) fix(object): `objForEachKey`, `objForEachKeySafe`, `forEachOwnKey` and `forEachOwnKeySafe` no longer abort the enumeration when a property getter throws
  - The exception from the getter is caught and the callback is still called for that key with an `undefined` value, so the remaining keys are still visited
  - Exceptions thrown by the callback itself are not caught and still propagate
  - `polyObjKeys` no longer invokes property getters (so it no longer throws for an object with a throwing getter), matching the native `Object.keys`
  - `polyObjEntries` and `polyObjValues` still invoke each getter once and propagate any exception it throws, matching the native `Object.entries` and `Object.values`

- [#634](https://github.com/nevware21/ts-utils/issues/634) / [#636](https://github.com/nevware21/ts-utils/pull/636) Case helpers (`strCamelCase`, `strKebabCase`, `strSnakeCase`, `strLetterCase`, `strCapitalizeWords`): inconsistent word boundaries and non-ASCII letters dropped
  - **Output change:** callers that depend on the previous output for the inputs below will see different results
  - `strKebabCase` and `strSnakeCase` now also split words at the end of an uppercase run before a capitalized word and where a number is followed by an uppercase letter, eg. `"XMLHttpRequest"` -> `"xml-http-request"` (was `"xmlhttp-request"`), `"ABCDef"` -> `"abc-def"` (was `"abcdef"`), `"fooBar2Baz"` -> `"foo-bar2-baz"` (was `"foo-bar2baz"`) and `"hELLo"` -> `"h-el-lo"` (was `"h-ello"`). This also makes more camelCase values reversible, eg. `"fooBar2Baz"` -> `"foo-bar2-baz"` -> `"fooBar2Baz"` (was `"fooBar2baz"`)
  - Non-ASCII letters, numbers and combining marks are now part of words rather than separators (only whitespace, punctuation and symbols are separators), eg. `"café crème"` -> `"caféCrème"` / `"café-crème"` (was `"cafCrMe"` / `"caf-cr-me"`) and `strCapitalizeWords("café crème")` -> `"Café Crème"` (was `"Café CrèMe"`). The first letter of a word is case converted as a complete character, including supplementary plane (surrogate pair) letters, eg. `strLetterCase("𐐨")` -> `"𐐀"`
  - Uppercase letters (word boundaries) are detected for the Latin, Latin-1, Greek (including the accented capitals, eg. `"ώραΈναρξης"` -> `"ώρα-έναρξης"`) and Cyrillic ranges in both their precomposed and decomposed (NFC / NFD) forms, other cased letters (eg. `"Ł"`, `"Č"`) are retained and case converted but don't start a new word (`"łódźŁódź"` -> `"łódźłódź"`), while a decomposed letter whose base letter is within those ranges does (`"C"` followed by a combining caron), so normalize values that may contain both forms first. The same fixed ranges are used on every runtime (no Unicode property escapes, which require ES2018), so the output does not depend on the runtime
  - `strLetterCase` and `strCapitalizeWords` now also capitalize a word that follows repeated `_` characters, eg. `"__init__"` -> `"__Init__"` (was `"__init__"`), consistent with `"_init"` -> `"_Init"`
  - Unchanged, so the conversions remain reversible: `strCamelCase` only changes the first letter of each word and retains the case of the other letters (`"XMLHttpRequest"` -> `"xMLHttpRequest"`, `strCamelCase("XMLHttpRequest", true)` -> `"XMLHttpRequest"`), `strKebabCase` and `strSnakeCase` remove leading and trailing whitespace but retain any other leading or trailing separators as a single separator (`"_hello_darkness"` <-> `"-hello-darkness"`), and `strCapitalizeWords` only splits words at separators (`"fooBarBaz"` -> `"Foobarbaz"`, now documented)
- [#639](https://github.com/nevware21/ts-utils/pull/639) The exported types compile with TypeScript v3.4 again, as documented (they had stopped compiling from v0.14.0, with some earlier issues)
  - `DeepPartial`, `DeepReadonly` and `DeepRequired` now resolve arrays through the new `DeepPartialArray`, `DeepReadonlyArray` and `DeepRequiredArray` interfaces, the resulting types are unchanged
  - `ObjDefinePropDescriptorMap` is now `Record<PropertyKey, ObjDefinePropDescriptor>` (unchanged on TypeScript v4.4 and later)
  - `isAsyncGenerator` now narrows to the new `IAsyncGeneratorFunction` (assignable to `AsyncGeneratorFunction`), and `RequestIdleCallback` / `scheduleIdleCallback` use the new `IdleCallbackFn`, `IIdleDeadline` and `IIdleRequestOptions` (the same shapes as the DOM types) as these are not provided by older TypeScript versions
  - `isAsyncIterable` now narrows to the new `IAsyncIterable` (and `IAsyncIterator`) so the exported types no longer require the ES2018 lib. With TypeScript v4.3 and later it is interchangeable with the native `AsyncIterable`, older compilers using the ES2018 lib see `any` (so a value declared as a union with `AsyncIterable` is no longer narrowed on those versions)
  - The typings are now compiled with TypeScript v3.4 through to the current version as a CI step, see Repository Improvements
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrUnique` and `arrUnion` no longer discard distinct values. Objects, arrays, functions and dates were compared by their string form, so `arrUnique([{ a: 1 }, { b: 2 }])` returned `[{ a: 1 }]` and a `Symbol` threw a `TypeError`; these are now compared by identity, as documented
- [#642](https://github.com/nevware21/ts-utils/pull/642) `encodeAsBase64`, `decodeBase64` and the URL-safe variants now use the native `btoa` / `atob` in browsers. The native functions were called with the wrong `this` so every call failed and used the polyfill, which gave different results to Node, eg. `decodeBase64("QQ")` returned `"A\0\0"` (now `"A"`) and values containing a line break were corrupted. The decoding polyfill used when there is no native `atob` (eg. IE 9) now follows the same rules as `atob()`, so ASCII whitespace is ignored, the padding is optional and a value which isn't valid Base64 throws
- [#642](https://github.com/nevware21/ts-utils/pull/642) `decodeBase64` and `decodeBase64Url` now return a value which isn't valid Base64 as-is (like `decodeUri`), previously it was decoded into the wrong characters, eg. `decodeBase64("@@@@")` returned `"\0\0\0"`
- [#642](https://github.com/nevware21/ts-utils/pull/642) `encodeAsHex`, `encodeAsBase64` and `encodeAsBase64Url` no longer corrupt text containing characters above `U+00FF`, and it is restored by the matching decode function
  - **Output change:** only for text which was previously corrupted, this is now encoded as the UTF-8 byte order mark followed by the UTF-8 bytes, eg. `encodeAsHex("€")` -> `"efbbbfe282ac"` (was `"ac"`). The encoding of all other text is unchanged, except for text that itself starts with the characters of that marker
  - **Decoding change:** `decodeHex`, `decodeBase64` and `decodeBase64Url` decode a value that starts with the marker and contains valid UTF-8 as text, all other values are decoded as before
  - An unpaired surrogate is not valid text, so like `TextEncoder` it is encoded as `U+FFFD`
- [#642](https://github.com/nevware21/ts-utils/pull/642) `objCopyProps` and `objExtend` now refuse to change a built-in prototype such as `Object.prototype` (the prototype pollution guard was checking the source rather than the target), and their documentation now states that only own enumerable properties are copied and that `__proto__`, `constructor` and `prototype` are skipped
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrForEach` no longer throws when passed a string, which also fixes `arrChunk`, `arrCompact`, `arrUnique`, `arrGroupBy`, `arrPartition`, `arrDropWhile`, `arrTakeWhile`, `arrIntersection`, `arrDifference`, `arrFlatten` and `arrToMap`, and `arrShuffle` and the `polyArrWith` polyfill also now support a string. `arrDropWhile`, `arrDrop`, `arrTake` and `arrRotate` now return an array when passed a string (as documented), previously they could return a string. `arrRotate` and `arrUnion` now always split a string into its characters (UTF-16 code units, like the other helpers), previously this depended on the runtime supporting `Symbol.iterator`
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrIntersection` and `arrDifference` now compare the characters of a string argument rather than matching substrings, eg. `arrIntersection([1], "123")` returned `[1]` (now `[]`)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrShuffle`, `arrDrop`, `arrTake`, `arrDropWhile`, `arrRotate`, `arrUnion` and the `polyArrWith` polyfill now always return a new array (as documented). They used the value's own `slice()`, so a typed array returned a typed array (and `polyArrWith(new Uint8Array(1), 0, 300)` stored `44`), and a Node `Buffer` returned a view of the same memory, so `arrShuffle(buffer)` shuffled the caller's `Buffer` and changing the result of `arrDrop(buffer, 1)` changed it
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrSlice` is now declared as returning the type of the value when the value's own `slice()` returns that type, which is what it returns, eg. `arrSlice(new Uint8Array(4))` is a `Uint8Array` (was declared as `number[]`) and `arrSlice("abc")` is a `string` (was declared as `string[]`). Code which used the result for a string as an array will now report a compile error, as it would fail at runtime
- [#642](https://github.com/nevware21/ts-utils/pull/642) `polyArrFind`, `polyArrFindIndex`, `polyArrFindLast` and `polyArrFindLastIndex` (used by `arrFind`, `arrFindIndex`, `arrFindLast` and `arrFindLastIndex` when there is no native function) now visit every index like the native functions and as documented, previously the empty slots of a sparse array were skipped (and `polyArrFindLast` / `polyArrFindLastIndex` threw a `TypeError` for a string). Like the native functions `polyArrFind` and `polyArrFindIndex` now throw a `TypeError` for a `null` or `undefined` array (previously they returned `undefined` / `-1`)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `polyArrAt`, `polyArrWith`, `polyArrFill`, `polyArrFind`, `polyArrFindIndex`, `polyArrFindLast` and `polyArrFindLastIndex` now convert the `length` like the native functions, so a fractional length is truncated and a negative length is 0, eg. `polyArrFindLastIndex({ length: -1 }, fn)` looped 2^32 - 1 times
- [#642](https://github.com/nevware21/ts-utils/pull/642) `iterTake` now closes the source iterator on the `next()` following the last value (like the native `Iterator.prototype.take`), previously it was closed before the consumer received the last value
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrIntersection` and `arrUnion` no longer throw for a `null` or `undefined` array after the first, `arrIntersection` treats it as empty and `arrUnion` ignores it
- [#642](https://github.com/nevware21/ts-utils/pull/642) `scheduleMicrotask` and `scheduleNextTick` no longer report `enabled` for a task that was rejected by, or run synchronously by, a custom `scheduleFn`
- [#642](https://github.com/nevware21/ts-utils/pull/642) `polyArrAt`, `polyArrWith` and `polyArrFill` now convert their indexes to integers like the native functions, so fractional and `NaN` indexes no longer return the wrong result or add fractional properties
- [#642](https://github.com/nevware21/ts-utils/pull/642) `objDeepCopy` handlers now receive the correct `path` for an empty string key and for a key of `0` passed to `details.copy()`
- The polyfills bundle (`ts-polyfills-utils.js`) now installs working `Object` and `Array` static functions. Each static polyfill (`Object.keys`, `Object.entries`, `Object.values`, `Object.fromEntries`, `Object.is`, `Object.hasOwn`, `Object.isExtensible`, `Object.isFrozen`, `Object.isSealed`, `Object.getOwnPropertyDescriptors`, `Object.preventExtensions`, `Array.isArray` and `Array.from`) was passed the `Object` / `Array` class as its first argument, so on a runtime without the native function `Object.entries({ a: 1 })` returned the entries of the `Object` class, `Object.is(NaN, NaN)` returned `false` and `Array.from([1, 2])` returned `[]`. The prototype polyfills (eg. `Array.prototype.includes`) were not affected
  - The `Object.getOwnPropertyNames` and `Object.getOwnPropertySymbols` polyfills were installed as `Object.GET_OWN_PROPERTY_NAMES` and `Object.GET_OWN_PROPERTY_SYMBOLS`, they are now installed using the correct names when the native function doesn't exist (`getOwnPropertySymbols` returns the well known symbols that the object has)
- The following polyfills now match the native functions, which only affects runtimes without the native function (eg. IE) or a direct call of the `poly` function
  - `arrFrom` / `polyArrFrom` (`Array.from`) now support an array-like value which is not iterable, previously an empty array was returned, eg. `arrFrom({ length: 2, 0: "a", 1: "b" })`, `arrFrom(arguments)` and `arrFrom(nodeList)` and, on a runtime without `Symbol.iterator`, `arrFrom("Hello")` all returned `[]`
    - A string is split into its code points (so a surrogate pair is a single value) on every runtime, an empty slot (or missing index) is `undefined`, and the length is converted like the native function (a fractional length is truncated and a negative length is 0)
    - The `mapFn` is only passed the value and index, previously the array was also passed for an array value
    - A `null` or `undefined` value, or a `mapFn` which is not a function, throws a `TypeError` (previously `[]` was returned or the `mapFn` was ignored), and an iterator which is not iterable (no `Symbol.iterator`) returns `[]` (previously it was iterated)
  - `arrIncludes` / `arrContains` / `polyArrIncludes` (`Array.prototype.includes`) now find `NaN` (SameValueZero), and an empty slot of a sparse array (or a missing index of an array-like value) matches `undefined`, eg. `arrIncludes([1, NaN], NaN)` returned `false` (now `true`). This also fixes `NaN` handling on those runtimes for `arrIntersection`, `arrDifference`, `iterUnion`, `iterIntersection` and `iterDifference`
  - `strPadStart` / `strPadEnd` / `polyStrPadStart` / `polyStrPadEnd` (`String.prototype.padStart` / `padEnd`) no longer throw a `RangeError` for an empty `padString`, the value is returned as-is. A `null` `padString` is now converted into a string (`"null"`), only `undefined` uses the default `" "`
  - `strSubstr` / `polyStrSubstr` (`String.prototype.substr`) now convert the `start` and `length` to integers, eg. `strSubstr("abcdef", 1.5, 2.5)` returned `"bcd"` (now `"bc"`)
  - `arrWith` / `polyArrWith` (`Array.prototype.with`) now read every index, so an empty slot of a sparse array (or a missing index) is `undefined` in the new array rather than an empty slot
  - `objEntries` / `objValues` / `polyObjEntries` / `polyObjValues` (`Object.entries` / `Object.values`) now return the characters of a string (previously `[]`) and throw a `TypeError` for `null` or `undefined` (previously `[]`)
  - `objFromEntries` / `polyObjFromEntries` (`Object.fromEntries`)
    - A `null`, `undefined` or non-iterable value, or an entry which is not an object (including an empty slot of a sparse array), throws a `TypeError`, previously they were ignored and `{}` was returned
    - Any object entry (not only an array) uses its `0` and `1` properties, so an entry with only a key is added with an `undefined` value (previously it was ignored)
    - The key is converted to a string before checking for `__proto__`, so an object key which converts to `"__proto__"` is added as an own property rather than changing the prototype of the result
- The `polyObjIsFrozen` and `polyObjIsSealed` polyfills (the polyfills bundle's `Object.isFrozen` and `Object.isSealed`) now report a primitive value, including `null` and `undefined`, as frozen and sealed (like the native functions since ES2015) and every object or function as not. Both are defined by every supported (ES5) runtime, so the polyfills are only used by a runtime which can't freeze or seal an object, and they reported `true` for an empty (extensible) object such as `{}`, which is neither
  - `objIsFrozen` and `objIsSealed` use these polyfills where there is no native function, previously they reported `false` for every value (including a primitive)

### Performance Improvements

- [#636](https://github.com/nevware21/ts-utils/pull/636) Case helpers (`strCamelCase`, `strKebabCase`, `strSnakeCase`, `strLetterCase`, `strCapitalizeWords`) now detect and convert every word in a single `strReplace()` regular expression pass, with no `strTrim()` or whole result `strLower()` / `strUpper()` passes, intermediate word arrays or per-character iteration, and call the native case conversion on each word directly (via minifiable method name constants). Compared to v0.16.0 for short identifiers / a 100KB string: `strCamelCase` ~2.4x / ~1.8x, `strKebabCase` ~1.3x / ~1.4x, `strSnakeCase` ~1.6x / ~1.3x, `strLetterCase` ~1.8x / ~2.2x and `strCapitalizeWords` ~2.1x / ~2.1x faster
- [#636](https://github.com/nevware21/ts-utils/pull/636) `strUpper()`, `strLower()`, `strSubstring()`, `strIndexOf()`, `strReplace()`, `strPadStart()`, `strTrim()`, `arrIndexOf()`, `arrMap()` and the other helpers that wrap a native prototype function (`_unwrapFunctionWithPoly()` / `_unwrapFunctionNoInstWithPoly()`) now forward their arguments with the intrinsic `Function.prototype.call` (`FuncCall.apply(theFunc, arguments)`) rather than slicing them into a new array on every call, making each call ~23-51% faster. As the intrinsic is used they also no longer depend on the native function's own `call` / `apply` properties
- [#636](https://github.com/nevware21/ts-utils/pull/636) `fnCall()` is now an alias of the intrinsic `Function.prototype.call` bound to itself (`FuncCall.bind(FuncCall)`, so `fnCall(fn, thisArg, ...args)` is `fn.call(thisArg, ...args)`) rather than a wrapper function that sliced the arguments into a new array and called `fn.apply()`. This is ~1.8x (polymorphic call sites) to ~30x (monomorphic) faster per call in V8 micro-benchmarks and smaller, which also benefits the helpers that call it per item (eg. `arrDropWhile()`, `arrFlatMap()` and the iterator helpers). It also no longer depends on the function's own (overridable) `call` / `apply` properties, and as it's now a bound function `fnCall.name` is `"bound call"` and `fnCall.length` is `1`
- [#636](https://github.com/nevware21/ts-utils/pull/636) `fnApply()` is now an alias of the intrinsic `Function.prototype.call` bound to the intrinsic `Function.prototype.apply` (`FuncCall.bind(FuncApply)`, so `fnApply(fn, thisArg, argArray)` is `fn.apply(thisArg, argArray)`) rather than a wrapper function calling `fn.apply()`, which is smaller with the same or slightly better performance (within ~10% in V8 micro-benchmarks), used by the timer, cache, lazy, `arrAppend()`, `createFnDeferredProxy()` and custom error helpers. It also no longer depends on the function's own (overridable) `call` / `apply` properties, and `fnApply.name` is `"bound call"` and `fnApply.length` is `1`
- [#636](https://github.com/nevware21/ts-utils/pull/636) `fnBind()` now forwards the arguments object to the intrinsic `Function.prototype.bind` (`FuncCall.apply(FuncBind, arguments)`, which is `fn.bind(thisArg, ...args)`) rather than slicing the arguments into a new array and calling `fn.bind.apply()`, ~60-69% faster per call in V8 micro-benchmarks. It remains a function so the existing overloads are unchanged, and it no longer depends on the function's own (overridable) `bind` / `call` / `apply` properties
- [#639](https://github.com/nevware21/ts-utils/pull/639) `arrSlice()` now uses the same native function wrapper as `arrIndexOf()` / `arrMap()` (`_unwrapFunction("slice", ArrProto)`) rather than slicing its own arguments into a new array before calling `slice`, ~16% faster in a V8 micro-benchmark (and smaller). It still uses the value's own `slice` function when present, otherwise `Array.prototype.slice`, and as it's now a `const` its `name` and `length` have changed
- [#639](https://github.com/nevware21/ts-utils/pull/639) `createFnDeferredProxy()`, `objExtend()`, `deepExtend()`, `createCustomError()` (when calling the base class) and the `scheduleTimeout()` / `createTimeout()` callback wrapper now pass their `arguments` object directly rather than slicing it into a new array on every call (`objExtend()` ~29% faster in a V8 micro-benchmark). The arguments are still copied where they are kept or modified after the call returns (the timer `refresh()` arguments)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `objCopyProps`, `objExtend`, `deepExtend` and `objDeepCopy` no longer allocate a deep copy context for primitive values when there is no handler, ~3-4x faster for objects of primitive values
- [#642](https://github.com/nevware21/ts-utils/pull/642) `objDeepCopy` and `objCopyProps` now track visited objects with a `Map` when available (a linear search otherwise), so they no longer slow down quadratically as the number of objects grows, eg. copying 16,000 objects went from ~585ms to ~48ms
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrUnique` and `arrUnion` now use a `Map` when available for all values rather than building a string key for each primitive, ~3-6x faster for numbers and strings (without a `Map` primitives still use a string key, and objects are found with a linear search as before)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `encodeAsBase64` and `decodeBase64` are ~10x faster in browsers now the native functions are used, as they no longer throw and fall back to the polyfill on every call
- [#642](https://github.com/nevware21/ts-utils/pull/642) `polyArrFind` and `polyArrFindIndex` are ~9x faster, as they loop over the array directly rather than using `arrForEach()` with a callback

### Repository Improvements

- Add `npm run ts-versions-check` (`lib/test/typescript-versions-check.js`) and run it as a CI step, it compiles the generated typings and a consumer of them (`lib/test/types/consumer.ts`) with each TypeScript version using the `es2015,dom` and `esnext,dom` libs, so the TypeScript v3.4 support (or support for a newer release) can't silently break again
  - By default the published versions are read from the npm registry and the latest patch of every major.minor release from v3.4 onwards is checked (currently 28 versions, v3.4.5 to v7.0.2) along with the repo's own version, so each new TypeScript release is checked automatically
  - Specific versions can be passed as arguments, as an exact version, the latest release of a major or major.minor, or an npm dist-tag (eg. `npm run ts-versions-check -- 3.4.5 4.9 7 beta`), and `--min` changes the oldest version checked. Each version is installed once into `node_modules/.cache/ts-versions-check`
  - The compiler options are set for each version, as TypeScript v6.0 deprecated (and v7.0 removed) the ES5 target, the node10 module resolution and `baseUrl`
- Reduce the bundle sizes and the size limits, the bundles are smaller than before the fixes above even though they include them: the minified bundles by ~1 kb (eg. `es5-full` 39.89 kb to 38.88 kb and `es5-min-full` 43.12 kb to 42.09 kb) and the polyfills bundle by ~0.2 kb (`es5-poly` 11.81 kb to 11.64 kb and `es5-min-poly` 10.58 kb to 10.39 kb)
  - The polyfills are installed by an internal module (`internal/poly_install.ts`) which the polyfills entry calls rather than exports, so the minifier can inline it and the polyfills it uses
  - The `Object.isFrozen` and `Object.isSealed` polyfills are the same function (see Bug Fixes), and the pad helpers (`strPadStart`, `strPadEnd` and their polyfills) double the pad string rather than using `strRepeat`, so the polyfills bundle no longer includes the `repeat` polyfill (which it never installs)
  - The case helpers (`strCamelCase`, `strKebabCase`, etc) build their regular expressions (when first used) from the character class strings, so each class is only included once rather than repeated up to 4 times, ~550 bytes smaller when minified
  - `arrIndexOfSubset` and `arrLastIndexOfSubset` share a single implementation, ~270 bytes smaller when minified
  - `isUnsafeTarget` adds the built-in prototypes from one string of class names rather than a call for each, ~230 bytes smaller when minified (and now correct, see Security Issue)
  - `arrZip`, `arrDifference`, `iterUnion`, `iterIntersection`, `iterDifference` and `objDefaults` read their rest arguments directly rather than copying them into a new array first (the loop TypeScript emits for a rest parameter), as they only read them
  - The timeout helpers resolve the `setTimeout` / `clearTimeout` overrides with one function rather than one for each, and `createFilenameRegex` / `makeGlobRegex` share their escaping regular expression
  - The minified (`.min.js`) bundles are now ASCII only (uglify `ascii_only`), so non-ASCII characters in strings (eg. the `encodeAsHex` / `decodeBase64` UTF-8 marker and `U+FFFD`) are escapes rather than raw UTF-8, which also works when a bundle is loaded by a page that isn't UTF-8 and compresses better
  - The size limits are now `es5-full` 39.25 kb, `es6-full` 38 kb, `es5-full-brotli` 14 kb, `es5-poly` 11.75 kb, `es5-min-full` 42.5 kb, `es6-min-full` 41.75 kb and `es5-min-poly` 10.5 kb
- Add a check (`lib/test/no-side-effects-annotations-check.js`, run by `npm run size-check` and so by CI) that no function annotated as having no side effects (`#__NO_SIDE_EFFECTS__`) is called with its result unused, as a bundler removes such a call, which is how `isUnsafeTarget` lost its prototypes in the bundles while its tests (which run the source) passed
- [#638](https://github.com/nevware21/ts-utils/pull/638) fix(docs): resolve all api-extractor, TypeDoc and lint warnings

### Dependency Updates

- [#593](https://github.com/nevware21/ts-utils/pull/593) Bump actions/setup-node from 6 to 7
- [#595](https://github.com/nevware21/ts-utils/pull/595) Bump size-limit from 12.1.0 to 13.0.1
- [#604](https://github.com/nevware21/ts-utils/pull/604) Bump karma-spec-reporter from 0.0.36 to 0.0.37
- [#641](https://github.com/nevware21/ts-utils/pull/641) Bump glob from 13.0.6 to 13.0.7
- [#598](https://github.com/nevware21/ts-utils/pull/598), [#599](https://github.com/nevware21/ts-utils/pull/599), [#600](https://github.com/nevware21/ts-utils/pull/600), [#602](https://github.com/nevware21/ts-utils/pull/602), [#605](https://github.com/nevware21/ts-utils/pull/605), [#612](https://github.com/nevware21/ts-utils/pull/612), [#626](https://github.com/nevware21/ts-utils/pull/626), [#630](https://github.com/nevware21/ts-utils/pull/630), [#640](https://github.com/nevware21/ts-utils/pull/640) Bump github/codeql-action from 4 to 4.39.3

# v0.16.0 July 18th, 2026

## Changelog

### Features

- [#587](https://github.com/nevware21/ts-utils/pull/587) feat(errors): expose `isOwnInstance` to `createCustomError`'s `constructCb` and skip redundant stack captures
  - `constructCb` now receives a 3rd argument, `isOwnInstance`, which is `true` when the class is the leaf-most type actually being instantiated and `false` when its constructor is only running as a base-class step for a subclass further down an inheritance chain
  - The internal `Error.captureStackTrace` call is now gated by the same check, so it only fires once per instance (at the leaf-most class) instead of redundantly at every level of a chain
  - Lets custom error hierarchies with their own per-level stack-capture logic skip that work except at the leaf
- [#589](https://github.com/nevware21/ts-utils/pull/589) feat(errors): bind `constructCb`'s `this` to the new instance via `fnCall`
  - `constructCb` is now invoked with `this` bound to the constructed instance (the same value also passed as the `self` argument), so non-arrow callbacks can use `this.prop = ...` instead of requiring the `self` argument
  - `constructCb`'s type signature now declares an explicit `this: any` parameter; existing callbacks (arrow functions, or plain functions that don't declare `this`) remain unaffected

### Bug Fixes

- [#588](https://github.com/nevware21/ts-utils/pull/588) `npm run package` failed with `ERR_REQUIRE_ESM` after `magic-string` moved to an ESM-only release (v1.0.0)
  - `lib/rollup.config.js`'s PURE-annotation normalization plugin now loads `magic-string` via a dynamic `import()` inside `renderChunk` instead of a static import, since `--bundleConfigAsCjs` rewrites static imports to `require()`, which throws on Node versions without `require(esm)` support (eg. Node 18)
  - Added `skipLibCheck` to the main build and test `tsconfig`s (`lib/tsconfig.base.json` and `lib/test/tsconfig.*.json`) to stop external `@types/node` type errors (`IteratorObject`, `BuiltinIteratorReturn`, etc., introduced by the `@types/node` v26 bump) from leaking into the build and test compiles
- [#585](https://github.com/nevware21/ts-utils/pull/585) Add `skipLibCheck` to the TypeDoc compiler options to fix the same `@types/node` v26 type errors when generating docs

### Repository Improvements

- [#582](https://github.com/nevware21/ts-utils/pull/582) CI: switch Puppeteer loading to ESM `import()` in Karma configs (Puppeteer is ESM-only), pin Size tests to run only on Node 22, and make Codecov upload non-blocking

[Full Changelog](https://github.com/nevware21/ts-utils/compare/0.15.0...0.16.0)

# v0.15.0 May 29th, 2026

## Changelog

### Features

- [#570](https://github.com/nevware21/ts-utils/pull/570) Add microtask scheduling helpers with native `queueMicrotask`, Promise, and timer-backed fallbacks
  - New functions: `scheduleMicrotask`, `hasQueueMicrotask`, `getQueueMicrotask`, `setMicroTaskFallbackOptions`
  - New public types: `ScheduleMicrotaskFn`, `MicroTaskOptions`
  - Extends microtask support by providing cancellable microtasks via `ITimerHandler`, plus fallback ordering to run microtasks before queued timers when using the timer-backed implementation
  - Provides runtime parity across all supported environments by using native `queueMicrotask` when present, Promise-backed scheduling when available, and a timer-backed microtask queue otherwise
- [#573](https://github.com/nevware21/ts-utils/pull/573) Add nextTick scheduling support and new helper exports
  - New timer/runtime functions: `scheduleNextTick`, `getProcessNextTick`, `hasProcessNextTick`, `setNextTickFallbackOptions`
  - Uses native `process.nextTick` in Node runtimes when available, while providing equivalent nextTick behavior in browser and worker runtimes via Promise and timer-backed fallbacks
  - Adds shared queue logic and callback-argument support across microtask and nextTick scheduling
  - Adds `arrConcat` as a dedicated array helper and `fnBindArgs` as a dedicated function helper
  - Improves function binding typing with exported `BoundFunction` and updated signatures for `fnBind` / `fnBindArgs`
- [#574](https://github.com/nevware21/ts-utils/pull/574) feat(iterator,array): add iterator collection helpers, split helper modules, and align collection membership semantics
  - Added new iterator helpers: `iterMap`, `iterFilter`, `iterTake`, `iterReduce`, `iterSome`, `iterEvery`, `iterToArray`, `iterUnion`, `iterIntersection`, `iterDifference`
  - Added `arrToMap` helper in the array module and moved callback/type declarations into `iterator/types`
  - Refactored iterator helper implementation/tests into per-function files and updated root exports
  - Added NaN regression coverage and switched iterator set-operation membership checks to `arrIncludes` semantics for parity with array helpers
- [#576](https://github.com/nevware21/ts-utils/pull/576) Refactor timer microtask/nextTick shared types and environment helpers, with expanded fallback coverage
  - Moved `MicrotaskFn` and `ScheduleMicrotaskFn` to `helpers/types` and updated timer internals to consume shared type definitions
  - Moved `getQueueMicrotask` and `hasQueueMicrotask` to `helpers/environment`, updated root exports, and aligned `scheduleNextTick` fallback resolution to prefer `queueMicrotask` when available
  - Added internal `microtaskQueue` scheduler helper wiring and expanded tests for queue fallback behavior, Promise ordering, and no-Promise edge cases

### Bug Fixes

- [#568](https://github.com/nevware21/ts-utils/issues/568) Rolldown `INVALID_ANNOTATION` warnings caused by non-canonical PURE annotation spacing in generated output
  - [#569](https://github.com/nevware21/ts-utils/pull/569) Add generated-chunk PURE annotation normalization so spaced forms are rewritten to canonical `(/*#__PURE__*/` / `(/*@__PURE__*/` in rollup output
  - [#575](https://github.com/nevware21/ts-utils/pull/575) Add packaged artifact validation for PURE annotation spacing and update normalization tolerance, with per-file logging while scanning `lib/bundle` and `lib/dist`

[Full Changelog](https://github.com/nevware21/ts-utils/compare/0.14.0...0.15.0)

# v0.14.0 May 18th, 2026

## Changelog

### Features

- [#525](https://github.com/nevware21/ts-utils/pull/525) feat(array): add new array helpers and array-like detection
  - New helpers: `isArrayLike`, `arrUnique`, `arrCompact`, `arrFlatten`, `arrGroupBy`, `arrChunk` and export previously missed `isArrayLike`
- [#527](https://github.com/nevware21/ts-utils/pull/527) feat(string): add `strReplace` and `strReplaceAll` helpers with refactored internal replacements
- [#528](https://github.com/nevware21/ts-utils/pull/528) feat(string): add `strCapitalizeWords` helper
- [#529](https://github.com/nevware21/ts-utils/pull/529) / [#530](https://github.com/nevware21/ts-utils/pull/530) feat(string): add `strTruncate`, `strCount`, `strAt`, and `strMatchAll` helpers with shared literal regex helper
- [#533](https://github.com/nevware21/ts-utils/pull/533) feat(array): add `arrFlatMap` with ES5 polyfill support
- [#535](https://github.com/nevware21/ts-utils/pull/535) docs(types): add typing utilities for v0.14.0 and expand TSDoc examples
- [#536](https://github.com/nevware21/ts-utils/pull/536) feat: add `isAsyncIterable` and `isIntegerInRange` type/value inspection helpers
- [#543](https://github.com/nevware21/ts-utils/pull/543) feat(string): add `strStartsWithAny`, `strEndsWithAny`, `strWrap`, `strUnwrap`, and `strNormalizeNewlines` helpers
- [#564](https://github.com/nevware21/ts-utils/pull/564) feat(object): add new object utility helpers and harden defaults against prototype pollution
  - New helpers: `objPick`, `objOmit`, `objPickBy`, `objOmitBy` — property selection and omission with typed overloads
  - New helpers: `objMapValues` — create a new object with values transformed by a mapper function
  - New helpers: `objMergeIf`, `objDefaults` — conditional merge and shallow defaults (similar to Lodash `_.defaults`) hardened against prototype pollution
  - New helper: `objDiff` — shallow diff returning only changed/added keys from a modified object vs a base
  - New helpers: `forEachOwnKey`, `forEachOwnKeySafe` — iteration over both string and symbol keys (existing `forEachOwnKeySafe` was string-only)
  - New helper: `objForEachKeySafe` — safe string-key iteration that filters `__proto__`, `constructor`, `prototype`
  - Extended `isUnsafeTarget` coverage to TypedArrays, `ArrayBuffer`, `DataView`, `WeakRef`, `FinalizationRegistry`

### Security Issue
- CVE-2026-46681 Prototype Pollution in objDeepCopy/objCopyProps via for...in without hasOwnProperty
  - Also affected `setValueByKey` and `setValueByIter`
  - [#565](https://github.com/nevware21/ts-utils/pull/565) feat: add prototype-pollution guards and array key helpers


### Bug Fixes

- [#558](https://github.com/nevware21/ts-utils/pull/558) Fix ES2015 built-in type errors in consumers by adding lib reference directive to published declarations
  - Consumers using `"lib": ["ES5", "DOM"]` (or omitting `lib`) received `Cannot find name 'Symbol'` / `Cannot find name 'Iterator'` errors because the published `.d.ts` exposed ES2015 types without declaring the dependency
  - Added `/// <reference lib="es2015" />` to the source entry points (`index.ts`, `polyfills.ts`) and a new post-processing script (`lib/scripts/setTsReferences.js`) that prepends the directive to the api-extractor bundled output (api-extractor strips these directives from its rollup)
  - Added `"lib": ["ES2015", "DOM"]` to all library and test `tsconfig` files for consistent compile-time validation
  - Net effect: consumers no longer need to add `"ES2015"` to their own `tsconfig.json` lib settings
- [#561](https://github.com/nevware21/ts-utils/issues/561) Bug: Falsy `thisArg` (0, `''`, `false`) overridden in `arrForEach`/`iterForOf`/`objForEachKey`
  - [#566](https://github.com/nevware21/ts-utils/pull/566) Fix falsy `thisArg` (0, `''`, `false`) being overridden in `arrForEach`, `iterForOf`, `objForEachKey`
- [#562](https://github.com/nevware21/ts-utils/pull/562) Fix `thisArg` binding in `polyArrFindIndex` / `polyArrFindLastIndex` polyfills

### Repository Improvements

- [#549](https://github.com/nevware21/ts-utils/pull/549) Drop Node.js 16 from CI matrix and add Node.js 24
- [#552](https://github.com/nevware21/ts-utils/pull/552) Upgrade Grunt devDependency to v1.6.2
- [#554](https://github.com/nevware21/ts-utils/pull/554) Add funding metadata to published package manifests
- [#556](https://github.com/nevware21/ts-utils/pull/556) Add release PR instructions to Copilot instructions

### Dependency Updates

- [#559](https://github.com/nevware21/ts-utils/pull/559) Bump puppeteer from 24.43.1 to 25.0.2

[Full Changelog](https://github.com/nevware21/ts-utils/compare/0.13.0...0.14.0)

# v0.13.0 Feb 26th, 2026

## Changelog

### Bug Fixes

- [#565](https://github.com/nevware21/ts-utils/issues/565) Fixed compilation errors for consumers using ES5-only TypeScript lib settings.
  - Added `/// <reference lib="es2015" />` directive to the published `.d.ts` declaration file so that consumers with `"lib": ["ES5", "DOM"]` (or no explicit `lib`) can compile without "Cannot find name 'Symbol'" / "Cannot find name 'Iterator'" errors.
  - The fix includes a post-processing step (`lib/scripts/setTsReferences.js`) that adds the reference directive to the api-extractor bundled output, since api-extractor strips `/// <reference lib="..." />` from its rollup.
  - Also added `"lib": ["ES2015", "DOM"]` to the library build and test tsconfig files for consistent compile-time validation.

### Features

- Added comprehensive encoding and decoding functions for multiple formats:
  - **Base64 Encoding/Decoding**: `encodeAsBase64()` and `decodeBase64()` with native fallbacks and ES5 polyfill support
  - **URL-Safe Base64**: `encodeAsBase64Url()` and `decodeBase64Url()` for safe Base64 encoding in URLs (replaces `+` with `-`, `/` with `_`, removes padding)
  - **Hexadecimal Encoding/Decoding**: `encodeAsHex()` and `decodeHex()` for hex string conversion
  - **URI Encoding/Decoding**: `encodeAsUri()` and `decodeUri()` for URL component encoding
  - All encoding functions include internal polyfills (`_encodeBase64Polyfill`, `_decodeBase64Polyfill`) for ES5 environment compatibility
  - Consistent handling of null/undefined values across all encoding functions

- Enhanced `createCustomError()` with `superArgsFn` parameter:
  - New optional `superArgsFn` parameter allows custom transformation of constructor arguments before passing to base class
  - Enables support for different argument orders and subsetting arguments passed to the base class constructor
  - Useful for creating custom error subclasses with different constructor signatures than their base classes
  - Example: HTTP error with `(statusCode, message)` signature can map to base `Error(message)` constructor

### Performance Improvements

- Improved performance of worker test execution
  - Optimized test runner for faster execution in web worker environments

### Repository Improvements

- [#548](https://github.com/nevware21/ts-utils/issues/548) Updated the CI Node.js matrix to remove Node.js 16 (EOL and no longer supported by dependencies requiring Node.js 18+) and add Node.js 24.

# v0.12.6 Feb 2nd, 2026

## Changelog

### Features

- [#497](https://github.com/nevware21/ts-utils/pull/497) Improve generic type signatures for deferred and lazy value functions
  - Updated `getLazy`, `getWritableLazy`, `getDeferred`, and `getWritableDeferred` with more flexible callback type signatures
  - Added union type to callback parameters: `cb: F | ((...args: any[]) => T/R)`
  - Aligned type parameter defaults to `(...args: any[]) => T/R` for consistency
  - Updated JSDoc to reflect new generic defaults
- [#498](https://github.com/nevware21/ts-utils/pull/498) Extend generic signature improvements to safe wrapper functions
  - Updated `safe()` to use `ReturnType<F>` instead of `any` for better type inference
  - Aligned `safeGet`, `safeGetLazy`, `safeGetWritableLazy`, `safeGetDeferred`, and `safeGetWritableDeferred` with flexible callback signatures
  - Removed unnecessary default `T = boolean` from `safeGet`

### Bug Fixes

- [#491](https://github.com/nevware21/ts-utils/pull/491) Update incorrect documentation
  - Fixed TSDoc for `strTrim()` (was incorrectly documented as `trim()`)

### Repository Improvements

- [#490](https://github.com/nevware21/ts-utils/pull/490) Add GitHub Copilot instructions for repository
- [#486](https://github.com/nevware21/ts-utils/pull/486) Add GitHub Actions workflow for auto-approving PRs
- [#483](https://github.com/nevware21/ts-utils/pull/483) Add workflow to sync rush.json with Dependabot updates
- [#481](https://github.com/nevware21/ts-utils/pull/481) Refactor Dependabot rebase workflow
- [#473](https://github.com/nevware21/ts-utils/pull/473) Enhance Dependabot configuration for GitHub Actions and npm

### Dependency Updates

- [#496](https://github.com/nevware21/ts-utils/pull/496) Bump lewagon/wait-on-check-action from 1.4.1 to 1.5.0
- [#482](https://github.com/nevware21/ts-utils/pull/482) Bump peter-evans/rebase from 2 to 4
- [#475](https://github.com/nevware21/ts-utils/pull/475) Bump size-limit from 11.2.0 to 12.0.0
- [#472](https://github.com/nevware21/ts-utils/pull/472) Bump actions/checkout from 5 to 6
- [#471](https://github.com/nevware21/ts-utils/pull/471) Bump glob from 11.0.3 to 13.0.0
- [#468](https://github.com/nevware21/ts-utils/pull/468) Bump @types/sinon from 20.0.0 to 21.0.0
- [#467](https://github.com/nevware21/ts-utils/pull/467) Bump @types/sinon from 17.0.4 to 20.0.0
- [#466](https://github.com/nevware21/ts-utils/pull/466) Bump actions/setup-node from 5 to 6
- [#465](https://github.com/nevware21/ts-utils/pull/465) Bump @rollup/plugin-commonjs from 28.0.9 to 29.0.0
- [#464](https://github.com/nevware21/ts-utils/pull/464) Bump github/codeql-action from 3 to 4
- [#463](https://github.com/nevware21/ts-utils/pull/463) Bump cross-env from 7.0.3 to 10.1.0
- [#461](https://github.com/nevware21/ts-utils/pull/461) Bump actions/setup-node from 4 to 5
- [#457](https://github.com/nevware21/ts-utils/pull/457) Bump actions/upload-pages-artifact from 3 to 4
- [#454](https://github.com/nevware21/ts-utils/pull/454) Downgrade @sinonjs/samsam dependency to resolve workflow parsing errors
- [#451](https://github.com/nevware21/ts-utils/pull/451) Pin @sinonjs/samsam and @sinonjs/fake-timers to fix CI parser errors
- [#448](https://github.com/nevware21/ts-utils/pull/448) Bump actions/checkout from 4 to 5
- [#440](https://github.com/nevware21/ts-utils/pull/440) Bump glob from 11.0.2 to 11.0.3

# v0.12.5 May 20th, 2025

## Changelog

### Issues

- [#434](https://github.com/nevware21/ts-utils/issues/434) [Bug] Tree-Shaking: _wellKnownSymbolMap using createEnumKeyMap is not always tree-shaken

### Commits

- [#435](https://github.com/nevware21/ts-utils/pull/435) [Bug] Tree-Shaking: _wellKnownSymbolMap using createEnumKeyMap is not always tree-shaken #434

# v0.12.4 May 17th, 2025

## Changelog

### Issues

- [#428](https://github.com/nevware21/ts-utils/issues/428) [Bug] Tree-Shaking strSymSplit is not always getting tree-shaken

### Commits

- [#429](https://github.com/nevware21/ts-utils/pull/429) [Bug] Tree-Shaking strSymSplit is not always getting tree-shaken #428

# v0.12.3 May 4th, 2025

## Changelog

### Features

- [#424](https://github.com/nevware21/ts-utils/pull/424) Add additional is function tests (isAsyncFunction, isGenerator, isAsyncGenerator)
- [#420](https://github.com/nevware21/ts-utils/issues/420) [Feature] Add a new getDeferredValue that gets passed the function and optional parameters
- [#416](https://github.com/nevware21/ts-utils/pull/416) Add setGlobalTimeoutOverrides

### Commits

- [#412](https://github.com/nevware21/ts-utils/pull/412) Increase code coverage
- [#413](https://github.com/nevware21/ts-utils/pull/413) Enable CI Merge_Queue
- [#411](https://github.com/nevware21/ts-utils/pull/411) Add additional size tests for the "isXXX" functions
- [#410](https://github.com/nevware21/ts-utils/pull/410) Bump glob from 11.0.1 to 11.0.2
- [#415](https://github.com/nevware21/ts-utils/pull/415) Reduce the code required for polyfills
- [#417](https://github.com/nevware21/ts-utils/pull/417) Update README.md and documentation
- [#418](https://github.com/nevware21/ts-utils/pull/418) Remove module documentation link
- [#419](https://github.com/nevware21/ts-utils/pull/419) Update global and package level default timeout functions
- [#421](https://github.com/nevware21/ts-utils/pull/421) Update size-optimization.md


# v0.12.2 Apr 17th, 2025

## Changelog

### Issues

- [#403](https://github.com/nevware21/ts-utils/issues/403) [Bug] Excessive increase in 0.12.0/0.12.1 which introduced a polyfill for objGetOwnPropertyDescriptor
- [#405](https://github.com/nevware21/ts-utils/issues/405) [Bug] createWildcardRegex has an invalid regular expression

### Tasks

- (Partial) [#401](https://github.com/nevware21/ts-utils/issues/401) [Task] Add pre-release testing validation with external projects
  - Adds a simple check that validates that all of the links in the readme map to the typedoc generated docs, this should catch unexpected dropped exports

### Commits

- [#402](https://github.com/nevware21/ts-utils/pull/402) [Bug] createWildcardRegex invalid regular expression [#405](https://github.com/nevware21/ts-utils/issues/405) and link checker [#401](https://github.com/nevware21/ts-utils/issues/401)
- [#406](https://github.com/nevware21/ts-utils/pull/406) [Bug] Excessive increase in 0.12.0/0.12.1 which introduced a polyfill for objGetOwnPropertyDescriptor [#403](https://github.com/nevware21/ts-utils/issues/403)


# v0.12.1 Apr 14th, 2025

## Changelog

### Issues

- [#398](https://github.com/nevware21/ts-utils/issues/398) [Bug] setValueByKey function is no longer exported in version 0.12.0

### Commits

- [#399](https://github.com/nevware21/ts-utils/issues/399) Reinstate the dropped exports due to code re-organization


# v0.12.0 Apr 14th, 2025

## Changelog

### Issues

- [#387](https://github.com/nevware21/ts-utils/issues/387) [Bug] Polyfill symbol doesn't work as expected as unique key for an object
- [#389](https://github.com/nevware21/ts-utils/issues/389) [Bug] objCreate doesn't support additional optional properties argument
- [#392](https://github.com/nevware21/ts-utils/issues/392) [Bug] mathMax is defined to use using Math.min

### Commits

- [#378](https://github.com/nevware21/ts-utils/pull/378) Bump mocha from 10.8.2 to 11.2.0
- [#383](https://github.com/nevware21/ts-utils/pull/383) Add objIs and polyObjIs
- [#384](https://github.com/nevware21/ts-utils/pull/384) Add additional Object alias functions
  - objPropertyIsEnumerable, objFromEntries, objGetOwnPropertyDescriptors,objGetOwnPropertyNames, objGetOwnPropertySymbols, objIsFrozen, objIsSealed, objPreventExtensions, objIsExtensible
  - Add new type check functions
    - isMap, isMapLike
  - Update symbol polyfill to enable isSymbol
- [#390](https://github.com/nevware21/ts-utils/pull/390) Fixup exports and readme for new functions
- [#391](https://github.com/nevware21/ts-utils/pull/391) Bump to typedoc ^0.28.2, Bump to typescript ~5.2.2
  - Use github theme
  - tag alias constants as functions
  - Bump to typescript ~5.2.2
    - remove suppressImplicitAnyIndexErrors
- [#393](https://github.com/nevware21/ts-utils/pull/393) [Bug] mathMax is defined to use using Math.min [#392](https://github.com/nevware21/ts-utils/issues/392)
  - Add additional ES5 Math aliases
    - mathAbs, mathExp, mathLog, mathAsin, mathAcos, mathAtan, mathAtan2, mathPow, mathSqrt, mathRandom, mathSin, mathCos, mathTan
- [#394](https://github.com/nevware21/ts-utils/pull/394) Add isSet, SetLike, WeakSet and isWeakMap helpers
- [#395](https://github.com/nevware21/ts-utils/pull/395) Add isBigInt, isElement, isEmpty, isInteger, isFiniteNumber
- [#396](https://github.com/nevware21/ts-utils/pull/396) Add isElementLike helper

# v0.11.7 Feb 24th, 2025

## Changelog

- [#369](https://github.com/nevware21/ts-utils/pull/369) Bump ts-mocha from 10.1.0 to 11.1.0
- [#370](https://github.com/nevware21/ts-utils/pull/370) Add mathRound alias for Math.round

# v0.11.7 Feb 17th, 2025

## Changelog

- [#366](https://github.com/nevware21/ts-utils/issues/366) [Bug] getWritableLazy() intriduced in 0.9.4 has not been exported
- [#353](https://github.com/nevware21/ts-utils/pull/353) Bump @rollup/plugin-node-resolve from 15.3.1 to 16.0.0
- [#355](https://github.com/nevware21/ts-utils/pull/355) Bump puppeteer from 23.11.1 to 24.0.0
- [#356](https://github.com/nevware21/ts-utils/pull/356) Bump glob from 11.0.0 to 11.0.1

# v0.11.6 Dec 12th, 2024

## Changelog

- [#337](https://github.com/nevware21/ts-utils/pull/337) Update dependabot.yml
- [#338](https://github.com/nevware21/ts-utils/pull/338) Bump github/codeql-action from 2 to 3
- [#340](https://github.com/nevware21/ts-utils/pull/340) Bump actions/checkout from 2 to 4
- [#339](https://github.com/nevware21/ts-utils/pull/339) Bump codecov/codecov-action from 2 to 4
- [#341](https://github.com/nevware21/ts-utils/pull/341) Bump actions/configure-pages from 4 to 5
- [#342](https://github.com/nevware21/ts-utils/pull/342) Bump actions/setup-node from 3 to 4
- [#343](https://github.com/nevware21/ts-utils/pull/343) Update to use ts-build-tools
  - [#344](https://github.com/nevware21/ts-utils/pull/344) Bump @nevware21/ts-build-tools to ^0.1.3
- [#345](https://github.com/nevware21/ts-utils/pull/345) Bump codecov/codecov-action from 4 to 5
- [#347](https://github.com/nevware21/ts-utils/pull/347) Create FUNDING.yml
  - [#348](https://github.com/nevware21/ts-utils/pull/348) Update FUNDING.yml
- [#350](https://github.com/nevware21/ts-utils/issues/350) [doc] TSDoc Error During Build


# v0.11.5 Oct 23rd, 2024

## Changelog

- [#324](https://github.com/nevware21/ts-utils/pull/324) [Doc] Auto deploy docs and remove from repo
- [#325](https://github.com/nevware21/ts-utils/pull/325) chore: Auto deploy docs
- [#326](https://github.com/nevware21/ts-utils/pull/326) Update auto-docs generation
- [#328](https://github.com/nevware21/ts-utils/pull/328) Bump @rollup/plugin-typescript from 11.1.6 to 12.1.0
- [#327](https://github.com/nevware21/ts-utils/pull/327) Typedoc: rename workflow
- [#330](https://github.com/nevware21/ts-utils/pull/330) Bump @rollup/plugin-commonjs from 26.0.3 to 28.0.0
- [#331](https://github.com/nevware21/ts-utils/pull/331) Bump puppeteer from 22.15.0 to 23.4.0
- [#333](https://github.com/nevware21/ts-utils/issues/333) [Bug] Glob is missing from the dev dependencies -- unable to build a clean repo
- [#332](https://github.com/nevware21/ts-utils/issues/332) [BUG] Sourcemap load errors in debugger from @nevware21 dependencies

# v0.11.4 Sept 21st, 2024

## Changelog

- [#289](https://github.com/nevware21/ts-utils/pull/289) Bump @typescript-eslint/parser from 6.21.0 to 7.14.1
- [#292](https://github.com/nevware21/ts-utils/pull/292) Bump @nevware21/grunt-eslint-ts from 0.2.4 to 0.2.5
- [#291](https://github.com/nevware21/ts-utils/pull/291) Bump @nevware21/grunt-ts-plugin from 0.4.5 to 0.4.6
- [#300](https://github.com/nevware21/ts-utils/issues/300) [Bug] The createRangeIterator() function is getting mis-optimized for a worker on chrome. [#298](https://github.com/nevware21/ts-utils/pull/298)
  - Bump @nevware21/grunt-eslint-ts from 0.2.5 to 0.5.0
  - Bump @nevware21/grunt-ts-plugin from 0.4.5 to 0.5.0
- [#302](https://github.com/nevware21/ts-utils/issues/302) [Bug] getInst() function is getting mis-optimized for a worker with rollup [#303](https://github.com/nevware21/ts-utils/pull/303)
  - Bump @nevware21/grunt-eslint-ts from 0.5.0 to ^0.5.1
  - Bump @nevware21/grunt-ts-plugin from 0.5.0 to ^0.5.1
- [#306](https://github.com/nevware21/ts-utils/issues/306) [Bug] CI Tests are failing [#319](https://github.com/nevware21/ts-utils/pull/319)
- [#318](https://github.com/nevware21/ts-utils/pull/318) Bump puppeteer from 22.15.0 to 23.4.0
- [#320](https://github.com/nevware21/ts-utils/pull/320) bug: update objDefine to use strict undefined
- [#322](https://github.com/nevware21/ts-utils/pull/322) Revert "Bump puppeteer from 22.15.0 to 23.4.0 (#318)"

# v0.11.3 Jun 26th, 2024

## Changelog

- #286 [Feature] Don't use objDeepFreeze for enums
- #285 Update Copyright message to conform with LLC operating agreement
- #278 Bump @rollup/plugin-commonjs from 25.0.8 to 26.0.1
- #288 Bump typedoc from 0.25.13 to 0.26.2
- #279 Bump nyc from 15.1.0 to 17.0.0

# v0.11.2 Apr 16th, 2024

## Changelog

- #263 Generate single unified es module for exports

# v0.11.1 Mar 31st, 2024

## Changelog

- #258 Remove exports defintion from package.json

# v0.11.0 Mar 18th, 2024

## Changelog

- #252 [Bug] TypeError: Illegal invocation when calling setTimeout
- #246 [Bug] Package sizes are too large
- #241 Remove removed function link from readme
- #244 Fix CreateIteratorContext `n` documentation

# v0.10.5 Feb 6th, 2024

Minification and minor performance improvements, adds `createcacheValue`, `safe` implementations.

## Changelog

- #239 Stop using internal functions for diagnostic to help with base minification for smaller usages
- #238 Bump puppeteer from 21.11.0 to 22.0.0

# v0.10.4 Jan 10th, 2024

## Changelog

- #230 [Bug] Tree-Shaking is not working properly
  - Tags additional (everything else) functions as __NO_SIDE_EFFECTS__ so that rollup (and webpack) can tree-shake
  - Explicitly did not include all functions like isXXXX (specifically isNode) as this was causing the main entry-points
    for @nevware21/ts-async to drop the node support code (as it's defined as a browser package) resulting in it not
    supporting all environments as desired with a single package.

# v0.10.3 Jan 7th, 2024

## Changelog

- #230 [Bug] Tree-Shaking is not working properly
- #226 [Feature] Add size tests

# v0.10.2 Jan 4th, 2024

## Changelog

- #211 Update signature of getInst and lazySafeGetInst to support any PropertyKey type
- #228 Minor Performance updates

### Dependencies
- #212 Bump typedoc from 0.24.8 to 0.25.0
- #218 Bump rollup-plugin-istanbul from 4.0.0 to 5.0.0 #218
- #220 Fix issue with node version in ci.yml
- #217 Bump rollup from 3.29.4 to 4.1.4
- #223 Bump @types/sinon from 10.0.20 to 17.0.1

# v0.10.1 Aug 18th, 2023

> This is a critical bug fix if you are using `symbolKeyFor` and/or `symbolFor`, as the current implementations will always
> return a new polyfill version rather than using the native `Symbol.keyFor` and `Symbol.for` methods

## Changelog

- #208 [Bug] symbolFor and symbolKeyFor are not caching / returning the underlying instance

# v0.10.0 Aug 17th, 2023

## Changelog

- #204 [Bug] Remove typescript as a peer dependency
- #206 Update enum type definitions to provide better validation and auto code completion
- #202 Bump @typescript-eslint/eslint-plugin from 5.62.0 to 6.1.0
- #203 Bump puppeteer from 19.11.1 to 21.0.0

# v0.9.8 June 18th, 2023

## Changelog

- #192 [Bug] iterForOf does not always process elements correctly
- #193 [Bug] Calling return or throw on an iterator does not mark it as done
- #194 [Bug] iterForOf swallows errors caused during the iteration
- #196 [Feature] Add aliases for functions apply, bind and call
- #197 [Feature] Add function proxies

# v0.9.7 June 11th, 2023

## Changelog

- #185 [Feature] Add Object.entries and Array.from alias / implementations
- #187 [Feature] Add Object.values alias / implementation
- #189 [Feature] Update issue templates

# v0.9.6 May 31st, 2023

## Changelog

- #178 [Bug] objDeepCopy creates copies of classes by default
- #181 [Bug] customError definition is not correct, it's a mixture of constructor and implmentation
- #182 [Feature] Allow creation of sub-class custom errors
  - Set stack trace to the top-most error class

# v0.9.5 Apr 25th, 2023

## Changelog

- #173 Support: expose the internal safe helpers to allow reuse.
- #172 Update publishing scripts
- #171 Update publishing scripts
- #170 Bump typedoc to ^0.24.4

# v0.9.4 Mar 25th, 2023

## Changelog

- #166 Add writable Lazy support and lazy option to objDefine
  - getWritableLazy()
  - objDefine(target, "name", { l: ILazyValue });

# v0.9.3 Mar 25th, 2023

## Changelog

- #164 Add arrSlice and replace _extractArgs usages

# v0.9.2 Mar 24th, 2023

## Changelog

- #162 Update Lazy implementation to reduce required for getGlobal()

# v0.9.1 Mar 23rd, 2023

## Changelog

- #158 Migrate get/set value by key and strSplit
- #159 [Packaging] The single module file is causing some packagere issues

# v0.9.0 Mar 15th, 2023

## Changelog

- #153 chore: Migrate encoding and conversion functions
  - strLetterCase(); strCamelCase(); strKebabCase(); strSnakeCase(); strUpper(); strLower();
  - encodeAsJson(); encodeAsHtml(); normalizeJsName();
- #154 Minor enhancements for perf and minification and additional examples
- #155 Add strIncludes, strContains
  - strContains(); strIncludes();

# v0.8.1 Mar 2nd, 2023

## Changelog

- #148 <span style="color:red">__(Priotity 1)__</span> [Bug] Creating more than 1 createCustomError() overwrites the "name" of the error.
  - Issue was causing the <span style="color:red">Error class name</span> to be reassigned to the last created Custom Error, if no custom error was created (including the UnsupportedError) then the Error class was unaffected
- #146 [Feature] Add an enabled / running flag to the timers to enable checking current state

# v0.8.0 Feb 21st, 2023

## Changelog

- #143 Add additional Array functions and update to support ArrayLike objects
  - new Functions: arrEvery, arrFilter, arrFind, arrFindIndex, arrFindLast, arrFindLastIndex, arrIncludes, arrContains, arrLastIndexOf, arrSome
  - Updated examples and added tests for Array like
  - some polyfill versions also added

# v0.7.3 Feb 17th, 2023

## Changelog

- #141 Update packaging to create single rollup resources
  - Create single module export
  - Include comments in the d.ts

# v0.7.2 Feb 5th, 2023

## Changelog

- #139 Apply additional minification for enum, dumpObj, timers

# v0.7.1 Feb 4th, 2023

## Changelog

- #134 Update build link
- #135 Update to use root LICENSE and README.md in the npm published package
- #136 chore: Update coverage reporting to include worker test run
- #138 Add .npmignore for release

# v0.7.0 Jan 12th, 2023

## Changelog

- #124 [Request] Add/expose additional NodeJS.Timer functions to the timer implementations
- #132 Add "esnext" (es6) to package.json and available pre-bundle packages
- #121 Bump sinon from 14.0.2 to 15.0.0
- #123 Bump karma-spec-reporter from 0.0.34 to 0.0.35
- #125 Bump karma-spec-reporter from 0.0.35 to 0.0.36
- #127 Bump @rollup/plugin-json from 5.0.2 to 6.0.0
- #126 Bump @rollup/plugin-commonjs from 23.0.7 to 24.0.0
- #130 Bump @rollup/plugin-typescript from 10.0.1 to 11.0.0

# v0.6.0 Nov 28th, 2022

## Changelog

- #115 Add optional enumerable argument to objDefineGet and objDefineAccessors
- #116 Bump rollup from 2.79.1 to 3.3.0
- #117 Add objDefine, objDefineProperties and objDefineProps
- #118 Update package.json and docs for release

# v0.5.0 Oct 18th, 2022

## Changelog

- #110 [Test Hook] Need the ability to clear the new lazy cache values for environment values
  - Introduces the ability to cause lazy implmentations to bypass cached values
  - Moved the location of the polyfill global symbol registry

# v0.4.6 Oct 15th, 2022

## Changelog

- #106 v0.4.5 has Circular dependencies

# v0.4.5 Oct 14th, 2022

## Changelog

- #99 [Bug] Fix issue where Arrays with non-indexed values are not copied
- #100 Add lazy initialization of globals to provide better tree-shaking when not used.
- #101 Add clearTimeout override option for the scheduleTimeoutWith

# v0.4.4 Oct 10th, 2022

## Changelog

- #83 [Typing] arrForEach - the signature for the callback is incorrect
- #84 [Bug] objDeepCopy incorrectly tries to copy classes (like Date)
  - #87 [Bug] objDeepCopy incorrectly tries to copy classes (like Date) #84
  - #90 [Bug] objDeepCopy incorrectly tries to copy classes (like Date) #84
- #88 Add timer support

# v0.4.3 Sept 9th, 2022

## Changelog

- #79 [Bug] objForEachKey() is not iterating over defined properties which are enumerable
- #80 [Bug] toString() added in 0.4.2 is not exported from the main module

# v0.4.2 Aug 15th, 2022

## Changelog

- #72 Add mathMin and mathMax
  - Add strSubstring; strSubstr; strLeft; strRight
  - Add getLength
- #73 Add iterator and iterable creation and processing functions
  - Add creatorIterator
  - Add createArrayIterator
  - Add createIterator; createIterable; makeIterable
  - Add iterForOf
  - Add createRangeIterator
  - Update copyright notices on tests
  - Update ReadMe
- #74 Update typedoc groups and readme

# v0.4.1 Aug 12th, 2022

## Changelog

- #69 [Bug] isObject() throws a TypeError when an object is created via Object.create(null)

# v0.4.0 Aug 10th, 2022

## Changelog

- #66 [Bug] strStartsWith and strEndsWith are converting all arguments to strings even if they are not
- #67 Add isIterator() and isIterable()
  - Break out array functions into separate files
  - Update string stubs to use generated function

# v0.3.4 Aug 8th, 2022

## Changelog

- #61 [Compatibilty] ReactNative uses a JavaScript Core that does not support regex lookbehinds
- #62 [Bug] The generic definition of the arrReduce does not handle different arguments correctly

# v0.3.3 Aug 5th, 2022

## Changelog

- #55 Add generic typing's to some functions
- #56 Move source folder from ts-utils to lib and upgrade typedoc
- #57 Bump puppeteer from 15.5.0 to 16.0.0
- #58 Add arrMap and update typedoc groupings

# v0.3.2 Aug 3rd, 2022

## Changelog

- [Bug] String trim functions are not exported #51
  - Added missing exports for
    - strEndsWith
    - strPadEnd
    - strPadStart
    - strRepeat
    - strSlice
    - strTrim
    - strTrimEnd
    - strTrimStart
    - strTrimLeft
    - strTrimRight

- Added functions
  - arrIndexOf
  - arrReduce
  - strIndexOf
  - strLastIndexOf

- #53 [Bug] The build generated polyfill bundle is missing from the npm package

# v0.3.1 Jul, 27th, 2022

## Changelog

- #45 [TreeShaking Issue] The createCustomError is always getting included in the output.
- #46 [Symbol support] Have the ability to always return the polyfill symbols if not supported

# v0.3.0 Jul, 25th, 2022

## Changelog

- #32 Bump @types/estree from 0.0.52 to 1.0.0
- #34 Add more `Object.create` and `objSetPrototypeOf` tests
  - Add `symbol` support
  - Rollup back typedoc version so descriptions are published (there is an issue with isArray and isArrayBuffer)
  - Switch to HTML Docs
- #42 Add `enum helpers` and update `symbol` support
  - Update Custom Error to support `custom error types` (not just messages)
  - Add some more examples

Documentation Updates
- #35 Update HTML link to preview
- #36 Update to use github pages link
- #37 Restore Old documentation references for npm
- #40 Update readme path
- #41 Remove old pages folder

# v0.2.0 Jun 29th, 2022

## Changelog

- #26 Add `Object.create` and `objSetPrototypeOf` tests
    - Rollup back typedoc version so descriptions are published
- #23 Add initial `math`, additional `string` and `throwRangeError`
    - Add `math` `floor`, `ceil`, `trunc` and `toInt`
    - Add `string`, `pad`, `slice` and `trim`, rework string file layout
    - Add `throwRangeError`
- #25 Bump @types/estree from 0.0.51 to 0.0.52
- #24 Bump typedoc from 0.22.18 to 0.23.1
- #22 Bump puppeteer from 14.4.1 to 15.0.2
- #20 Add more tests, add additional string, object helpers and custom error support
    - Split out extend
    - Split out object to avoid circular dependencies
    - Remove partial ES3 compatibility from objDefine functions
    - Add string `startsWith` and `endsWith` (with polyfills for IE)
    - Add `throwUnsupportedError` and `createCustomError`
    - Increase test coverage
- #19 Add string and object tests -- fixing issues
    - Add combined (merge) coverage report and summary
- #18 Add Security policy and fix a few copyright header comments
- #17 Add `web worker tests`
    - Add more tests coverage
    - Fix identified issues
- #16 Add `Local browser based debugging` option
- #15 Add additional tests and browser coverage
- #13 Update Documentation
    - Rework some base functions for better minification
    - Update the polyfill bundle to include more used functions
- #14 Bump mocha from 9.2.2 to 10.0.0
- #12 Add Tests and Coverage, remove rush usage
- #10 Bump @nevware21/grunt-ts-plugin from 0.4.3 to 0.4.5
- #11 Bump @nevware21/grunt-eslint-ts from 0.2.2 to 0.2.4

# v0.1.1 May 30th, 2022

## Changelog

- [Bug] v0.1.0 has an invalid entry point defined in the package.json #5
