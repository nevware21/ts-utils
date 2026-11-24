# Unreleased (Proposed 0.20.0)

## Changelog

### Features

- [#647](https://github.com/nevware21/ts-utils/pull/647) `dumpObj` has a new optional third `maxLength` argument, which limits the length of the returned string, a longer string is truncated and ends with `...` (which is included in the length, like `strTruncate`) without splitting a surrogate pair, eg. `dumpObj(value, false, 20)`. It must be at least 3 (the length of the `...`), a smaller positive value is rounded up to 3 and a fraction is rounded down, and a value which is zero, negative or not a number doesn't limit the length (so the array passed to a callback doesn't limit it)
  - **Breaking change:** `arr.map(dumpObj)` (or another callback which is passed a third argument which isn't a number) no longer compiles in TypeScript, as the array that `map` passes isn't a number (at runtime it doesn't limit the length). It also passed the index as the `format`, so every value after the first was formatted with that number of spaces. A callback which is passed a number as its third argument still compiles and now limits the length to it, eg. `"xabcx".replace(/(b)/g, dumpObj)` (where the third argument is the offset of the match) returns `"xa...cx"` and `[1, 2, 3].reduce(dumpObj, "")` (the index) returns `"..."`, so use a function instead, eg. `arr.map((value) => dumpObj(value))`
- [#647](https://github.com/nevware21/ts-utils/pull/647) New `isStringObject()` checks if a value is a `String` object (a string wrapped in an object), eg. `new String("abc")` or `Object("abc")`, which `isString()` doesn't identify as it only checks for a primitive string (`typeof value === "string"`), eg. `isString(new String(""))` is `false`. And the new `isStringLike()` checks for either, a primitive string or a `String` object
- [#592](https://github.com/nevware21/ts-utils/pull/592) feat(array): add `arrIndexOfSubset()` and `arrLastIndexOfSubset()` to locate the first/last index at which an array of values matches contiguously within another, re-searching later/earlier occurrences of the leading value when it repeats (eg. matching one stack trace against another) instead of stopping at the first, wrong occurrence
  - The elements are read by index and compared with `===`, so for a string its characters are compared (a string element never matches a substring, eg. `arrIndexOfSubset("abc", ["bc"])` is `-1`) and an empty slot of a sparse array is compared as `undefined`
  - A `subset` which runs off the end of `theArray` matches the available elements (so a truncated array can be matched), so as `arrLastIndexOfSubset` searches from the end a trailing partial match is found before an earlier full match, eg. `arrLastIndexOfSubset([1, 2, 3, 1], [1, 2])` is `3` (a `fromIndex` of `theArray.length - subset.length` only finds a full match, eg. `arrLastIndexOfSubset([1, 2, 3, 1], [1, 2], 2)` is `0`)
- [#639](https://github.com/nevware21/ts-utils/pull/639) New exported types for the TypeScript v3.4 support (see Bug Fixes): `DeepPartialArray`, `DeepReadonlyArray`, `DeepRequiredArray`, `IAsyncGeneratorFunction`, `IAsyncIterable`, `IAsyncIterator`, `IIdleDeadline`, `IIdleRequestOptions` and `IdleCallbackFn`
- New `isNativeFn(value, name?)` checks whether a value is a native function (a function which isn't written in JavaScript, eg. a built-in function such as `Array` or `Math.max`, a bound function or a callable `Proxy`) and, when a `name` is passed, whether it is the native function with that name, eg. `isNativeFn(iframe.contentWindow.Array, "Array")` is `true` for another realm's `Array`. Its source text, from the intrinsic `Function.prototype.toString()` (captured when it is loaded, so a function's own `toString()` isn't used), is matched against the `NativeFunction` syntax which the ECMAScript specification requires (eg. `function Array() { [native code] }`) in linear time. It returns a `boolean` rather than being a type guard, as `false` doesn't mean that the value isn't a function
- New `isConstructor(value)` checks whether a value can be called with `new` (like the ECMAScript `IsConstructor()`) without calling it or reading its properties. Where there is a `Proxy` a Proxy of the value whose `construct` trap doesn't call it is called with `new`, otherwise (eg. ES5) `instanceof` is used, so a function, a class, a built-in constructor and a bound constructor are constructors, while an arrow function, a method, a generator, an async function and a built-in function such as `Math.max` aren't (on a runtime without `Proxy`, a function written in JavaScript whose `prototype` was replaced with a value which isn't an object isn't identified as one)

### Security Issue

- [#646](https://github.com/nevware21/ts-utils/pull/646) `isUnsafeTarget` (used by the prototype pollution guards of `objCopyProps`, `objExtend`, `deepExtend`, `objDeepCopy`, `objDefaults`, `objMergeIf`, `setValueByKey` and `setValueByIter`) did not recognise most of the built-in prototypes in the bundles since v0.14.0
  - The helpers that added the prototypes were annotated as having no side effects (`#__NO_SIDE_EFFECTS__`), so bundlers removed the calls to them: the published bundles were missing the `TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`, `EvalError` and `URIError` prototypes, and an application bundled and minified with esbuild (eg. `esbuild --minify`, or a production build minified by esbuild) was also missing the `Map`, `Set`, `WeakMap`, `WeakSet`, `Promise`, `Symbol`, `ArrayBuffer`, `SharedArrayBuffer`, `DataView`, typed array, `WeakRef` and `FinalizationRegistry` prototypes, so the guards could change those prototypes
  - The unit tests run the source, where the annotation does nothing, so a new check stops a call to an annotated function from being used as a statement, and the built bundles (and a consumer bundled with esbuild and Rollup) are now run by a CI step (see Repository Improvements)
  - It now also identifies the `AggregateError`, `BigInt`, `Iterator` and `Float16Array` prototypes and the built-in prototypes that the classes inherit from, eg. `%TypedArray%.prototype` (the prototype of the typed array prototypes), when the runtime defines them
  - A class which is defined after the first check (eg. a `Promise` or `Map` polyfill loaded later) is now also identified when its prototype (whose own `constructor` is the class) is checked, previously only the classes defined when it was first called were identified. A target whose own `constructor` can't be read (eg. a revoked `Proxy`) is not identified, rather than the check throwing. The missing classes are only looked up again when the class differs from the last class whose prototype caused them to be looked up, so repeatedly checking the prototype of the same class (eg. `objExtend(MyClass.prototype, ...)` or `setValueByKey` on it) isn't slower. A call made while the classes are being looked up (eg. from a global getter which uses `objExtend`) uses the prototypes found so far rather than throwing (0.16.0 overflowed the stack), and a class whose prototype can't be read is treated as not defined rather than the first call throwing
  - **Behaviour change:** as the prototype of a polyfill's class is identified once the class is the global, a polyfill which assigns the global class first and then adds to its prototype with `objExtend`, `objDefaults`, `objCopyProps`, `deepExtend`, `objMergeIf`, `setValueByKey` or `setValueByIter` no longer changes the prototype (it did in v0.16.0), so use `objDefine` / `objDefineProps` to add to the prototype. As the missing classes are only looked up again for a different class, a class prototype which was checked before its class became the global is only identified once the prototype of another class has been checked, so a polyfill which adds to its prototype with `objExtend` etc. before assigning the global leaves the global's prototype unprotected until then
- [#647](https://github.com/nevware21/ts-utils/pull/647) `setValueByIter` (and so `setValueByKey`) now converts each key to a property key once (a string, unless it's a symbol) before its unsafe key check (`isUnsafePropKey`), and uses the converted key. Previously only a string `__proto__`, `constructor` or `prototype` key was blocked, so a key which converts to one (eg. `["constructor"]` from `JSON.parse`, or an object whose `toString()` returns `"constructor"`) was used, and a path could replace a static function of a built-in class, eg. `setValueByIter({}, JSON.parse('[["constructor"], "assign"]'), 1)` set `Object.assign` (the built-in prototypes were still protected by `isUnsafeTarget`)
  - It also removes the object it added for the path whenever the value isn't set, including when the iterator (or its `return()`, or a getter) throws (previously only for a path which isn't valid). Only the object it added is removed (not a value which replaced it), an own `null` or `undefined` value which the object replaced is restored (previously the property was deleted, eg. `a` of `{ a: null }` for the path `["a", "b", "__proto__", "x"]`), and the object added for a symbol key is now also removed
  - `setValueByKey` now sets the parts of its path with `setValueByIter`, so it has the same checks and removes the objects it added in the same way (previously they were left when a getter or setter threw)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `setValueByKey` and `setValueByIter` now replace an inherited function in the path with a new object, which (like the object added for a missing value) is added as an own property of the target, rather than walking into it, so a path sets the target's own properties rather than changing a function inherited from a prototype. Eg. `setValueByKey({}, "hasOwnProperty.call", "x")` (where the path and value may come from JSON) replaced the `call` of `Object.prototype.hasOwnProperty`, which broke every `Object.prototype.hasOwnProperty.call(...)` (including those within ts-utils), and now sets the target's own `hasOwnProperty` to `{ call: "x" }`. A path through an own property which is a function (eg. the `fn` of `{ fn: myFunc }`) is still followed, as is an inherited value which isn't a function (eg. the object returned by a getter of a class)
  - **Behaviour change:** this includes the methods a class instance inherits, eg. `setValueByKey(new Foo(), "method.x", 1)` now sets the instance's own `method` to `{ x: 1 }` (previously it set `Foo.prototype.method.x`, which changed the method of every instance)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `objDefine`, `objDefineProps`, `objDefineGet` and `objDefineAccessors` (and so `objFromEntries` and `arrFrom` / `polyArrFrom` on a runtime without the native function, which define values with them) now create the property descriptor without a prototype and only use the own properties of the descriptor they are passed which are descriptor keys (`v`, `w`, `e`, `c`, `g`, `s` and `l`), other keys (eg. `constructor`) and inherited properties are ignored. `Object.defineProperty` also reads the inherited properties of a descriptor, so a property added to `Object.prototype` (eg. by prototype pollution) could change the defined property or make it throw, eg. with `Object.prototype.value` set, `objDefine(target, "a", { v: undefined })` defined the polluted value, and an inherited `get`, `writable` or `l` (lazy value) also changed the property or threw a `TypeError`. This protects against a value added to `Object.prototype`, while (as before) an accessor added to it for `v`, `g` or `s` still intercepts the descriptor that `objDefineGet` and `objDefineAccessors` create. As V8 reads a descriptor without a prototype more slowly, defining a property is ~1.5-2.5x slower than v0.16.0 (eg. `objDefine({}, "x", { v: 1 })` ~470ns, was ~220ns)
  - **Behaviour change:** an inherited lazy value (`l`) is no longer used (eg. a descriptor created with `objCreate({ l: lazyValue })`), only an own one, like the other descriptor keys. The setter of a lazy value is only used when its `v` is an own accessor with a setter (previously a `set` inherited by its property descriptor, eg. from a polluted `Object.prototype`, was also used)
  - `objDefineProps` creates its property map without a prototype, so like `Object.defineProperties` a `__proto__` key (eg. from `JSON.parse`) is defined (previously it was ignored), and a read-only property of `Object.prototype` (eg. when it is frozen) doesn't stop a key being defined
- [#647](https://github.com/nevware21/ts-utils/pull/647) Error messages which include a value (the `TypeError` of `polyObjCreate`, `"Prototype must be an Object or function: ..."`, and the `RangeError` of `mathToInt`) now limit the value's `dumpObj()` to 1024 characters (ending with `...`), using its new `maxLength` argument (see Features), so a large value (which may be controlled by the caller) doesn't create a large error message. The other polyfills no longer include the value in their message (see below).
- [#642](https://github.com/nevware21/ts-utils/pull/642) `objCopyProps` and `objExtend` now refuse to change a built-in prototype such as `Object.prototype` (the prototype pollution guard was checking the source rather than the target), and their documentation now states that only own enumerable properties are copied and that `__proto__`, `constructor` and `prototype` are skipped
- [#647](https://github.com/nevware21/ts-utils/pull/647) `makeGlobRegex` no longer takes exponential time to fail for a path with many folders (affected since v0.9.0), as a `**` followed by a folder separator now matches the folders with one group where each repetition is one folder (`((?:[^\/]*[\/])+)?`) rather than `(.*[\/])*`, eg. `makeGlobRegex("**/*.txt", false, true)` took ~10s to fail against 61 characters of repeated `"a/"` (each extra folder doubled it), now ~0.01ms. It matches and captures the same values, except that (like a `*`) a folder name which contains a line terminator is now matched, eg. `makeGlobRegex("**/*.txt", false, true)` matches `"a\nb/c.txt"` (the `.` of the previous pattern didn't match it). **Behaviour change** (minor): the `source` of the regular expression is different. The documentation of `makeGlobRegex`, `createWildcardRegex` and `createFilenameRegex` now says that their other wildcards can still backtrack (polynomial time), so the length of an untrusted string should be limited
- [#647](https://github.com/nevware21/ts-utils/pull/647) `polyStrTrim` and `polyStrTrimEnd` (the polyfills bundle's `String.prototype.trim`, `trimEnd` and `trimRight`) no longer take quadratic time for a long run of whitespace which isn't at the end of the value, as they find the whitespace at the end by searching backwards rather than with `/\s+$/g`, eg. ~7s for 80,000 spaces followed by `"x "`, now <1ms. The results are the same as the native functions (for every BMP code point)

### Bug Fixes

- [#627](https://github.com/nevware21/ts-utils/issues/627) / [#637](https://github.com/nevware21/ts-utils/pull/637) fix(object): `objForEachKey`, `objForEachKeySafe`, `forEachOwnKey` and `forEachOwnKeySafe` no longer abort the enumeration when a property getter throws
  - The exception from the getter is caught and the key is skipped (the callback isn't called for it), so the remaining keys are still visited
  - **Behaviour change:** the helpers which use them also skip a property whose getter throws (previously the exception was thrown), eg. `objCopyProps`, `objExtend`, `deepExtend`, `objDeepCopy`, `objDefaults`, `objMergeIf`, `objDefineProps`, `objPick` and `objOmit`, so `objExtend({ a: "keep" }, { get a() { throw new Error(); } })` keeps `a` (rather than copying `undefined` over it) and `objDeepCopy` doesn't add the key
  - Exceptions thrown by the callback itself are not caught and still propagate
  - `polyObjKeys` no longer invokes property getters (so it no longer throws for an object with a throwing getter), matching the native `Object.keys`
  - `polyObjEntries` and `polyObjValues` still invoke each getter once and propagate any exception it throws, matching the native `Object.entries` and `Object.values`

- [#634](https://github.com/nevware21/ts-utils/issues/634) / [#636](https://github.com/nevware21/ts-utils/pull/636) Case helpers (`strCamelCase`, `strKebabCase`, `strSnakeCase`, `strLetterCase`, `strCapitalizeWords`): inconsistent word boundaries and non-ASCII letters dropped
  - **Behaviour change:** callers that depend on the previous output for the inputs below will see different results
  - `strKebabCase` and `strSnakeCase` now also split words at the end of an uppercase run before a capitalized word and where a number is followed by an uppercase letter, eg. `"XMLHttpRequest"` -> `"xml-http-request"` (was `"xmlhttp-request"`), `"ABCDef"` -> `"abc-def"` (was `"abcdef"`), `"fooBar2Baz"` -> `"foo-bar2-baz"` (was `"foo-bar2baz"`) and `"hELLo"` -> `"h-el-lo"` (was `"h-ello"`), while (as before) a plural `s` which ends a word isn't split from an uppercase run, eg. `"userIDs"` -> `"user-ids"` and `"getURLsFor"` -> `"get-urls-for"`. This also makes more camelCase values reversible, eg. `"fooBar2Baz"` -> `"foo-bar2-baz"` -> `"fooBar2Baz"` (was `"fooBar2baz"`)
  - `strKebabCase` and `strSnakeCase` now also split a word after a separator which starts with one lowercase letter followed by an uppercase letter (like the same word at the start of the value), eg. `"the iPhone app"` -> `"the-i-phone-app"` (was `"the-iphone-app"`), `"set xPosition"` -> `"set-x-position"` (was `"set-xposition"`) and `"use jQuery here"` -> `"use-j-query-here"` (was `"use-jquery-here"`)
  - Non-ASCII letters, numbers and combining marks are now part of words rather than separators, eg. `"café crème"` -> `"caféCrème"` / `"café-crème"` (was `"cafCrMe"` / `"caf-cr-me"`) and `strCapitalizeWords("café crème")` -> `"Café Crème"` (was `"Café CrèMe"`). The first letter of a word is case converted as a complete character, including supplementary plane (surrogate pair) letters, eg. `strLetterCase("𐐨")` -> `"𐐀"`
  - Only whitespace and the punctuation and symbols of ASCII and Latin-1 (except `ª²³µ¹º¼½¾`) and of the General Punctuation (except the zero width non-joiner and joiner, so they don't split a word or an emoji sequence), Currency Symbols, Arrows to Miscellaneous Symbols and Arrows (except Enclosed Alphanumerics, eg. `Ⓐ` and `①`, and the Dingbat numbers) and CJK Symbols and Punctuation (except its letters, numbers and marks, eg. `々〆〇〡〪〱〻〼`) blocks are separators (previously every non-ASCII character was a separator), so every other character is part of a word, eg. a supplementary plane emoji (`strKebabCase("I 😀 JS")` -> `"i-😀-js"`, was `"i-js"`), a Letterlike Symbol (`"Hello™ World"` -> `"hello™-world"`, was `"hello-world"`), `²` and `µ` (`"50µs"` -> `"50µs"`, was `"50-s"`), the CJK iteration marks and numbers (`"a〇b"` -> `"a〇b"`, was `"a-b"`) and fullwidth or non-Latin punctuation, while (as before) the emoji of those blocks (eg. `©`, `❤`, `⭐` and `✅`) are separators (`"I ⭐ JS"` -> `"i-js"`). Any of these word characters followed by an uppercase letter starts a new word, eg. `"Hello™World"` -> `"hello™-world"` (was `"hello-world"`)
  - Uppercase letters (word boundaries) are detected for `A-Z`, the Latin-1 letters `À-Þ` (except `×`), the basic Greek capitals `Ά`, `Έ-Ώ` and `Α-Ϋ` (U+0386, U+0388 to U+038F and U+0391 to U+03AB, including the accented capitals, eg. `"ώραΈναρξης"` -> `"ώρα-έναρξης"`) and the basic Cyrillic capitals `Ѐ-Я` (U+0400 to U+042F) in both their precomposed and decomposed (NFC / NFD) forms, other cased letters (eg. `"Ł"`, `"Č"`, `"Ϗ"`, `"Ґ"` and `"Қ"`) are retained and case converted but don't start a new word (`"łódźŁódź"` -> `"łódźłódź"`), while a decomposed letter whose base letter is within those ranges does (`"C"` followed by a combining caron), so normalize values that may contain both forms first. The same fixed ranges are used on every runtime (no Unicode property escapes, which require ES2018), so the output does not depend on the runtime
  - `strLetterCase` and `strCapitalizeWords` now also capitalize a word that follows repeated `_` characters, eg. `"__init__"` -> `"__Init__"` (was `"__init__"`), consistent with `"_init"` -> `"_Init"`
  - Unchanged, so the conversions remain reversible: `strCamelCase` only changes the first letter of each word and retains the case of the other letters (`"XMLHttpRequest"` -> `"xMLHttpRequest"`, `strCamelCase("XMLHttpRequest", true)` -> `"XMLHttpRequest"`), `strKebabCase` and `strSnakeCase` remove leading and trailing whitespace but retain any other leading or trailing separators as a single separator (`"_hello_darkness"` <-> `"-hello-darkness"`), and `strCapitalizeWords` only splits words at separators (`"fooBarBaz"` -> `"Foobarbaz"`, now documented)
- [#639](https://github.com/nevware21/ts-utils/pull/639) The exported types compile with TypeScript v3.4 again, as documented (they had stopped compiling from v0.14.0, with some earlier issues)
  - `DeepPartial`, `DeepReadonly` and `DeepRequired` now resolve arrays through the new `DeepPartialArray`, `DeepReadonlyArray` and `DeepRequiredArray` interfaces, the resulting types are unchanged
  - `ObjDefinePropDescriptorMap` is now `Record<PropertyKey, ObjDefinePropDescriptor>` (unchanged on TypeScript v4.4 and later)
  - `isAsyncGenerator` now narrows to the new `IAsyncGeneratorFunction` (assignable to `AsyncGeneratorFunction`), and `RequestIdleCallback` / `scheduleIdleCallback` use the new `IdleCallbackFn`, `IIdleDeadline` and `IIdleRequestOptions` (the same shapes as the DOM types) as these are not provided by older TypeScript versions
  - **Breaking change (types, TypeScript before v4.3):** `isAsyncIterable` now narrows to the new `IAsyncIterable` (and `IAsyncIterator`) so the exported types no longer require the ES2018 lib. With TypeScript v4.3 and later it is interchangeable with the native `AsyncIterable`, older compilers using the ES2018 lib see `any` (so on those versions a value declared as a union with `AsyncIterable` is no longer narrowed when it returns `true`, and is `never` when it returns `false`, so code using the value in the `else` branch no longer compiles)
  - The typings are now compiled with TypeScript v3.4 through to the current version as a CI step, see Repository Improvements
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrUnique` and `arrUnion` no longer discard distinct values. Objects, arrays, functions and dates were compared by their string form, so `arrUnique([{ a: 1 }, { b: 2 }])` returned `[{ a: 1 }]` and a `Symbol` threw a `TypeError`; these are now compared by identity, as documented. **Behaviour change:** equal but distinct objects are now all kept, eg. `arrUnique([[1, 2], [1, 2]])` returns both arrays (was `[[1, 2]]`), as do two `Date`s with the same time and `arrUnion([[1]], [[1]])`
- [#642](https://github.com/nevware21/ts-utils/pull/642) `encodeAsBase64`, `decodeBase64` and the URL-safe variants now use the native `btoa` / `atob` in browsers. The native functions were called with the wrong `this` so every call failed and used the polyfill, which gave different results to Node, eg. `decodeBase64("QQ")` returned `"A\0\0"` (now `"A"`) and values containing a line break were corrupted. The decoding polyfill used when there is no native `atob` (eg. IE 9) now follows the same rules as `atob()`, so ASCII whitespace is ignored, the padding is optional and a value which isn't valid Base64 throws
- [#642](https://github.com/nevware21/ts-utils/pull/642) **Behaviour change:** `decodeBase64` and `decodeBase64Url` now return a value which isn't valid Base64 as-is (like `decodeUri`), previously it was decoded into the wrong characters, eg. `decodeBase64("@@@@")` returned `"\0\0\0"`
- [#642](https://github.com/nevware21/ts-utils/pull/642) `encodeAsHex`, `encodeAsBase64` and `encodeAsBase64Url` no longer corrupt text containing characters above `U+00FF`, and it is restored by the matching decode function
  - **Behaviour change:** only for text which was previously corrupted, this is now encoded as the UTF-8 byte order mark followed by the UTF-8 bytes, eg. `encodeAsHex("€")` -> `"efbbbfe282ac"` (was `"ac"`). The encoding of all other text is unchanged, except for text that itself starts with the characters of that marker
  - **Behaviour change:** `decodeHex`, `decodeBase64` and `decodeBase64Url` decode a value that starts with the marker and contains valid UTF-8 as text, all other values are decoded as before
  - An unpaired surrogate is not valid text, so like `TextEncoder` it is encoded as `U+FFFD`
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrForEach` no longer throws when passed a string, which also fixes `arrChunk`, `arrCompact`, `arrUnique`, `arrGroupBy`, `arrPartition`, `arrDropWhile`, `arrTakeWhile`, `arrIntersection`, `arrDifference`, `arrFlatten`, `arrToMap`, `arrUnzip`, `objPick`, `strStartsWithAny` and `strEndsWithAny` (eg. `objPick({ a: 1, b: 2, c: 3 }, "ab")` is `{ a: 1, b: 2 }`, `arrUnzip("ab")` is `[["a", "b"]]` and `strStartsWithAny("abc", "xa")` is `true`, they threw `Cannot use 'in' operator` in v0.16.0), and `arrShuffle` and the `polyArrWith`, `polyArrFind`, `polyArrFindIndex`, `polyArrFindLast`, `polyArrFindLastIndex` and `polyArrFlatMap` polyfills also now support a string (like the native functions the `callbackFn` is passed the string's `String` object as its third argument). **Behaviour change:** `arrDropWhile`, `arrDrop`, `arrTake` and `arrRotate` now return an array when passed a string (as documented), previously they could return a string. `arrRotate` and `arrUnion` now always split a string into its UTF-16 code units (like the other `arr*` helpers, which read a string by its indexes), previously this depended on the runtime supporting `Symbol.iterator`, so a surrogate pair (eg. an emoji) is now split into its two halves on every runtime (it was kept whole where there is `Symbol.iterator`). Unlike these `arrFrom` splits a string into its code points on every runtime, as do the `iter*` helpers where there is `Symbol.iterator` (see `iterForOf` below)
- [#642](https://github.com/nevware21/ts-utils/pull/642) **Behaviour change:** `arrIntersection` and `arrDifference` now compare the characters of a string (or `String` object) argument rather than matching substrings, eg. `arrIntersection([1], "123")` returned `[1]` (now `[]`)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrShuffle`, `arrDrop`, `arrTake`, `arrDropWhile`, `arrRotate`, `arrUnion` and the `polyArrWith` polyfill now always return a new array (as documented). They used the value's own `slice()`, so a typed array returned a typed array (and the polyfills bundle's `Array.prototype.with.call(new Uint8Array(1), 0, 300)` stored `44`), and a Node `Buffer` returned a view of the same memory, so `arrShuffle(buffer)` shuffled the caller's `Buffer` and changing the result of `arrDrop(buffer, 1)` changed it. **Behaviour change:** a typed array (or `Buffer`) now returns an `Array`, eg. `arrTake(new Uint8Array([1, 2, 3]), 2)` returns `[1, 2]` (was a `Uint8Array`)
- [#642](https://github.com/nevware21/ts-utils/pull/642) **Breaking change (types):** `arrSlice` is now declared as returning the type of the value when the value's own `slice()` returns that type, which is what it returns, eg. `arrSlice(new Uint8Array(4))` is a `Uint8Array` (was declared as `number[]`) and `arrSlice("abc")` is a `string` (was declared as `string[]`). Code which used the result for a string as an array will now report a compile error, as the value returned at runtime is a string (so array methods such as `map` fail)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `polyArrFind`, `polyArrFindIndex`, `polyArrFindLast` and `polyArrFindLastIndex` (used by `arrFind`, `arrFindIndex`, `arrFindLast` and `arrFindLastIndex` when there is no native function) now visit every index like the native functions and as documented, previously the empty slots of a sparse array were skipped (and they, like `polyArrFlatMap`, threw a `TypeError` for a string). Like the native functions `polyArrFind` and `polyArrFindIndex` now throw a `TypeError` for a `null` or `undefined` array (previously they returned `undefined` / `-1`)
  - **Behaviour change:** like the native functions they throw a `TypeError` for a `callbackFn` which is not a function (after reading the length) even when the array is empty, previously `undefined` / `-1` was returned
  - Like the native functions they convert the array to an object (ToObject) before reading its length and elements, call the `callbackFn` with the intrinsic call (previously its own `call` property was used) and return the value which was passed to the `callbackFn` (the element isn't read again)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `polyArrAt`, `polyArrWith`, `polyArrFill` (the polyfills bundle's `Array.prototype.at`, `with` and `fill`), `polyArrFind`, `polyArrFindIndex`, `polyArrFindLast` and `polyArrFindLastIndex` now convert the `length` like the native functions, so a fractional length is truncated and a negative length is 0, eg. `polyArrFindLastIndex({ length: -1 }, fn)` looped 2^32 - 1 times
  - Any `length` is converted like the native functions (ToLength), including one which isn't a number, eg. `polyArrAt({ length: "2", 0: "x", 1: "y" }, 0)` is `"x"` (was `undefined`), where `polyArrWith` threw a `RangeError` and `polyArrFill` changed nothing
  - **Behaviour change:** like the native functions `polyArrAt`, `polyArrWith` and `polyArrFill` throw a `TypeError` for a `null` or `undefined` array, previously `polyArrAt` returned `undefined`, `polyArrFill` returned the value and `polyArrWith` threw a `RangeError` (`arrAt`, `arrWith` and `arrFill` already threw where there is a native function)
  - **Behaviour change:** like the native functions they (and `polyArrIncludes`) convert the array to an object (ToObject) before reading its length and elements, so `polyArrFill` returns the object of a primitive value, eg. `typeof polyArrFill(5, 0)` is `"object"` (was `"number"`), and a getter (eg. on `Number.prototype`) is called with that object
- [#642](https://github.com/nevware21/ts-utils/pull/642) `iterTake` now closes the source iterator on the `next()` following the last value (like the native `Iterator.prototype.take`), previously it was closed before the consumer received the last value
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrIntersection` and `arrUnion` no longer throw for a `null` or `undefined` array after the first, `arrIntersection` treats it as empty and `arrUnion` ignores it
- [#642](https://github.com/nevware21/ts-utils/pull/642) `scheduleMicrotask` and `scheduleNextTick` no longer report `enabled` for a task that was rejected by, or run synchronously by, a custom `scheduleFn`
- [#642](https://github.com/nevware21/ts-utils/pull/642) `polyArrAt`, `polyArrWith` and `polyArrFill` now convert their indexes to integers like the native functions, so fractional and `NaN` indexes no longer return the wrong result or add fractional properties
- [#642](https://github.com/nevware21/ts-utils/pull/642) `objDeepCopy` handlers now receive the correct `path` for an empty string key and for a key of `0` passed to `details.copy()`
- [#647](https://github.com/nevware21/ts-utils/pull/647) `iterForOf` now processes a value like `for...of`
  - **Behaviour change:** an iterable which is also an iterator (has a `next()` function) is now processed using the iterator returned by its `[Symbol.iterator]()`, and only an iterator which isn't iterable is used as-is. Previously its `next()` function took precedence (as was documented), so an object such as a jQuery collection (which is iterable, and whose `next()` returns the next sibling elements rather than an iterator result) looped forever. The built-in iterators, generators and `createIterableIterator()` iterators return themselves, so they are unchanged
  - **Behaviour change:** when the iteration stops before the iterator is done, because the callback returns `-1` or throws, the iterator is closed by calling its `return()` with no arguments, so a generator's `finally` block is run (and its `catch` block no longer receives the callback's error). Previously when the callback threw the iterator's `throw()` was called (with an object wrapping the error) rather than `return()`, `return()` was passed the last iterator result, and `throw()` was also called when the iterator's own `next()` threw. The callback's error is thrown rather than any error thrown by `return()`
  - **Behaviour change:** a `TypeError` is thrown when `next()` returns a value which is not an object, previously a primitive result (eg. `1`) looped forever. Like `for...of` a `TypeError` is also thrown when `[Symbol.iterator]` is a value which isn't a function (only `null` or `undefined` is ignored) or `[Symbol.iterator]()` doesn't return an iterator (eg. `undefined` or an object without a `next()` function), previously nothing was processed, and when `return()` returns a value which is not an object after the callback returns `-1` (the callback's error is still thrown when it throws). So a helper which stops an iteration early (eg. `iterSome`, `iterEvery`, `iterTake`, `getValueByIter`, `setValueByIter` and `readArgs`) now throws a `TypeError` for an iterator whose `return()` doesn't return an object (eg. `return() {}`)
  - **Behaviour change:** like `for...of`, closing an iterator whose `return` is a falsy value which isn't `null` or `undefined` (eg. `0`, `false` or `""`) throws a `TypeError`, previously it was ignored. This also applies to the iterator helpers, eg. the `return()` of `iterMap`, `iterFilter` and `iterTake`, and `iterTake` reaching its count
  - Like `for...of` the iterator's `next` is read once, when the iteration starts (previously it was read again for each value), as it is by `iterToArray`, `iterMap`, `iterFilter`, `iterTake`, `iterSome`, `iterEvery`, `iterReduce`, `readArgs`, `polyArrFrom` and `polyObjFromEntries`, and the `next` of an iterator which isn't iterable is only read once by the `iter*` helpers (it was also read to identify it), like the native `GetIteratorDirect`. The callback is called with the intrinsic `Function.prototype.call` (not its own `call` property or a replaced `Function.prototype.call`)
  - On a runtime without `Symbol.iterator` (eg. IE), where an array isn't iterable, an array is now processed by its indexes (like the native array iterator its values are read as they are iterated), previously nothing was processed, so eg. `setValueByIter(target, ["a", "b"], 1)` set nothing, `getValueByIter({ a: 1 }, ["a"], "def")` returned the target (`{ a: 1 }`) rather than `1`, `iterUnion([1, 2], [2, 3])` returned `[]` and `iterDifference([1, 2, 3], [2])` didn't exclude the `2`. Unlike `for...of` (which throws a `TypeError`) this is also done on a runtime with `Symbol.iterator`, eg. for an array whose own `[Symbol.iterator]` is `null` or `undefined`, while the polyfills follow the native functions there (`polyArrFrom` reads it as an array-like and `polyObjFromEntries` throws a `TypeError`)
  - This also applies to the helpers which use it, eg. `arrFrom`, `arrToMap`, `objFromEntries`, `iterToArray`, `iterUnion`, `iterIntersection`, `iterDifference`, `getValueByIter` and `setValueByIter`
  - **Behaviour change:** `iterMap`, `iterFilter`, `iterReduce`, `iterSome`, `iterEvery`, `iterTake` and `iterToArray` now process an iterable value using its iterator like `for...of`, even when it is also an array-like or has a `next()` function. So on a runtime which supports `Symbol.iterator` a string is processed by its code points (previously by its UTF-16 code units, eg. `iterToArray("a\uD83D\uDE00b")` returned 4 values rather than 3) and the values of an array (or another iterable array-like, eg. `arguments` or a `NodeList`) are read as they are iterated (previously from a copy, so like `for...of` a callback which adds values to the array also processes them, and one which removes values, eg. from a live `HTMLCollection`, skips values)
  - Only an array-like which isn't iterable (eg. `{ length: 2, 0: "a", 1: "b" }`, or `arguments` on a runtime without `Symbol.iterator`) is processed using its indexes, which (like the native array iterator) are read as they are iterated (previously from a copy of the array-like), and (like the native functions) its length is converted to an integer, so a fraction is truncated and a length which is longer than an array can be throws a `RangeError`
  - On a runtime without `Symbol.iterator` (eg. IE) `iterForOf` and these helpers process a string (or a `String` object) by its code points (like the `String` iterator), as `arrFrom` / `polyArrFrom` already did, previously `iterForOf` processed nothing and the helpers used its UTF-16 code units
  - Like `iterForOf` they (and `readArgs`, for a value without a `length`) throw a `TypeError` when `[Symbol.iterator]()` doesn't return an iterator (`iterMap`, `iterFilter` and `iterTake` when they are created for a result which isn't an object, like `Iterator.from()`, and from their first `next()` for an object without a `next()` function), previously `iterToArray` returned `[]`, `iterSome` `false`, `iterEvery` `true` and `iterReduce` the initial value
  - **Behaviour change:** like `Array.from()` (and `iterForOf` and `polyArrFrom`) they throw a `TypeError` for a `[Symbol.iterator]` which isn't `null`, `undefined` or a function, including a falsy one (eg. `0`, `false` or `""`), as do `iterIntersection`, `iterDifference`, `readArgs` (for a value without a `length`) and `polyObjFromEntries` (and `iterMap`, `iterFilter` and `iterTake` when they are created, like `Iterator.from()`). Previously it was ignored, so the value was used as an iterator (its `next()`) or an array-like (its indexes), eg. `iterToArray({ length: 1, 0: "a", [Symbol.iterator]: 5 })` returned `["a"]` and `readArgs` returned `[]` for a falsy one. A `null` or `undefined` `[Symbol.iterator]` is still ignored (an array-like is processed using its indexes)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `iterMap`, `iterFilter` and `iterTake` now use the source iterator like the native iterator helpers (`Iterator.prototype.map` etc). **Behaviour change:** a `next()` result which is not an object throws a `TypeError`, previously `iterMap` returned endless values (the result of the callback for `undefined`), `iterFilter` looped forever (or returned endless values) and `iterTake` returned `undefined` values. The source is closed (by calling its `return()`) when the callback throws, and the source's `return()` is called with no arguments (previously it was passed the value given to `return(value)`) and must return an object (a `TypeError` is thrown when it doesn't)
  - They are done once the source's `next()` (or the callback) throws, previously the next call asked the source for another value, and their `return()` only closes the source when they aren't already done, previously (for `iterMap` and `iterFilter`) an exhausted (or already closed) source was closed again (which, as `return()` must now return an object, would throw for a source whose `return()` doesn't return one, eg. from a `finally { it.return() }`)
  - **Behaviour change:** calling their `next()` or `return()` from the callback throws a `TypeError` (like the native helpers), previously `next()` processed the next value
  - `iterFilter` reads each value of the source once (it was read twice)
  - Their `return()` result's value is `undefined` (like the native helpers, it was the value passed to it), `iterMap`, `iterFilter`, `iterEvery`, `iterSome` and `iterReduce` throw a `TypeError` for a `callbackfn` which isn't a function once the value's iterator is resolved, before any value is read, and (like the native helpers, eg. `Iterator.from(value).map(fn)`) close the source first, previously from the first `next()` or after reading a value, and `iterTake` converts its count once (like the native `take()`)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `setValueByIter` (and so `setValueByKey`) now uses each key like a property access (see Security Issue)
  - **Behaviour change:** a number (or other non-string) key is now also used like a property access, eg. `setValueByIter(target, [0, 1], "x")` sets `target[0][1]` and `setValueByIter(target, ["a", null], 1)` sets `target.a["null"]`, and a symbol is also used as the last key, eg. `setValueByIter(target, ["a", sym], 1)` sets `target.a[sym]` (previously nothing was set, and the `a` object added for the path was removed again)
  - **Behaviour change:** a key which is (or converts to) an empty string is now used like a property access, eg. `setValueByIter(target, ["a", "", "b"], 1)` sets `target.a[""].b` (previously the empty key was skipped, so it set `target.a.b`), as `setValueByKey` already did for an empty part of its path (eg. `"a..b"`)
- [#647](https://github.com/nevware21/ts-utils/pull/647) The results of the iterators created by `createIterator` / `createIterableIterator` (and so the iterator helpers) now keep the value they were returned with (like the native iterators), previously the `value` was a getter of the iterator's current value, so an earlier result returned a later value, eg. `r1 = it.next(); it.next(); r1.value`
  - Each result's `value` is an own property (as is the state of the library's own iterators), so an `Object.prototype` `value` or `v` accessor or read-only property no longer intercepts the values (v0.16.0 threw `Invalid property descriptor` for an `Object.prototype.value`, and `iterMap`, `iterFilter` and `iterTake` returned the accessor's value for an `Object.prototype.v`)
  - A done result has its own `undefined` `value`, like the native iterators (it had no `value` property, so an `Object.prototype.value` was returned for it)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `dumpObj` no longer recurses until the stack overflows for a value which throws itself (eg. from its `toJSON`), the error from converting a value is only dumped once, and an `Error` whose `stack`, `message` or `name` getter throws, or a value whose `Object.prototype.toString` throws (eg. a revoked `Proxy`, or a throwing `Symbol.toStringTag` getter, which is then dumped without a type, eg. `":  - [object Error]: ..."`), no longer escapes it. Previously `dumpObj` threw a `RangeError` (a stack overflow) for a value which throws itself, and the error of the getter (or of `Object.prototype.toString`) for the others, as did a function whose error message includes the value (which now throws its own error)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `strTruncate` no longer splits a surrogate pair (eg. an emoji) of the value or the suffix, so the result can be one shorter, previously the high surrogate of a pair could be the last character (which isn't valid text)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `readArgs` with an iterable now returns the same values as `arrSlice`, previously a positive `start` was applied twice when the `end` was negative, eg. for a generator of `1` to `5`, `readArgs(gen(), 1, -1)` returned `[3, 4]` (now `[2, 3, 4]`) and `readArgs(gen(), 2, -1)` returned `[]` (now `[3, 4]`), and a fractional or `NaN` `start` or `end` wasn't converted to an integer like `arrSlice` does, eg. `readArgs(gen(), 1.5)` returned `[3, 4, 5]` (now `[2, 3, 4, 5]`), `readArgs(gen(), 0, 2.5)` returned `[1, 2, 3]` (now `[1, 2]`) and `readArgs(gen(), NaN)` returned `[]` (now `[1, 2, 3, 4, 5]`). On a runtime without `Symbol` it now also reads an iterable which uses the polyfill `Symbol.iterator` (eg. one created by `createIterableIterator`), previously it was used as an array-like (so `[]` was returned). Like `Array.from()` each value of an iterable is added to the result as an own property, so an `Array.prototype` index setter or read-only index no longer leaves a hole in the result or throws
  - **Behaviour change:** a value with a `length` is read like `Array.prototype.slice.call()` (with the intrinsic `call`), so a new array is always returned, eg. `readArgs("hello", 1)` is `["e", "l", "l", "o"]` (was `"ello"`), and a typed array or an object with its own `slice()` also returns an array
  - The `start` and `end` for an iterable are converted to numbers once, before the iterator is created, so the `valueOf()` of an object `start` or `end` is called once (v0.16.0 called it for every value). Unlike `Array.from(x).slice()` (which reads every value before converting them) an error from converting the `start` or `end` is thrown before the iterator is created, and it stops reading an iterable once it has read the values up to the `end` (and closes it)
- `arrAppend` reads every value of an iterator or iterable before appending them (like spread), so an error from the iterator leaves the target unchanged, and appending an iterator of the target (eg. `arrAppend(arr, arr.values())`) no longer loops forever. The values of an array, iterator or iterable are appended with one `push()` call (like `target.push(...values)`, an iterator's values were pushed one at a time), and when there are more of them than `apply()` accepts as arguments (eg. ~125,000 in V8) each value is pushed, so a large array is appended rather than throwing a `RangeError` (also in v0.16.0)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `arrForEach` now converts the length of an array-like object like the native `forEach()`, to an integer from 0 to 2^53 - 1 (so a `NaN` or negative length is 0 and a fraction is truncated). It used `>>> 0`, so a negative length or one of 2^32 or more wrapped around, eg. `{ length: -1 }` looped ~4.3 billion times (effectively forever) rather than not at all, `{ length: -4294967295, 0: "a" }` visited `"a"`, and `{ length: 4294967297, ... }` only visited the first value. This also applies to the helpers which use it, eg. `arrChunk`, `arrFlatten`, `arrGroupBy`, `arrPartition`, `arrUnzip`, `strStartsWithAny` and `strEndsWithAny`
- [#647](https://github.com/nevware21/ts-utils/pull/647) `arrRotate`, `arrSample`, `arrZip` and `arrUnzip` now truncate a fractional length of an array-like object (like the native functions), eg. `arrRotate({ length: 2.5, 0: "a", 1: "b", 2: "c" }, 3)` returned `["a", "b"]` (now `["b", "a"]`), `arrSample` could return the value at the index after the length, and `arrZip` / `arrUnzip` added an extra group. `arrZip` also returns an empty array when the result would be longer than an array can be (2^32 - 1), rather than adding groups until the runtime runs out of memory (previously only when every array had an `Infinity` length)
- [#646](https://github.com/nevware21/ts-utils/pull/646) The polyfills bundle (`ts-polyfills-utils.js`) now installs working `Object` and `Array` static functions. Each static polyfill (`Object.keys`, `Object.entries`, `Object.values`, `Object.fromEntries`, `Object.is`, `Object.hasOwn`, `Object.isExtensible`, `Object.isFrozen`, `Object.isSealed`, `Object.getOwnPropertyDescriptors`, `Object.preventExtensions`, `Array.isArray` and `Array.from`) was passed the `Object` / `Array` class as its first argument, so on a runtime without the native function `Object.entries({ a: 1 })` returned the entries of the `Object` class, `Object.is(NaN, NaN)` returned `false` and `Array.from([1, 2])` returned `[]`. The prototype polyfills (eg. `Array.prototype.includes`) were not affected
  - The `Object.getOwnPropertyNames` and `Object.getOwnPropertySymbols` polyfills were installed as `Object.GET_OWN_PROPERTY_NAMES` and `Object.GET_OWN_PROPERTY_SYMBOLS` on every runtime (so neither function was actually polyfilled), these are no longer added. `getOwnPropertyNames` is now installed using its correct name when the native function doesn't exist, while `getOwnPropertySymbols` is still not installed: it is only missing on a runtime without `Symbol`, where a polyfill symbol key is a string key which `Object.keys()` already returns, so code which combines the two (eg. `forEachOwnKey` or an object rest helper) would process the key twice
  - The polyfills are now installed like the native functions (writable and configurable but not enumerable), previously they were enumerable so, eg. on IE, `for (var key in [1, 2])` also returned `at`, `fill`, `includes`, `find` etc, and `for...in` over a `String` object returned the string polyfills
- [#647](https://github.com/nevware21/ts-utils/pull/647) The minified polyfills bundle (`ts-polyfills-utils.min.js`) installed `String.prototype.startsWith` and `endsWith` polyfills which threw a `TypeError` for every string, eg. on IE `"abc".startsWith("a")` threw `'[object String]: "abc"' is not a string` (the non-minified bundle was not affected)
  - The minifier removed the `"use strict"` directive from every minified (`.min.js`) bundle, so they ran in sloppy mode, where a polyfill installed on `String.prototype` is called with a `String` object (rather than the string) as `this`. The directive is now kept, and the `startsWith` and `endsWith` polyfills now also accept a `String` object (see below), which is also `this` for a call on a `String` object (eg. `new String("abc").startsWith("a")`) in strict mode
  - The minified UMD bundles (`bundle/es5/umd/ts-utils.min.js` and `bundle/es6/umd/ts-utils.min.js`) also added two unexpected global variables (eg. `n` and `r`) when loaded by a `<script>` tag, as the minifier moved the names of the UMD wrapper to the top level of the script, they now only add the `nevware21` namespace and (like every bundle) the `__tsUtils$gblCfg` global config
- [#647](https://github.com/nevware21/ts-utils/pull/647) An import of the polyfills bundle (eg. `import "@nevware21/ts-utils/bundle/es5/ts-polyfills-utils.js"`) is no longer removed by a bundler, the package was marked as having no side effects (`"sideEffects": false`) so bundlers such as webpack and esbuild removed the import and no polyfills were installed. The polyfills bundles are now listed as having side effects, the rest of the package is still tree-shaken
  - The polyfills bundles are now UMD bundles without the AMD part, so they are loaded as CommonJS or add a global (they were an IIFE which assigned its namespace to the top-level `this`), as a bundler which treats the bundle as a module (eg. Rollup without its CommonJS plugin) replaces the top-level `this` with `undefined`, so now that the import is kept the application threw `Cannot read properties of undefined (reading 'nevware21')` when it was loaded. As they never register an AMD module, a script tag still installs the polyfills on a page with an AMD loader (eg. RequireJS or almond)
  - Their exports (`polyArrAt`, `polyArrFill`, `polyArrFlatMap`, `polyArrWith` and `polyStrReplaceAll`) are now added to an existing `nevware21["ts-utils"]` namespace rather than replacing it, previously loading the polyfills bundle after the main bundle (eg. both with a script tag) removed the main bundle's functions from the namespace, while (as in v0.16.0) loading the main bundle after the polyfills bundle still replaces the namespace
  - **Behaviour change:** `require()` of a polyfills bundle (CommonJS) now returns its exports, previously it returned an object with a `nevware21` property which contained them
- [#647](https://github.com/nevware21/ts-utils/pull/647) The `#__NO_SIDE_EFFECTS__` annotation of `arrIntersection`, `arrUnion`, `objPick` and `objOmit` was only on their overload signatures, which TypeScript doesn't emit, so a bundler could not remove a call whose result is unused. The annotation is now on their implementation. The annotation was also removed from `polyArrFill`, as it changes the array it is passed
- [#646](https://github.com/nevware21/ts-utils/pull/646) The following polyfills now match the native functions, which only affects runtimes without the native function (eg. IE) or a direct call of an exported `poly` function
  - [#644](https://github.com/nevware21/ts-utils/issues/644) `arrFrom` / `polyArrFrom` (`Array.from`) now support an array-like value which is not iterable, previously an empty array was returned, eg. `arrFrom({ length: 2, 0: "a", 1: "b" })`, `arrFrom(arguments)` and `arrFrom(nodeList)` and, on a runtime without `Symbol.iterator`, `arrFrom("Hello")` all returned `[]`
    - A string is split into its code points (so a surrogate pair is a single value) on every runtime, including a `String` object on a runtime without `Symbol.iterator` (previously `[]`), which like the `String` iterator is converted with its own `toString()`, an empty slot (or missing index) is `undefined`, and the length is converted like the native function (a fractional length is truncated and a negative length is 0)
    - A length which is longer than an array can be (2^32 - 1) throws a `RangeError`, previously values were added until the runtime ran out of memory, eg. `arrFrom({ length: Infinity })`
    - **Behaviour change:** an array's length is read for each index (like the native array iterator), so a value which the `mapFn` adds to the array is included and removing values stops at the new length, eg. for `a = [1, 2, 3, 4]`, `polyArrFrom(a, (v) => (a.pop(), v))` is `[1, 2]` (was `[1, 2, 3, 4]`, as the array was copied first), while (like the native function) the length of an array-like value is only read once
    - The `mapFn` is only passed the value and index, previously the array was also passed for an array value
    - A `null` or `undefined` value, or a `mapFn` which is not a function, throws a `TypeError` (previously `[]` was returned for a `null` or `undefined` value, and a falsy `mapFn` such as `null` or `0` was ignored). **Behaviour change:** like the native function an iterator which is not iterable (no `[Symbol.iterator]`, eg. one created by `createIterator` or `createRangeIterator`) returns `[]`, previously it was iterated, eg. on IE `arrFrom(createRangeIterator(1, 3))` returned `[1, 2, 3]`, so use `iterToArray` to read an iterator
    - The iterator function (`[Symbol.iterator]`) is only read once, and one which isn't `null`, `undefined` or a function throws a `TypeError`, as does one which doesn't return an iterator (previously `[]` was returned), the `mapFn` is called without using its own (replaceable) `call` property, and each value is added as an own property, so a setter or read-only index on `Array.prototype` doesn't stop it being added (found by the tests of [#645](https://github.com/nevware21/ts-utils/pull/645))
    - It uses every value's iterator, including an array's own (or a replaced `Array.prototype`) iterator and a string's, and only reads an array or a string by its indexes (emulating its iterator) on a runtime without `Symbol.iterator`. Like the native function any other value is converted to an object (ToObject) before its length and indexes are read, so a getter of eg. `Number.prototype` is called with the `Number` object
    - Like `Array.from()` a constructor `this` (eg. `MyArray.from(x)` where it is installed as `Array.from`) creates the result, with `new C()` for an iterable and `new C(length)` for an array-like, defines each value and sets its `length`, while a `this` which isn't a constructor (identified with `isConstructor`, see Features) creates an `Array`
  - `arrIncludes` / `arrContains` / `polyArrIncludes` (`Array.prototype.includes`) now find `NaN` (SameValueZero), and an empty slot of a sparse array (or a missing index of an array-like value) matches `undefined`, eg. `arrIncludes([1, NaN], NaN)` returned `false` (now `true`). This also fixes `NaN` handling on those runtimes for `arrIntersection`, `arrDifference`, `iterUnion`, `iterIntersection` and `iterDifference`
    - **Behaviour change:** a string value is compared by its characters (like the native `Array.prototype.includes.call("abc", "bc")`), so on a runtime without either the native `String.prototype.includes` or `Array.prototype.includes` (eg. IE without the polyfills bundle), `arrIncludes("abc", "bc")` is now `false` (it was `true`). Where the native `String.prototype.includes` exists `arrIncludes` uses it for a string, so it still returns `true`
  - `strPadStart` / `strPadEnd` (`String.prototype.padStart` / `padEnd`) no longer throw a `RangeError` for an empty `padString`, the value is returned as-is. A `null` `padString` is now converted into a string (`"null"`), and only `undefined` uses the default `" "` (a `"undefined"` string `padString` was also treated as `undefined`)
  - `strStartsWith` / `strEndsWith` (`String.prototype.startsWith` / `endsWith`, on a runtime without the native functions) now convert the value to a string like the native functions, so a `String` object or a number no longer throws a `TypeError`, eg. with the polyfills bundle on IE `new String("abc").startsWith("a")` threw `'[object String]: "abc"' is not a string` (a `null` or `undefined` value still throws). The `position` / `length` are converted to a number, eg. `strStartsWith("abc", "c", "2.5")` returned `false` (the position was concatenated with the length of the search string, now `true`) and `strEndsWith("abc", "c", NaN)` returned `true` (now `false`), and only an `undefined` `length` is the length of the value (a `"undefined"` string `length` was also treated as `undefined`). They now share the search string conversion of `polyStrIncludes`, so like the native functions (and `strIncludes`) a `RegExp` search string throws a `TypeError` (it was converted to a string, eg. `strStartsWith("/a/", /a/)` returned `true`)
  - `polyStrSubstr` (the `String.prototype.substr` polyfill, `strSubstr` uses the native function which every supported runtime has) now converts the `start` and `length` to integers, eg. `polyStrSubstr("abcdef", 1.5, 2.5)` returned `"bcd"` (now `"bc"`), and only an `undefined` `length` is the rest of the string (a `"undefined"` string `length` was also treated as `undefined`). It also converts the value to a string like the native function, eg. `polyStrSubstr([1, 2], 1, 2)` is `",2"` (v0.16.0 returned `[2]` from the array's own `slice()`)
  - `arrWith` / `polyArrWith` (`Array.prototype.with`) now read every index, so an empty slot of a sparse array (or a missing index) is `undefined` in the new array rather than an empty slot, and a length which is longer than an array can be throws a `RangeError` (after the index is converted, like the native function) rather than adding values until the runtime runs out of memory
  - `polyStrIncludes` (`String.prototype.includes`, and so the polyfills bundle's `String.prototype.includes`) now converts the value to a string like the native function, previously the value's own `indexOf()` was used, eg. `polyStrIncludes(["abc"], "b")` (and `String.prototype.includes.call(["abc"], "b")` with the polyfills bundle) returned `false` (now `true`). The value is now converted before the search string, and a `null` or `undefined` value still throws a `TypeError`, as (like the native function) does a `Symbol` value. `strIncludes` / `strContains` still call the value's own `includes()` when it has one (eg. `Array.prototype.includes` for an array)
  - `objEntries` / `objValues` / `polyObjEntries` (`Object.entries` / `Object.values`) now return the characters of a string (previously `[]`) and throw a `TypeError` for `null` or `undefined` (previously `[]`)
  - `objFromEntries` (`Object.fromEntries`, on a runtime without the native function)
    - **Behaviour change:** a `null`, `undefined` or non-iterable value, or an entry which is not an object (including an empty slot of a sparse array), throws a `TypeError`, previously they were ignored and `{}` was returned
    - Any object entry (not only an array) uses its `0` and `1` properties, so an entry with only a key is added with an `undefined` value (previously it was ignored)
    - Each key is converted once like the native function (ToPropertyKey, so a `Symbol` object, or an object whose `Symbol.toPrimitive` returns a symbol, is a symbol key, otherwise a string) and then added as an own property (a key which the result already has, eg. one inherited from `Object.prototype` or a duplicate, is defined rather than assigned), so an object key which converts to `"__proto__"` is added as an own property rather than changing the prototype of the result, and a setter or read-only property of the same name on `Object.prototype` (eg. when it is frozen) no longer stops the key being added. A string or symbol key is used as-is, and as each key is converted and checked before it is added `polyObjFromEntries` is ~2x slower than v0.16.0 (eg. ~300ns for 10 string keys, was ~150ns)
    - It uses every value's iterator (eg. an array's own, or a string's), reads its `[Symbol.iterator]` once (it was read twice), and on a runtime without `Symbol.iterator` emulates the array and string iterators (so on IE `polyObjFromEntries("")` is `{}`, it threw a `TypeError`)
- [#646](https://github.com/nevware21/ts-utils/pull/646) The `polyObjIsFrozen` and `polyObjIsSealed` polyfills (the polyfills bundle's `Object.isFrozen` and `Object.isSealed`) now report a primitive value, including `null` and `undefined`, as frozen and sealed (like the native functions since ES2015) and every object or function as not (including an object which was passed to `Object.freeze` or `Object.seal`). Both are defined by every supported (ES5) runtime, so the polyfills are only used by a runtime which can't freeze or seal an object, and they reported `true` for an empty (extensible) object such as `{}`, which is neither
  - `objIsFrozen` and `objIsSealed` use these polyfills where there is no native function, previously they reported `false` for every value (including a primitive)
  - Likewise `objIsExtensible` uses `polyObjIsExtensible` (the polyfills bundle's `Object.isExtensible`) where there is no native function, so an object or function is extensible and a primitive is not, previously it reported `false` for every value (including an object)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `scheduleTimeout`, `scheduleTimeoutWith`, `createTimeout` and `createTimeoutWith` (and the `scheduleIdleCallback` fallback) now support a `setTimeout` override (eg. set with `setTimeoutOverrides`) which calls the callback synchronously. Previously `scheduleTimeout`, `scheduleTimeoutWith` and the `scheduleIdleCallback` fallback threw an error (a `TypeError`, or a `ReferenceError` in the ES6 modules) before the callback was called, so it never ran, as the timer was started before its handler was created. Like `scheduleMicrotask` / `scheduleNextTick` (see #642) the handler is also not `enabled` once the callback has run synchronously, previously `enabled` was `true` (for `createTimeout` / `createTimeoutWith`, which didn't throw)
  - Likewise `scheduleIdleCallback` now supports a `requestIdleCallback` which calls the callback synchronously (eg. a test shim), previously it threw the same error before the callback was called
  - A callback which calls `refresh()` on its own handler while it is run synchronously now keeps the timer that `refresh()` started (so the handler is `enabled` and `cancel()` stops it), previously the handler kept the id returned for the first call, so the new timer couldn't be cancelled
  - A `refresh()` of a timeout made by a microtask which is run (by the fallback microtask queue, eg. with `useTimeout`) just before the timeout's callback is now kept, previously the new timer wasn't tracked by the handler (so it wasn't `enabled` and `cancel()` didn't stop it) and the callback was called again. As before such a microtask sees the timeout as `enabled` (so `enabled = true` doesn't start it again)
  - **Behaviour change:** a microtask run by the fallback microtask queue just before a timeout's callback which leaves that timeout cancelled (eg. with `cancel()`, `enabled = false`, or `refresh()` and then `cancel()`) now stops the callback, like a native microtask (which runs before the timer), previously the callback was still called. A microtask which refreshes (or restarts) the timeout and leaves it running still lets the callback run and keeps the new timer, and a callback which the timeout's own `refresh()` runs synchronously (eg. by a `setTimeout` override) is still called
  - **Behaviour change:** the fallback microtask queue (used with `useTimeout` or without `Promise`) is now also run just before the callback of a `scheduleInterval`, so like a timeout a microtask which was scheduled after an interval which is already due runs first, and one which cancels the interval stops that call, previously the interval's callback ran first. Only the timeouts and intervals created by ts-utils run the queue, so a native `setTimeout()` / `setInterval()` callback can still run before a microtask which was scheduled after it (the `Promise` fallback doesn't have this limitation)
- [#647](https://github.com/nevware21/ts-utils/pull/647) The `scheduleNextTick` fallback queue (used when there is no `process.nextTick`, eg. in browsers) now only counts the pending callbacks against its `maxQueuedTasks` limit (default 1000), previously the callbacks which had already run in the current flush were also counted, so a callback which scheduled another one (eg. a recursive chain) threw a `RangeError` after 999 callbacks. A cancelled callback is still counted until the queue is next run
- [#647](https://github.com/nevware21/ts-utils/pull/647) The `objSetPrototypeOf` polyfill (used on a runtime which can't set `__proto__`, eg. IE 9 / 10, where it copies the properties) stopped copying at a property whose value is `-1`, eg. `createCustomError` lost the base class's static properties after one with a value of `-1`
- [#647](https://github.com/nevware21/ts-utils/pull/647) **Behaviour change:** `polyArrFind`, `polyArrFindIndex`, `polyArrFindLast` and `polyArrFindLastIndex` (so also `arrFind`, `arrFindIndex`, `arrFindLast` and `arrFindLastIndex` on a runtime without the native function, and the polyfills bundle's `Array.prototype.find` etc.) now call the `callbackFn` with `this` as `undefined` when no `thisArg` is passed, like the native functions, previously `this` was the array. The documentation of these and of `arrEvery`, `arrFilter` and `arrSome` (which use the native function) incorrectly said that `this` defaults to the array
- [#647](https://github.com/nevware21/ts-utils/pull/647) `createCustomError` instances on a runtime which can't set the prototype of an existing object (IE 9 / 10, which have no `Object.setPrototypeOf` or `__proto__`) now have the class's `name`, previously their `name` was `"Error"` (so `toString()` returned `"Error: message"`, also for `throwUnsupported`), as the native `Error` returns a new object which only has the own enumerable properties of the class's prototype copied to it. On these runtimes an instance is still not an `instanceof` the class (it is an `instanceof Error`), which is now documented
- [#647](https://github.com/nevware21/ts-utils/pull/647) On a runtime whose `Map` and `Set` have no iterator functions (IE 11, which has no `Symbol.iterator`) a `Map`'s `[key, value]` entries and a `Set`'s values are now processed using its `forEach()` by `arrFrom` / `polyArrFrom`, `objFromEntries` / `polyObjFromEntries`, `iterForOf`, `iterToArray` and `readArgs` (and the helpers that use them, eg. `arrToMap`, `iterMap`, `iterFilter`, `iterUnion` and `setValueByIter`), previously `arrFrom`, `iterToArray` and `readArgs` returned an empty array, `iterForOf` did nothing and `objFromEntries` returned an empty object. The entries / values (other than for `polyArrFrom` and `polyObjFromEntries`, see below) are copied when the processing starts (eg. when `iterMap` is called, rather than when its first value is read), so a value which is added while it is processed is not included. Each entry / value is added to the copy as an own property (like `Array.from()`), so an `Array.prototype` index setter or read-only index doesn't change the values which are processed
  - `polyArrFrom` and `polyObjFromEntries` read a `Map` or `Set` live, each entry / value is added as its `forEach()` reads it (like the native iterators, so a `mapFn` or key conversion which adds or deletes a value changes what is read), and a value is identified as a `Map` or `Set` before its `forEach` is read, so (like the native functions) the own `forEach` of an array-like (eg. a getter) isn't read
  - The polyfills (`polyArrFrom` and `polyObjFromEntries`) only do this on a runtime without a native `Symbol.iterator`, like the native functions, so elsewhere a `Map` or `Set` whose own `[Symbol.iterator]` is `null` or `undefined` isn't iterable (`polyArrFrom` returns `[]` and `polyObjFromEntries` throws a `TypeError`), while `iterForOf`, the `iter*` helpers and `readArgs` process its entries / values on every runtime (unlike `for...of`, which throws a `TypeError`)
- The library loads again on a runtime without the native `Function.prototype.bind` (eg. IE 8 without a shim), as `fnCall` and `fnApply` were created with `bind` when the module was loaded (since #636), which threw. `fnBind` is now resolved once, when the module is loaded: with the native `bind` it is the intrinsic `Function.prototype.bind` bound to `Function.prototype.call` (see Performance Improvements), otherwise it is a polyfill which returns a function that calls `fn` with `thisArg` and the bound arguments followed by its own arguments using the intrinsic `Function.prototype.apply` (unlike a native bound function it can't be called with `new`, and it doesn't have the `name` and `length` of `fn`). `fnCall`, `fnApply` and the internal `propertyIsEnumerable` are created with `fnBind`, so with the native `bind` they are the same bound intrinsics as before
- More of the polyfills (and the helpers which work like a native function) now match the native functions, including the order and number of their observable operations (eg. getters, `valueOf()` / `toString()` calls and `Proxy` traps), which only affects runtimes without the native function (eg. IE) or a direct call of an exported `poly` function
  - **Behaviour change:** every string polyfill (`polyStrStartsWith`, `polyStrEndsWith`, `polyStrIncludes`, `polyStrSubstr`, `polyStrAt`, `polyStrPadStart`, `polyStrPadEnd`, `polyStrTrim`, `polyStrTrimStart`, `polyStrTrimEnd`, `polyStrReplaceAll`, `polyStrMatchAll` and `polyStrRepeat`, and so the polyfills bundle's `String.prototype` functions) converts its value and string arguments like the native ToString, so a `Symbol` throws a `TypeError` (previously it was converted to `"Symbol(...)"`) and an object is converted once using its `Symbol.toPrimitive` or `toString()` / `valueOf()`. The conversion uses the original `String.prototype.concat` (captured when it is loaded), so a replaced one isn't used
  - `polyStrPadStart` and `polyStrPadEnd` convert the value to a string, previously a number or an array was used as-is (eg. with the polyfills bundle `String.prototype.padStart.call(42, 6, "a")` returned `"42"`, now `"aaaa42"`), and convert the `targetLength` like ToLength, so `Infinity` or a length over 2^31 no longer wraps or throws (eg. `polyStrPadStart("abc", Infinity, "")` is `"abc"`, a result which is too long throws a `RangeError` and a `targetLength` of `-2147483649` returns the value). A `null` or `undefined` value throws before the `targetLength` is converted
  - `polyStrRepeat` (and so `strRepeat` without a native `repeat`) converts the value before the count (like ToIntegerOrInfinity, so a `Symbol` or `BigInt` count throws a `TypeError`), like the native function, a negative or infinite count throws a `RangeError` (even for `""`), and a result which is longer than a string can be throws a `RangeError` (the count was truncated to 32 bits, eg. `polyStrRepeat("ab", 2 ** 32 + 1)` returned `"ab"`)
  - **Behaviour change:** `polyStrStartsWith`, `polyStrEndsWith` and `polyStrIncludes` (so also `strStartsWith`, `strEndsWith` and `strIncludes` without the native functions), `polyStrReplaceAll` and `polyStrMatchAll` identify a regular expression like the native IsRegExp. A defined `Symbol.match` is used (for the first three since [#647](https://github.com/nevware21/ts-utils/pull/647)), so a `RegExp` whose `Symbol.match` is falsy is searched for as a string (v0.16.0's `polyStrIncludes` threw) and an object whose `Symbol.match` is truthy is a regular expression (v0.16.0 searched for it), otherwise a `RegExp` is identified by a brand check which doesn't use its `Symbol.toStringTag`. The `TypeError` message of `polyStrStartsWith`, `polyStrEndsWith` and `polyStrIncludes` no longer includes the value
  - `polyStrReplaceAll` and `polyStrMatchAll` check a regular expression's `flags` (rather than its `global`, where `RegExp.prototype` has `flags`), read its `Symbol.replace` / `Symbol.matchAll` once (a value which isn't a function throws a `TypeError`) and call it with the unconverted value, in the native order. On a runtime without `Symbol.matchAll`, `polyStrMatchAll` iterates a copy of a `RegExp` (with its flags and `lastIndex`) like the native `RegExp.prototype[Symbol.matchAll]`, so a non-global one (eg. one whose `Symbol.match` is false) only returns its first match. Where there is a native `Symbol.species` the copy is created by the `RegExp`'s species constructor, its `exec` is called for each match (a result which isn't an object or `null` throws a `TypeError`), whether it is global / unicode is read from its flags (not its properties) and its `lastIndex` is converted like ToLength, and a value which inherits from `RegExp.prototype` (eg. a `Proxy` of a `RegExp` whose `get` forwards to the `RegExp`) is also copied (it was converted to a string, so it returned no matches), although a `Proxy`'s `getPrototypeOf` trap is called where the native function calls its `get` trap for `Symbol.matchAll`. On a runtime without `Symbol` (eg. IE) the method for the polyfill `Symbol.replace` / `Symbol.matchAll` (`getKnownSymbol(WellKnownSymbols.replace)`) is still called (as in v0.16.0), and the key of a global `Symbol` shim (which isn't a native symbol) is used like the polyfill symbol's
  - `polyArrFlatMap` (and `arrFlatMap` without the native function) creates its result like ArraySpeciesCreate where there is a native `Symbol.species`, so a subclass of `Array` returns an instance of the subclass, a constructor or species which isn't a constructor throws a `TypeError`, and a `null` species or another realm's `Array` (identified with `isNativeFn`, see Features) creates an `Array`. It adds each value as an own property (previously with `push()`, so an `Array.prototype` setter for the index was called and a read-only one threw a `TypeError`) and reads the `length` once, before checking the `callbackFn`
  - `polyArrKeys` (and `arrKeys` without the native function) reads the `length` for each `next()` like the native array iterator, so it sees the array grow or shrink (it read the `length` once, when it was created), and the index is read before the `length` and only moves once the `length` has been read (so a `length` getter which calls `next()` doesn't change the key which is returned)
  - The iterator which `iterForOf` and the `iter*` helpers use for an array or array-like which isn't iterable (passed to the `callbackfn`) also reads the index before the `length` (previously when a `length` getter called `next()` the outer `next()` returned the following value), and once it is done it stays done, like the native array iterator (previously a later `next()` returned a value which was added after it was done)
  - `iterToArray` adds each value as an own property like `Array.from()` (previously with `push()`, so an `Array.prototype` setter for the index was called and a read-only one threw a `TypeError`), and `polyArrFrom`, `arrWith`, `polyArrFlatMap`, `readArgs` and `iterToArray` define each value (rather than assign it) when the prototype of `Array.prototype` has been changed (eg. to a `Proxy`, which the native functions don't use), which is checked for each value (so also when a `mapFn`, `callbackFn` or getter changes it), and they (like the other polyfills which add values) work without `Object.getPrototypeOf`
  - `polyArrFrom` and `polyObjFromEntries` (and so `arrFrom` and `objFromEntries` without the native functions) no longer read the value for their `TypeError` (like the native functions, eg. a `Proxy`'s traps or its `toJSON()` aren't called), the message only includes its type, eg. `object is not a function` (was `[object Object]: {} is not a function`)
  - `polyObjGetOwnPropertyDescriptors` (and `objGetOwnPropertyDescriptors` without the native function) converts the value to an object, reads its own keys once (with `Reflect.ownKeys()` where it exists), adds an own `__proto__` key (without changing the prototype of the result) and a key which has an `Object.prototype` setter, and no longer returns `{}` for a call made while it is running (eg. from a `Proxy` trap). Since [#647](https://github.com/nevware21/ts-utils/pull/647) it also uses the native `Object.getOwnPropertySymbols()` where there is one, so on a runtime with `Symbol` but without `Object.getOwnPropertyDescriptors()` (eg. Chrome before 54, Firefox before 50, Safari before 10 and Edge before 15) the descriptor of every symbol key is returned, previously (as in v0.16.0) only the well-known symbols were found
  - **Behaviour change:** like ES2015+ `polyObjKeys` returns the keys of a primitive or a function (only `null` and `undefined` throw a `TypeError`), and `polyObjPreventExtensions` returns any value as-is (including `null`, `undefined` and primitives). `polyObjHasOwn` works for a primitive on an ES5 runtime (eg. `polyObjHasOwn("", "length")` is `true`) and converts the key once, and `polyObjKeys`, `polyObjEntries` and `polyObjValues` read the own keys once and check each key's enumerability as it is reached, so a key which a getter made non-enumerable is skipped (and a `Proxy`'s traps are called like the native functions)
  - The `Symbol` polyfill: `polyNewSymbol()` has an `undefined` description and its string is `"Symbol()"` (was an `"undefined"` description and `"Symbol(undefined)"`), and an object description is converted once with its `toString()` (its `valueOf()` was used for the symbol's string), `polySymbolFor` converts the key once and supports `Object.prototype` names (eg. `"__proto__"`, which broke the shared registry), `polySymbolKeyFor` throws a `TypeError` for every value which isn't a symbol without converting it (a string, or an object whose `toString()` started with `"Symbol"`, returned `undefined`), so its message only includes the value's type (eg. `string is not a symbol`, previously `abc is not a symbol`, and a value which can't be converted to a string threw while the message was created), and `polyGetKnownSymbol` ignores inherited names (eg. `"toString"`)
  - The polyfills bundle installs each polyfill with the native function's `name` and `length` (where they can be changed, ES2015+), an alias (`trimLeft` / `trimRight`) is the same function (eg. `String.prototype.trimLeft === String.prototype.trimStart`, or the runtime's native function when it only has the other name) while other polyfills which share a function are installed as different functions (eg. `Object.isFrozen` and `Object.isSealed`), a prototype polyfill is passed the instance and its arguments directly (v0.16.0 copied them into a new array, so an `Array.prototype` index setter intercepted the arguments) and the static polyfills (eg. `Object.keys` and `Array.from`) are installed as wrapper functions (so an installed `Object.keys` isn't `polyObjKeys`)
  - These can't be emulated on an ES5 runtime: the installed polyfills are constructors with a `prototype` (an ES5 function can't be created without them, and identifying a call with `new` would read the prototype of the instance), `polyIsArray` uses `Object.prototype.toString()` (so a `Symbol.toStringTag` changes its result, every supported runtime has `Array.isArray`), `polyObjIsExtensible`, `polyObjIsFrozen`, `polyObjIsSealed` and `polyObjPreventExtensions` can't detect or change whether an object is extensible (every supported runtime has the native functions, so the polyfills bundle never installs them), and without a native `Symbol.species` (eg. IE) `polyStrMatchAll` doesn't create the copy of a `RegExp` with its species constructor
- `strSymSplit` uses the `polyStrSymSplit` polyfill again on a runtime without a native `Symbol.split` (eg. IE), so (as documented) the splitter's method for the polyfill `Symbol.split` (from `getKnownSymbol(WellKnownSymbols.split)`) is called. Since v0.10.3 ([#231](https://github.com/nevware21/ts-utils/pull/231)) the polyfill was only used when there is no `String.prototype.split` (which every runtime has), so it never ran and the splitter was converted to a string. The runtime is checked when it is called (not when it is loaded), so it is still tree-shaken ([#428](https://github.com/nevware21/ts-utils/issues/428))
  - **Behaviour change:** `polyStrSymSplit` works like the native `split`: a `null` or `undefined` value throws a `TypeError` (before the splitter is read), the splitter's `[Symbol.split]` is read once and called with the splitter as `this` (it was called without a `this`), only a `null` or `undefined` one is ignored (any other value which isn't a function, including a falsy one like `0`, throws a `TypeError`), and a splitter without one is converted to a string (a `RegExp` is used as the pattern) like the native `split`, eg. `polyStrSymSplit("a,b", ",")` is `["a", "b"]` (it returned `["a,b"]`). Where there is a native `Symbol.split` it calls the runtime `split` (so the splitter's `[Symbol.split]` is only read once), as it does on a runtime with `Symbol` but without `Symbol.split` (eg. Edge 12-18, where `getKnownSymbol(WellKnownSymbols.split)` returns `undefined`)
  - **Behaviour change:** `strSymSplit` no longer calls a non-string value's own `split` method, it calls `String.prototype.split` (like the polyfill)
- **Behaviour change:** `mathToInt` converts `-0` and a value between -1 and 0 to `0` (like ToIntegerOrInfinity), previously `-0`

### Performance Improvements

- [#636](https://github.com/nevware21/ts-utils/pull/636) Case helpers (`strCamelCase`, `strKebabCase`, `strSnakeCase`, `strLetterCase`, `strCapitalizeWords`) now detect and convert every word in a single `strReplace()` regular expression pass, with no `strTrim()` or whole result `strLower()` / `strUpper()` passes, intermediate word arrays or per-character iteration, and call the native case conversion on each word directly (via minifiable method name constants). Compared to v0.16.0 for short identifiers / a 100KB string: `strCamelCase` ~2.4x / up to ~1.8x, `strKebabCase` ~1.3x / up to ~1.4x, `strSnakeCase` ~1.6x / up to ~1.3x, `strLetterCase` ~1.8x / up to ~2.2x and `strCapitalizeWords` ~2.1x / up to ~2.1x faster (a long string is less faster when it has many runs of uppercase letters, eg. `strSnakeCase` ~1.1x)
- [#636](https://github.com/nevware21/ts-utils/pull/636) `strUpper()`, `strLower()`, `strSubstring()`, `strIndexOf()`, `strReplace()`, `strPadStart()`, `strTrim()`, `arrIndexOf()`, `arrMap()` and the other helpers that wrap a native prototype function (`_unwrapFunctionWithPoly()`) now forward their arguments with the intrinsic `Function.prototype.call` (`FuncCall.apply(theFunc, arguments)`) rather than slicing them into a new array on every call, making each call ~23-51% faster. As the intrinsic is used they also no longer depend on the native function's own `call` / `apply` properties
- [#647](https://github.com/nevware21/ts-utils/pull/647) The helpers that wrap a native prototype function no longer include their own `"..." not defined for ...` `TypeError` message (which also included `dumpObj()`), as every wrapped function exists on a supported runtime or has a polyfill, they now always call the function (so if there is neither the runtime throws its own `TypeError`). This makes a bundle which only uses one of them much smaller, eg. `strIndexOf()`, `strUpper()` or `arrMap()` on its own is ~320 bytes minified (~770 in v0.16.0)
  - The wrapper function also has no named parameters (the value is read from its `arguments`), as in non-strict code (eg. a consumer's bundle created by esbuild, which doesn't add `"use strict"`) a named parameter makes passing the `arguments` object to `apply()` ~3x slower than v0.16.0 (which sliced the arguments). They are now faster than v0.16.0 in both strict and non-strict code, eg. in a non-strict bundle `strIndexOf()` ~16ns (v0.16.0 ~50ns) and `arrSlice()` ~38ns (~71ns). **Behaviour change:** their `length` is now `0` (was `1`)
- [#636](https://github.com/nevware21/ts-utils/pull/636) `fnCall()` is now an alias of the intrinsic `Function.prototype.call` bound to itself (`FuncCall.bind(FuncCall)`, so `fnCall(fn, thisArg, ...args)` is `fn.call(thisArg, ...args)`) rather than a wrapper function that sliced the arguments into a new array and called `fn.apply()`. This is ~1.8x (polymorphic call sites) to ~30x (monomorphic) faster per call in V8 micro-benchmarks and smaller, which also benefits the helpers that call it per item (eg. `arrDropWhile()`, `arrFlatMap()` and the iterator helpers). It also no longer depends on the function's own (overridable) `call` / `apply` properties, and as it's now a bound function `fnCall.name` is `"bound call"` and `fnCall.length` is `1`
- [#636](https://github.com/nevware21/ts-utils/pull/636) `fnApply()` is now an alias of the intrinsic `Function.prototype.call` bound to the intrinsic `Function.prototype.apply` (`FuncCall.bind(FuncApply)`, so `fnApply(fn, thisArg, argArray)` is `fn.apply(thisArg, argArray)`) rather than a wrapper function calling `fn.apply()`, which is smaller with the same or slightly better performance (within ~10% in V8 micro-benchmarks), used by the timer, cache, lazy, `arrAppend()`, `createFnDeferredProxy()` and custom error helpers. It also no longer depends on the function's own (overridable) `call` / `apply` properties, and `fnApply.name` is `"bound call"` and `fnApply.length` is `1`
  - **Behaviour change:** as `fnCall` and `fnApply` are now bound functions their `name` is `"bound call"` and `length` is `1` (were `"fnCall"` / `"fnApply"` and `2` / `3`), and calling them with a value which isn't a function throws a `TypeError` whose message names them, eg. `"fnCall is not a function"` (previously eg. `"Cannot read properties of undefined (reading 'apply')"`)
- [#636](https://github.com/nevware21/ts-utils/pull/636) `fnBind()` is now the intrinsic `Function.prototype.bind` bound to the intrinsic `Function.prototype.call` (`FuncCall.bind(FuncBind)`, so `fnBind(fn, thisArg, ...args)` is `fn.bind(thisArg, ...args)`) rather than a wrapper function that sliced the arguments into a new array and called `fn.bind.apply()`, ~3x faster per call than v0.16.0 (eg. ~18ns, was ~57ns in Node). Its overloads are unchanged, and it no longer depends on the function's own (overridable) `bind` / `call` / `apply` properties
  - **Behaviour change:** like `fnCall` and `fnApply` it is now a bound function, so its `name` is `"bound call"` and its `length` is `1` (were `"fnBind"` and `2`), and in the TypeScript declarations it is a `const` with the overloads as its call signatures (was a function)
- [#639](https://github.com/nevware21/ts-utils/pull/639) `arrSlice()` now uses the same native function wrapper as `arrIndexOf()` / `arrMap()` (`_unwrapFunction("slice", ArrProto)`) rather than slicing its own arguments into a new array before calling `slice`, ~16% faster in a V8 micro-benchmark (and smaller). It still uses the value's own `slice` function when present, otherwise `Array.prototype.slice`. **Behaviour change:** as it's now a `const` its `name` is `""` and `length` is `0` (were `"arrSlice"` and `3`)
- [#639](https://github.com/nevware21/ts-utils/pull/639) `createFnDeferredProxy()`, `objExtend()`, `deepExtend()`, `createCustomError()` (when calling the base class) and the `scheduleTimeout()` / `createTimeout()` callback wrapper now pass their `arguments` object directly rather than slicing it into a new array on every call (`objExtend()` ~29% faster in a V8 micro-benchmark). The arguments are still copied where they are kept or modified after the call returns (the timer `refresh()` arguments)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `objCopyProps`, `objExtend`, `deepExtend` and `objDeepCopy` no longer allocate a deep copy context for primitive values when there is no handler, eg. for an object of primitive values `objCopyProps` and `objExtend` are ~4x faster and `objDeepCopy` and `deepExtend` ~1.3-2x faster
- `objDeepCopy`, `objCopyProps`, `objExtend` and `deepExtend` no longer define the `result` accessor of the handler details with `objDefine()` for every object they copy (it is now an accessor of the details object itself), ~30% faster, eg. copying 200 objects ~1.94ms (was ~2.82ms) and a small object ~6.8µs (was ~9.4µs)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `objDeepCopy` and `objCopyProps` now track visited objects with a `Map` when available (a linear search otherwise), so they no longer slow down quadratically as the number of objects grows, eg. copying 16,000 objects went from ~585ms to ~48ms
- [#642](https://github.com/nevware21/ts-utils/pull/642) `arrUnique` and `arrUnion` now use a `Map` when available for all values rather than building a string key for each primitive, ~3-6x faster for numbers and strings (without a `Map`, eg. IE 9 / 10, primitives use a string key in a dictionary with no prototype, so a value added to `Object.prototype` can't make a value look like it has already been found, and objects, arrays and functions are found with a linear search, about as fast as v0.16.0)
- [#642](https://github.com/nevware21/ts-utils/pull/642) `encodeAsBase64` and `decodeBase64` are ~10x faster in browsers now the native functions are used, as they no longer throw and fall back to the polyfill on every call
- [#642](https://github.com/nevware21/ts-utils/pull/642) `polyArrFind` and `polyArrFindIndex` are faster, as they loop over the array directly rather than using `arrForEach()` with a callback, eg. ~1.5x for a call which is passed one of several callbacks (~33ns for 3 elements, was ~49ns, and ~4.6µs for 1,000 elements, was ~7.5µs), and much more when it is always passed the same callback (which V8 inlines)
- [#647](https://github.com/nevware21/ts-utils/pull/647) `decodeHex` reads each pair of hex digits with the string's own `substring()` rather than the `strSubstr()` wrapper, ~1.6x faster than v0.16.0 (eg. ~3.5µs for 55 characters of text, was ~5.9µs, mostly from the wrapper changes above), and a bundle which only uses it is smaller (~0.8 kb minified, was ~1.2 kb)
- An installed prototype polyfill (the polyfills bundle's `String.prototype` and `Array.prototype` functions, eg. `Array.prototype.includes` on IE) passes the instance and its arguments to the polyfill directly rather than copying them into a new array for every call, ~2x faster (eg. `[1, 2, 3].includes(2)` ~27ns, was ~56ns)
- On a runtime without `Symbol` (eg. IE) the iterator helpers (eg. `isIterable`, `iterForOf`, `readArgs` and `polyArrFrom`) use the string key of the polyfill `Symbol.iterator` rather than the polyfill symbol object, which was converted to its key by every property access (also in v0.16.0), eg. `isIterable` ~10ns, was ~190ns

### Repository Improvements

- [#646](https://github.com/nevware21/ts-utils/pull/646) Add `npm run ts-versions-check` (`lib/test/typescript-versions-check.js`) and run it as a CI step, it compiles the generated typings and a consumer of them (`lib/test/types/consumer.ts`) with each TypeScript version using the `es2015,dom` and `esnext,dom` libs, so the TypeScript v3.4 support (or support for a newer release) can't silently break again
  - By default the published versions are read from the npm registry and the latest patch of every major.minor release from v3.4 onwards is checked (currently 28 versions, v3.4.5 to v7.0.2, including the repo's own version), so each new TypeScript release is checked automatically
  - Specific versions can be passed as arguments, as an exact version, the latest release of a major or major.minor, or an npm dist-tag (eg. `npm run ts-versions-check -- 3.4.5 4.9 7 beta`), and `--min` changes the oldest version checked. Each version is installed once into `node_modules/.cache/ts-versions-check`
  - The compiler options are set for each version, as TypeScript v6.0 deprecated (and v7.0 removed) the ES5 target, the node10 module resolution and `baseUrl`
  - The number of versions checked is reported (with the minimum version used by `all`), and a warning when no version matches (eg. `all --min 99`)
- [#646](https://github.com/nevware21/ts-utils/pull/646) The bundles are larger than in v0.16.0, as they include the new features and the native parity and hardening fixes above (eg. `es5-full` is now 39.39 kb, `es5-min-full` 42.81 kb, `es5-poly` 12.71 kb and `es5-min-poly` 11.22 kb), the changes below reduce that growth. The `es5-full`, `es5-poly` and other `.size-limit.json` sizes are measured by size-limit in 1000 byte kb, and the `-min-` bundle sizes by `lib/test/bundle-size-check.js` in 1024 byte kb
  - The polyfills are installed by an internal module (`internal/poly_install.ts`) which the polyfills entry calls rather than exports, so the minifier can inline it and the polyfills it uses
  - The `Object.isFrozen` and `Object.isSealed` polyfills are the same function (see Bug Fixes), and the pad helpers (`strPadStart`, `strPadEnd` and their polyfills) double the pad string rather than using `strRepeat`, so the polyfills bundle no longer includes the `repeat` polyfill (which it never installs)
  - `isUnsafeTarget` adds the built-in prototypes from one string of class names rather than a call for each (and is now correct, see Security Issue)
  - The remaining direct `.length` reads and writes use the `LENGTH` constant (`value[LENGTH]`), which the minifier can rename, and the internal `_toLength` / `_toArrayLength` helpers read the length of the value they are passed (rather than each caller reading it), which `polyArrKeys` and `arrIndexKeys` now also use (rather than `mathToInt`)
  - `arrZip`, `arrDifference`, `iterUnion`, `iterIntersection`, `iterDifference` and `objDefaults` read their rest arguments directly rather than copying them into a new array first (the loop TypeScript emits for a rest parameter), as they only read them
  - The timeout helpers resolve the `setTimeout` / `clearTimeout` overrides with one function rather than one for each, and `createFilenameRegex` / `makeGlobRegex` share their escaping regular expression
  - The minified (`.min.js`) bundles are now ASCII only (uglify `ascii_only`), so non-ASCII characters in strings (eg. the `encodeAsHex` / `decodeBase64` UTF-8 marker and `U+FFFD`) are escapes rather than raw UTF-8, which compresses better. The source code (outside of comments) is also ASCII only, so every bundle works when it is loaded by a page that isn't UTF-8
  - The minified bundles keep the `"use strict"` directive (uglify `compress.directives: false`) and their top level names (`toplevel: false`), see Bug Fixes, and the minified ES5 bundles are minified as a script (uglify `module: false`) rather than an ES module, so an astral character can't be written as an ES2015 `\u{...}` escape (a syntax error for an ES5 runtime)
  - Code which was repeated in several modules is now shared, eg. one lazy iterator helper for `iterMap`, `iterFilter` and `iterTake`, one runner for the microtask, `Promise` and timer fallback queues, `safeGet()` for the `safeGetLazy`, `safeGetWritableLazy`, `safeGetDeferred` and `safeGetWritableDeferred` callbacks, one symbol lookup, the own property functions, the surrogate pair length, one relative index conversion for `polyArrFill`, `polyArrIncludes` and `polyStrSubstr`, and `arrIntersection`'s loop for `iterIntersection`, which reduces the growth by ~1.1 kb (eg. `es5-full`). `createArrayIterator` and `createRangeIterator` set the value rather than defining a getter, so a bundle which only uses one of them is ~0.5 kb (was ~1.7 kb, as it included `objDefine`)
  - The integer, length and array length conversions, the reads of the native symbols, the own property definitions and the intrinsic `Function.prototype.toString`, `Object.create` and `Object.getPrototypeOf` are also shared by the polyfills and helpers which use them
  - A bundle which only uses one of these helpers is smaller than in v0.16.0 (esbuild, minified ES2015): `arrFill` ~0.85 kb (~1.2 kb), `arrAt` ~0.77 kb (~1.05 kb), `strTruncate` ~0.9 kb (~1.4 kb, the length is converted without `dumpObj`), `strPadStart` ~1.15 kb (~1.7 kb), `strAt` ~1.1 kb (~1.45 kb) and `strRepeat` ~1.05 kb (~1.35 kb)
  - The size limits (with the v0.16.0 limits in brackets) are now `es5-full` 41.75 kb (37.5 kb), `es6-full` 40.25 kb (36 kb), `es5-full-brotli` 15.25 kb (12.75 kb), `es6-full-brotli` 15.25 kb (12.75 kb), `es5-zip` 16.75 kb (14 kb), `es6-zip` 16.5 kb (14 kb), `es5-poly` 14.75 kb (12 kb), `es5-strEndsWith` 900 b (700 b), `es5-simple-string` 1.25 kb (1 kb), `es5-scheduleTimeout` 1.05 kb (1 kb), `es5-scheduleMicrotask` 2 kb (1.75 kb), `es5-scheduleNextTick` 2.25 kb (2 kb), `es5-scheduleNextTickAndMicrotask` 2.25 kb (2 kb), `es5-min-full` 45 kb (40.5 kb), `es6-min-full` 44.25 kb (39.5 kb), `es5-min-zip` 18 kb (15.5 kb), `es6-min-zip` 18 kb (15.5 kb) and `es5-min-poly` 13 kb (10.5 kb), as the bundles now include the new features and the native parity and hardening fixes above (the other limits, `es5-env`, `es5-is`, `es5-is-zip` and `es5-getWindow`, are unchanged)
- [#646](https://github.com/nevware21/ts-utils/pull/646) Add a check (`lib/test/no-side-effects-annotations-check.js`, run by `npm run size-check` and so by CI) that no function annotated as having no side effects (`#__NO_SIDE_EFFECTS__`) is called with its result unused, as a bundler removes such a call, which is how `isUnsafeTarget` lost its prototypes in the bundles while its tests (which run the source) passed
  - The calls are resolved with the TypeScript type checker, so a call through an import (including a renamed or namespace import) or an alias of an annotated function (eg. `const alias = fn`) is found, while a local variable or parameter with the same name is not
  - An annotated function declaration, arrow function or function expression is recognised, and a result is unused when the call is a statement, the operand of `void`, `!`, `typeof` etc, a branch of `?:`, `&&`, `||` or `??`, the left of a comma, a `for` loop's initializer or incrementor, or the value of a variable which is never read (looking through parentheses and type assertions)
  - It also reports an annotated overload signature whose implementation isn't annotated, as TypeScript doesn't emit the overload signatures (or their comments), eg. the `arrIntersection`, `arrUnion`, `objPick` and `objOmit` annotations (see Bug Fixes)
- [#647](https://github.com/nevware21/ts-utils/pull/647) Add `npm run bundle-check` (`lib/test/bundle-runtime-check.js`) and run it as a CI step (and by `npm run rebuild`), it runs the built bundles and dist modules, as the unit tests run the source so they missed the bundle issues above (eg. the minifier removing `"use strict"`, and Rollup removing the call which adds a class defined later to `isUnsafeTarget`). Each check runs in a new VM realm, it checks that
  - the polyfills bundles keep the `"use strict"` directive, run when imported by a Rollup bundle, add their exports to the main bundle's namespace, don't register an AMD module when there is an AMD loader (`define.amd`) and install working, non-enumerable polyfills when the native functions are removed, including for a `String` object, a number and a `null` `this`
  - each main bundle (ES5 / ES6, UMD / IIFE, minified or not) keeps the `"use strict"` directive, only adds the `nevware21` global (and the `__tsUtils$gblCfg` global config), and that `isUnsafeTarget` (including `%TypedArray%.prototype` and a class defined after the first check), `objExtend` and the timeout overrides (without a global `setTimeout`) work
  - the dist and bundle code (its tokens, so not the comments) is ASCII only
  - a consumer of `isUnsafeTarget` and `objExtend` bundled from the ES5 and ES6 dist modules with esbuild (minified) and Rollup works, and esbuild keeps an import of the polyfills bundles (the `sideEffects`) while still tree-shaking the main module
  - `esbuild` is now a direct dev dependency, as the check uses it (it was only installed by `size-limit`)
- Smaller single imports (minified with esbuild): `createCustomError` ~2.2 kb (was ~3.1 kb), `throwUnsupported` ~2.3 kb (was ~3.2 kb), `encodeAsBase64` / `decodeBase64` and their Url variants ~1.2-1.3 kb (were ~1.9-2.1 kb), `objDeepCopy`, `objCopyProps`, `objExtend` and `deepExtend` ~5.3-5.4 kb (were ~6.1-6.3 kb), `objPick` ~1.1 kb (was ~2.2 kb), `objOmit` ~1.7 kb (was ~2.8 kb), `objMapValues` and `objDiff` ~1.3 kb (were ~2.4-2.5 kb) and `forEachOwnKey` ~1.2 kb (was ~1.5 kb)
  - `createCustomError` no longer includes a branch for a `null` base class, which can't happen as the base class is always `errorBase` or `Error`
  - `encodeAsBase64` and `decodeBase64` check for the native `btoa` / `atob` when they are called (still calling them without a `this`) rather than caching a wrapper created with `getInst()`, so a global `btoa` / `atob` defined after the first call is now also used
  - `objPick`, `objOmit`, `objPickBy`, `objOmitBy`, `objMapValues` and `objDiff` create their prototype-less result with the native `Object.create(null)` (an empty object without it, like `objCreate(null)`) rather than with `objCreate(null)`, which included its polyfill and `dumpObj()`
  - The internal `propertyIsEnumerable` used by `forEachOwnKey`, `objDefineProps` and the other object helpers is the intrinsic `Object.prototype.propertyIsEnumerable` bound to `Function.prototype.call`, as it is ES3 its fallback was never used
  - The single-use internal helpers of `createCustomError`, `getLength`, the polyfill type checks (eg. `isSymbol`) and the identity map are inlined, and the unused `_unwrapProp`, `_unwrapFunctionNoInstWithPoly` and `_isPolyfillType` are removed
- The polyfill `Symbol` (and its registry) is created with the native `Object.create(null)` (an empty object without it) rather than `objCreate(null)`, which included its polyfill and `dumpObj()`, so a bundle which uses an iterator or the polyfill symbol on its own is smaller (minified with esbuild), eg. `getKnownSymbol` ~3.6 kb (was ~4.4 kb, v0.16.0 ~3.9 kb), `isIterable` ~3.8 kb (was ~4.6 kb, v0.16.0 ~3.9 kb), `iterForOf` ~5.2 kb (was ~6 kb, v0.16.0 ~4.2 kb), `newSymbol` ~3.1 kb (was ~3.9 kb, v0.16.0 ~3.3 kb) and `symbolKeyFor` ~1.4 kb (was ~2.1 kb, v0.16.0 ~1.9 kb, its message no longer uses `dumpObj()`)
  - A polyfill symbol is tagged by two of its own property definitions (the internal `_tagAsPolyfill` is removed)
- [#638](https://github.com/nevware21/ts-utils/pull/638) fix(docs): resolve all api-extractor, TypeDoc and lint warnings
- [#591](https://github.com/nevware21/ts-utils/pull/591) chore(docs): Fix Full Changelog link in changelog.md

### Dependency Updates

- [#593](https://github.com/nevware21/ts-utils/pull/593) Bump actions/setup-node from 6 to 7
- [#595](https://github.com/nevware21/ts-utils/pull/595) Bump size-limit from 12.1.0 to 13.0.1
- [#604](https://github.com/nevware21/ts-utils/pull/604) Bump karma-spec-reporter from 0.0.36 to 0.0.37
- [#641](https://github.com/nevware21/ts-utils/pull/641) Bump glob from 13.0.6 to 13.0.7
- [#643](https://github.com/nevware21/ts-utils/pull/643) Bump rollup-plugin-istanbul from 5.0.0 to 6.0.0
- [#598](https://github.com/nevware21/ts-utils/pull/598), [#599](https://github.com/nevware21/ts-utils/pull/599), [#600](https://github.com/nevware21/ts-utils/pull/600), [#602](https://github.com/nevware21/ts-utils/pull/602), [#605](https://github.com/nevware21/ts-utils/pull/605), [#612](https://github.com/nevware21/ts-utils/pull/612), [#626](https://github.com/nevware21/ts-utils/pull/626), [#630](https://github.com/nevware21/ts-utils/pull/630), [#640](https://github.com/nevware21/ts-utils/pull/640) Bump github/codeql-action from 4 to 4.39.3

[Full Changelog](https://github.com/nevware21/ts-utils/compare/0.16.0...0.20.0)

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
