# Feature Backlog and Request Tracking

This document tracks suggested additions for `@nevware21/ts-utils`.

## Request RQ-2026-03-17-ADDITIONS

- Request: Identify what additions could be added to ts-utils
- Requested by: Maintainer discussion
- Priority: High
- Target Version: 0.14.0
- Scope: Array, object, string, iterator, typing, and documentation improvements

### Objective

Identify practical, minification-friendly, cross-environment additions that fit the library design principles:

- zero dependencies
- ES5 compatibility for v0.x / v1.x
- polyfill-backed behavior where needed
- strong tree-shaking and small bundles

## Suggested Additions (Proposed Only)

### Language-Native Suggestions (with ECMAScript Version)

#### String Methods (ES6+)
(All major String methods currently implemented)

#### Array Methods (ES6+)
(All major Array methods currently implemented)

#### Object Utilities (ES6+)
(All major Object utilities currently implemented)

#### Set/Map Utilities (ES6+ Data Structures)
- `setFrom` – Safe Set construction from iterables
- `mapFrom` – Safe Map construction from key-value pairs
- `setIntersection` / `setUnion` / `setDifference` – Set algebra helpers
- `mapMerge` – Map concatenation helper

#### Type/Value Inspection (ES6+)
- `isAsyncIterable` – ES6+ type checks
- `isIntegerInRange` – Safe integer range validation

Notes:

- These are direct language-native wrappers with ES version markers for polyfill candidates
- Other suggestions below are library-level utilities (not direct language features).
- Iterator helpers are intentionally listed as utility suggestions here rather than standard-language mappings.
- Implementations should include ES5 polyfills where applicable for v0.x/v1.x compatibility

### A. Object Utilities (Medium Value)

- `objPick` / `objOmit`
- `objMapValues`
- `objMergeIf`
- `objDiff`
- `objPickBy` / `objOmitBy`
- `objDefaults` for shallow default assignment without overriding defined values

Notes:

- maintain plain-object safety patterns
- avoid behavior changes to existing deep copy helpers

### B. String Utilities (Medium Value)

- `strStartsWithAny` / `strEndsWithAny`
- `strWrap` / `strUnwrap`
- `strNormalizeNewlines`

Notes:

- prefer helpers that avoid locale-sensitive behavior unless explicitly documented
- keep semantics predictable for ES5 runtimes and string coercion patterns

### C. Iterator and Collection Helpers (Medium Value)

- `iterMap`, `iterFilter`, `iterTake` – Iterator transformation helpers
- `iterReduce`, `iterSome`, `iterEvery` – Iterator reduction/testing
- `iterToArray` for predictable materialization of iterables / iterators
- `arrToMap` helpers with stable key selection
- lightweight set operations for iterables

### D. Reliability and Tooling (High Value)

- keep bundle-size thresholds justified with measured report
- require test parity for polyfill vs native behavior
- ensure newly exported functions are reflected in README utility matrix
- add targeted coverage checks for newly introduced leaf utilities
- document explicit null / undefined coercion or throw behavior for new helpers

## Next Actions

1. Keep this document focused on proposed additions only.
