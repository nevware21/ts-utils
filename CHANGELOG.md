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
