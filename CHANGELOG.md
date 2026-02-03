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
