# Feature Backlog and Request Tracking

This document tracks suggested additions for `@nevware21/ts-utils`.

## Request RQ-2026-03-17-ADDITIONS

- Request: Identify what additions could be added to ts-utils
- Requested by: Maintainer discussion
- Priority: High
- Scope: Array, object, string, iterator, typing, and documentation improvements

### Objective

Identify practical, minification-friendly, cross-environment additions that fit the library design principles:

- zero dependencies
- ES5 compatibility for v0.x / v1.x
- polyfill-backed behavior where needed
- strong tree-shaking and small bundles

## Suggested Additions (Proposed Only)

### Language-Native Suggestions (with ECMAScript Version)

The following suggestions map directly to JavaScript language / standard library features:

- `strReplaceAll` wrapper/polyfill path
	- JavaScript feature: `String.prototype.replaceAll()`
	- Added in: **ECMAScript 2021 (ES12)**

| Suggestion | JavaScript Feature | ECMAScript Version |
| --- | --- | --- |
| `strReplaceAll` wrapper/polyfill path | `String.prototype.replaceAll()` | ECMAScript 2021 (ES12) |

Notes:

- Other suggestions below are library-level utilities (not direct language features).
- Iterator helpers are intentionally listed as utility suggestions here rather than standard-language mappings.

### A. Typing Improvements (High Value)

- `ReadonlyRecord<K, V>` helper type alias for API ergonomics
- `DeepPartial<T>` utility type
- `DeepReadonly<T>` utility type
- `Mutable<T>` utility type for controlled writable transformations

### B. Object Utilities (Medium Value)

- `objPick` / `objOmit`
- `objMapValues`
- `objMergeIf`
- `objDiff`

Notes:

- maintain plain-object safety patterns
- avoid behavior changes to existing deep copy helpers

### C. String Utilities (Medium Value)

- `strTruncate` (with optional suffix)
- `strCount` (substring occurrences)

### D. Iterator and Collection Helpers (Medium Value)

- `iterMap`, `iterFilter`, `iterTake`
- `arrToMap` helpers with stable key selection
- lightweight set operations for iterables

### E. Reliability and Tooling (High Value)

- keep bundle-size thresholds justified with measured report
- require test parity for polyfill vs native behavior
- ensure newly exported functions are reflected in README utility matrix

## Acceptance Criteria for this Request

- [x] Identify additions by category
- [x] Prioritize additions by value and fit
- [ ] Create follow-up issue list for proposed items
- [ ] Add ownership and target milestone per item

## Next Actions

1. Open GitHub issues for sections A-D candidates.
2. Add milestone tags for upcoming releases.
3. Keep this document focused on proposed additions only.
