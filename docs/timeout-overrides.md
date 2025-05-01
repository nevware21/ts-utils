# Timeout Overrides in ts-utils

This guide explains how to customize timeout behavior in your application using the ts-utils library's timeout override features.

## Overview

The ts-utils library provides robust timeout management capabilities with two levels of customization:

1. **Package-level overrides** via `setTimeoutOverrides()` - affect only the current package / closure instance
2. **Global overrides** via `setGlobalTimeoutOverrides()` - register global overrides which can be used by all package instances

These features enable you to:

- Add logging or telemetry to timeout operations
- Implement custom timing logic
- Replace the native timing functions with custom implementations
- Create testing mocks for consistent timing behavior

## Priority Order

When a timeout function is called, it uses timeout implementation functions in this priority order:

1. Specific overrides provided to the individual function call (highest priority)
2. Package-level overrides set via `setTimeoutOverrides()`
3. Global overrides set via `setGlobalTimeoutOverrides()`
4. Native `setTimeout`/`clearTimeout` functions (lowest priority)

## Usage Examples

### Basic Example

```typescript
import { 
  setTimeoutOverrides, 
  setGlobalTimeoutOverrides,
  scheduleTimeout 
} from "@nevware21/ts-utils";

// 1. Package-level overrides (affects only the current package instance)
function packageSetTimeout(callback, ms) {
  console.log(`Package: Setting timeout for ${ms}ms`);
  return setTimeout(callback, ms);
}

function packageClearTimeout(timeoutId) {
  console.log(`Package: Clearing timeout ${timeoutId}`);
  return clearTimeout(timeoutId);
}

// Set package-level overrides
setTimeoutOverrides([packageSetTimeout, packageClearTimeout]);

// 2. Global overrides (affects all package instances)
function globalSetTimeout(callback, ms) {
  console.log(`Global: Setting timeout for ${ms}ms`);
  return setTimeout(callback, ms);
}

function globalClearTimeout(timeoutId) {
  console.log(`Global: Clearing timeout ${timeoutId}`);
  return clearTimeout(timeoutId);
}

// Set global override functions
setGlobalTimeoutOverrides([globalSetTimeout, globalClearTimeout]);

// Priority order: specific overrides > package overrides > global overrides > native functions
const timer = scheduleTimeout(() => {
  console.log("Timer triggered");
}, 100);

// Cancel the timer
timer.cancel();
```

### Logging and Debugging

You can use timeout overrides to add logging that helps debug timing issues:

```typescript
import { setTimeoutOverrides, scheduleTimeout } from "@nevware21/ts-utils";

// Create logging timeout overrides
setTimeoutOverrides([
  (callback, ms, ...args) => {
    const timerId = setTimeout(callback, ms, ...args);
    console.log(`[${new Date().toISOString()}] Created timeout #${timerId} for ${ms}ms`);
    return timerId;
  },
  (timerId) => {
    console.log(`[${new Date().toISOString()}] Cleared timeout #${timerId}`);
    return clearTimeout(timerId);
  }
]);

// Usage
const timer = scheduleTimeout(() => {
  console.log("Task executed");
}, 1000);

// Later...
timer.cancel(); // This will log when the timeout is cleared
```

### Testing with Deterministic Timing

For testing, you can replace the actual timeout functions with synchronous versions:

```typescript
import { setTimeoutOverrides, scheduleTimeout } from "@nevware21/ts-utils";

// Track timeouts for testing
const pendingTimeouts = new Map();
let nextTimeoutId = 1;

// Setup synchronous timeout implementation for tests
setTimeoutOverrides([
  (callback, ms, ...args) => {
    const timeoutId = nextTimeoutId++;
    pendingTimeouts.set(timeoutId, { callback, args });
    return timeoutId;
  },
  (timeoutId) => {
    pendingTimeouts.delete(timeoutId);
  }
]);

// Test helper to simulate time passing and trigger timeouts
function advanceTimers() {
  const timeoutsToRun = Array.from(pendingTimeouts.entries());
  pendingTimeouts.clear();
  
  for (const [id, { callback, args }] of timeoutsToRun) {
    callback(...args);
  }
}

// Test code
let called = false;
scheduleTimeout(() => {
  called = true;
}, 1000);

console.log(called); // false
advanceTimers();
console.log(called); // true
```

### Multiple Package Instances with Global Overrides

When you have multiple instances of a package using ts-utils, global overrides are useful:

```typescript
// library-a.js
import { setTimeoutOverrides, scheduleTimeout } from "@nevware21/ts-utils";

// Package A sets its own overrides
setTimeoutOverrides([
  (callback, ms) => {
    console.log("Library A timeout");
    return setTimeout(callback, ms);
  }
]);

export function delayedOperation() {
  return scheduleTimeout(() => {
    console.log("Library A operation complete");
  }, 100);
}

// library-b.js
import { scheduleTimeout } from "@nevware21/ts-utils";

export function delayedOperation() {
  return scheduleTimeout(() => {
    console.log("Library B operation complete");
  }, 200);
}

// main.js
import { setGlobalTimeoutOverrides } from "@nevware21/ts-utils";
import * as LibraryA from "./library-a";
import * as LibraryB from "./library-b";

// Set global monitoring that affects all libraries
setGlobalTimeoutOverrides([
  (callback, ms) => {
    console.log(`Global monitor: Timeout created for ${ms}ms`);
    return setTimeout(callback, ms);
  },
  (id) => {
    console.log(`Global monitor: Timeout cleared`);
    return clearTimeout(id);
  }
]);

// Library A will use its own overrides (package-level takes precedence)
LibraryA.delayedOperation();

// Library B will use the global overrides since it has no package-level overrides
LibraryB.delayedOperation();
```

## API Reference

### setTimeoutOverrides

Sets package-level timeout override functions for the current package instance.

```typescript
function setTimeoutOverrides(overrideFn?: TimeoutOverrideFn | TimeoutOverrideFuncs): void;
```

- `overrideFn`: A single function to override `setTimeout`, or an array with two functions to override both `setTimeout` and `clearTimeout`.
- If no parameters or `undefined` is provided, it resets both overrides to native implementations.

### setGlobalTimeoutOverrides

Sets global timeout override functions that serve as fallbacks when no package-level or specific overrides are provided.

```typescript
function setGlobalTimeoutOverrides(overrideFn?: TimeoutOverrideFn | TimeoutOverrideFuncs): void;
```

- `overrideFn`: A single function to override `setTimeout`, or an array with two functions to override both `setTimeout` and `clearTimeout`.
- If no parameters or `undefined` is provided, it resets the global overrides to `undefined`.

## Best Practices

1. **Use package-level overrides** for functionality specific to your package or module.

2. **Use global overrides** sparingly for application-wide timing behaviors like logging or testing.

3. **Reset overrides when done** to prevent unexpected behavior, especially in testing environments:
   ```typescript
   // After tests
   setTimeoutOverrides(undefined);
   setGlobalTimeoutOverrides(undefined);
   ```

4. **Be mindful of performance** when adding complex logic to timeout overrides, as they may be called frequently.

5. **Add helpful logging messages** to make it clear which override is being used when debugging.

## Conclusion

Timeout overrides in ts-utils provide a powerful way to customize timing behavior at different levels of your application. By understanding the priority order and using the appropriate override type for your needs, you can create more maintainable and testable code.
