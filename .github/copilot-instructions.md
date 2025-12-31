# GitHub Copilot Instructions for ts-utils

## Project Overview

`@nevware21/ts-utils` is a comprehensive TypeScript/JavaScript utility library providing cross-environment support (Node.js, browser, web worker) with helper functions, polyfills (ES5-ES2023), type checking utilities, and optimized implementations for better minification and code readability.

**Key Design Principles:**
- Zero dependencies
- ES5 compatibility (v0.x and v1.x)
- Optimized for minification and tree-shaking
- Cross-environment compatibility
- Performance-optimized implementations

## Repository Structure

```
lib/
  ├── src/              # TypeScript source files
  │   ├── helpers/      # Helper utilities (environment, type checking, etc.)
  │   ├── string/       # String manipulation functions
  │   ├── array/        # Array utilities
  │   ├── object/       # Object manipulation functions
  │   ├── polyfills/    # Polyfill implementations
  │   ├── internal/     # Internal utilities and constants
  │   └── ...
  ├── test/             # Test files
  │   └── src/
  │       ├── common/   # Tests that run in all environments
  │       ├── node/     # Node.js-specific tests
  │       ├── browser/  # Browser-specific tests
  │       ├── worker/   # Web worker-specific tests
  │       └── esnext/   # ES6+ tests
  ├── dist/             # Built output (ES5 and ES6 versions)
  └── rollup.config.js  # Rollup bundler configuration
```

## Building and Testing

### Build Commands
```bash
npm run build          # Build the library
npm run rebuild        # Clean build with tests, size checks
npm run package        # Run rollup bundler
npm run dtsgen         # Generate TypeScript definition files
```

### Test Commands
```bash
npm run test           # Run all tests (ES5 + ESNext)
npm run test:es5       # Run ES5 tests in Node, browser, and worker
npm run test:esnext    # Run ESNext tests
npm run test:node      # Run Node.js tests only
npm run test:browser   # Run browser tests (headless Chrome)
npm run test:worker    # Run web worker tests
```

### Linting
```bash
npm run lint           # Run ESLint
```

### Debug Tests
```bash
npm run debug:browser         # Debug browser tests (watch mode)
npm run debug:browser_esnext  # Debug ESNext browser tests
npm run debug:worker          # Debug worker tests
```

## Coding Conventions

### File Headers
All source files must include the standard header (replace 2022 with the current year when creating new files):
```typescript
/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */
```

### Code Style
- **Indentation:** Use standard indentation (enforced by ESLint)
- **Quotes:** Use double quotes for strings (enforced by ESLint)
- **Semicolons:** Required at end of statements
- **Braces:** Always use braces for control structures (enforced by ESLint)
- **Variable declarations:** Use `let` and `const` appropriately; `var` is allowed for ES5 compatibility
- **No trailing spaces** on blank lines
- **Comma placement:** No trailing commas

### Function Naming and Design
- **Minification-friendly:** Function names should be short and descriptive
- Use prefix conventions:
  - `str*` for string operations (e.g., `strTrim`, `strRepeat`)
  - `arr*` for array operations (e.g., `arrMap`, `arrForEach`)
  - `obj*` for object operations (e.g., `objKeys`, `objExtend`)
  - `is*` for type checking (e.g., `isString`, `isArray`)
  - `has*` for existence checks (e.g., `hasWindow`, `hasDocument`)
  - `get*` for getters (e.g., `getGlobal`, `getDocument`)
  - `poly*` for polyfills (e.g., `polyStrTrim`, `polyObjKeys`)

### Documentation
- Use TSDoc comments for all exported functions
- Include `@group` tags to categorize functions (e.g., `@group String`, `@group Array`)
- Include `@since` tag to indicate version introduced
- Provide `@example` sections with practical usage
- Document parameters with `@param`
- Document return values with `@returns`
- Document exceptions with `@throws`

Example:
```typescript
/**
 * The strTrim() method removes whitespace from both ends of a string.
 * @function
 * @group String
 * @param value - The string value to be trimmed.
 * @returns A new string representing str stripped of whitespace from both ends.
 * @example
 * ```ts
 * strTrim("  hello  ");  // "hello"
 * ```
 */
```

### Optimization Markers
Use pure function markers for tree-shaking:
```typescript
export const asString: (value: any) => string = (/*#__PURE__*/_pureAssign(StrCls));
```

Use `/*#__NO_SIDE_EFFECTS__*/` for functions without side effects:
```typescript
/*#__NO_SIDE_EFFECTS__*/
export function examplePureFunction(value: number): number {
    return value * 2;
}
```

## TypeScript and ES5 Compatibility

### ES5 Support
- Maintain ES5 compatibility for v0.x and v1.x releases
- Use internal polyfills for modern features when targeting ES5 (never use external packages as this can have negative interactions on consuming projects)
- Avoid ES6+ syntax in ES5 builds (arrow functions, classes, etc.)
- Use the `_unwrapFunctionWithPoly` pattern for polyfill fallbacks

Example:
```typescript
export const strRepeat: (value: string, count: number) => string = 
    (/*#__PURE__*/_unwrapFunctionWithPoly("repeat", StrProto, polyStrRepeat));
```

### Polyfills
- Internal polyfills are in `lib/src/polyfills/`
- Polyfills must be tested against native implementations
- Only use polyfills when native implementations are unavailable
- Document which environments require polyfills

## Cross-Environment Support

### Environment Detection
Use the provided environment detection functions:
```typescript
import { isNode, isWebWorker, getGlobal, getWindow, hasDocument } from "@nevware21/ts-utils";
```

### Safe Access Patterns
Use safe access helpers to avoid runtime errors:
```typescript
import { safe, safeGet, lazySafeGetInst } from "@nevware21/ts-utils";
```

### Testing Requirements
When modifying or adding features:
1. **Node.js tests:** Place in `lib/test/src/node/` or `lib/test/src/common/`
2. **Browser tests:** Place in `lib/test/src/browser/` or `lib/test/src/common/`
3. **Worker tests:** Place in `lib/test/src/worker/` or `lib/test/src/common/`
4. **ESNext tests:** Place in `lib/test/src/esnext/` for ES6+ features

Common tests (in `lib/test/src/common/`) run in all environments (Node, browser, worker).

## Testing Conventions

### Test Framework
- Use `@nevware21/tripwire` for assertions
- Test files use `.test.ts` suffix
- Organize tests by functionality (matching `src/` structure)

Example:
```typescript
import { assert } from "@nevware21/tripwire";
import { strTrim } from "../../../../src/string/trim";

describe("strTrim helper", () => {
    it("should trim whitespace", () => {
        assert.equal(strTrim("  hello  "), "hello");
    });
});
```

### Test Coverage
- Aim for comprehensive test coverage
- Test edge cases (null, undefined, empty values)
- Test cross-environment behavior when applicable
- Include tests for polyfill implementations

## Bundle Size and Minification

### Size Optimization
This library is heavily optimized for bundle size:
- Functions are designed to minify well
- Tree-shaking is fully supported
- Use helper functions instead of inline operations for repeated code
- Size limits are checked in CI/CD

### Size Checking
```bash
npm run size           # Check bundle size
npm run size-check     # Validate against limits
```

## Performance Considerations

- Prefer iterative approaches over recursive when appropriate
- Use caching for expensive operations (see `createCachedValue`, `getLazy`)
- Avoid unnecessary object creation
- Use bitwise operations where appropriate for performance

## Security

- The `eslint-plugin-security` is enabled
- Avoid object injection vulnerabilities
- Sanitize inputs when necessary (use `encodeAsHtml`, `encodeAsJson`)
- Follow security best practices for cross-environment code

## Common Patterns

### Creating Utility Functions
1. Define the function in the appropriate module (e.g., `lib/src/string/`)
2. Export it from the module
3. Add comprehensive TSDoc documentation
4. Create tests in `lib/test/src/common/` or environment-specific directory
5. Update the main export file if needed

### Adding Polyfills
1. Create polyfill implementation in `lib/src/polyfills/`
2. Prefix function name with `poly` (e.g., `polyStrTrim`)
3. Use `_unwrapFunctionWithPoly` to provide fallback
4. Test against native implementation in supported environments

### Type Guards
Use proper TypeScript type guards:
```typescript
export function isString(value: any): value is string {
    return typeof value === "string";
}
```

## Documentation

- Full API documentation is generated with TypeDoc
- Run `npm run docs` to generate documentation
- Documentation is published to GitHub Pages
- Include examples in TSDoc comments for better documentation

## Important Notes for AI Assistance

When making changes:
1. **Always maintain ES5 compatibility** for v0.x releases
2. **Test in all environments** (Node, browser, worker) where applicable
3. **Follow the established naming conventions** for consistency
4. **Optimize for minification** by using helper functions
5. **Add comprehensive tests** before submitting changes
6. **Update documentation** when adding new features
7. **Check bundle size impact** for new additions
8. **Use existing patterns** from the codebase as reference
9. **Never remove or break existing public APIs** without major version bump
10. **Security scan results** must be addressed before merging

## Getting Help

- Review existing similar functions for patterns
- Check the TypeDoc documentation for API details
- Refer to CONTRIBUTING.md for contribution guidelines
- Look at test files for usage examples
