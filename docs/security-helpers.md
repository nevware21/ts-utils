# Security Helpers

When copying, merging, or transforming untrusted object-like input, JavaScript applications can accidentally allow prototype pollution via dangerous keys such as `__proto__`, `constructor`, and `prototype`.

This package includes helpers to reduce that risk in common object traversal and assignment flows.

## Available Helpers

- [forEachOwnKeySafe](./typedoc/functions/forEachOwnKeySafe.html) safely iterates only own enumerable keys and skips dangerous property names.
- [isUnsafePropKey](./typedoc/functions/isUnsafePropKey.html) identifies keys commonly used for prototype pollution attacks.
- [isUnsafeTarget](./typedoc/functions/isUnsafeTarget.html) detects built-in prototype objects so you can avoid mutating native prototypes.

## Recommended Usage

Use `isUnsafeTarget()` to guard the destination object, and `forEachOwnKeySafe()` to iterate source keys.

```typescript
import {
  forEachOwnKeySafe,
  isUnsafeTarget
} from "@nevware21/ts-utils";

function copyTrustedValues(source: any, target: any) {
  if (isUnsafeTarget(target)) {
    throw new TypeError("Refusing to write to a built-in prototype");
  }

  forEachOwnKeySafe(source, (key, value) => {
    target[key] = value;
  });

  return target;
}

const payload = {
  safe: true,
  __proto__: {
    polluted: true
  }
};

copyTrustedValues(payload, {});
// Result only includes the safe enumerable keys.
```

## Notes

- These helpers provide safer defaults, but they do not replace application-level input validation.
- If you accept untrusted JSON or query-derived objects, validate schema and value types before assignment.
