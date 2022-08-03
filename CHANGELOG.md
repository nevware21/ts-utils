
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
