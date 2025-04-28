# Advanced Deep Copy Handlers

## Overview

The `ts-utils` library provides powerful object deep copying functionality through the `objDeepCopy` and `objCopyProps` functions. These functions support custom handlers that allow you to control exactly how specific object types are copied, which is particularly valuable when dealing with:

- Complex class instances that need to preserve their prototype chain
- Native objects like Date, RegExp, Map, Set, etc.
- Circular references in object graphs
- Custom data structures or exotic objects

## Handler Interface

A custom deep copy handler is a function that conforms to the `IObjDeepCopyHandler` type:

```typescript
type IObjDeepCopyHandler = (details: IObjDeepCopyHandlerDetails) => boolean;
```

The handler function receives a `details` object with the following properties:

```typescript
interface IObjDeepCopyHandlerDetails {
    // The source value being copied
    value: any;
    
    // The path to the current value in the object graph (array of keys/indices)
    path: (string | number)[];
    
    // Reference to the parent object containing the value
    parent: any;
    
    // The key/index of the current value in its parent
    key: string | number | symbol;
    
    // You should set this to your copied result if handling the value
    result: any;
    
    // A helper function to copy child values (handles recursion automatically)
    copy: <T>(value: T) => T;
    
    // Optional state object you can use to store information across handler calls
    state?: Record<string, any>;
}
```

## How to Use Custom Handlers

The basic pattern for using a custom handler is:

1. Define your handler function that processes specific types of objects
2. Return `true` if your handler processed the object, or `false` to let the default handler process it
3. If you return `true`, set `details.result` to your copied value
4. Pass your handler to `objDeepCopy` or `objCopyProps` when called

## Basic Example

Here's a simple example that handles `Date` objects and custom class instances:

```typescript
import { objDeepCopy, IObjDeepCopyHandlerDetails } from "@nevware21/ts-utils";

// Example custom class
class Person {
  constructor(public name: string, public age: number) {}
  greet() { return `Hello, I'm ${this.name}`; }
}

// Custom handler function
function myCustomHandler(details: IObjDeepCopyHandlerDetails): boolean {
  const value = details.value;
  
  // Handle Date objects
  if (value instanceof Date) {
    details.result = new Date(value.getTime());
    return true;
  }
  
  // Handle Person instances
  if (value instanceof Person) {
    details.result = new Person(value.name, value.age);
    return true;
  }
  
  // Let default handler process other types
  return false;
}

// Use custom handler with objDeepCopy
const original = {
  date: new Date(),
  person: new Person("Alice", 30)
};

const copy = objDeepCopy(original, myCustomHandler);

console.log(copy.date instanceof Date); // true
console.log(copy.person instanceof Person); // true
console.log(copy.person.greet()); // "Hello, I'm Alice"
```

## Handling Complex Structures

For more complex scenarios like Maps, Sets, and circular references:

```typescript
import { 
  objDeepCopy, 
  IObjDeepCopyHandlerDetails,
  isMap,
  isSet
} from "@nevware21/ts-utils";

function complexHandler(details: IObjDeepCopyHandlerDetails): boolean {
  const { value, copy, state } = details;
  
  // Initialize an object map for tracking already copied objects
  if (!state.objectMap) {
    state.objectMap = new WeakMap();
  }
  
  // Handle circular references
  if (value && typeof value === "object") {
    if (state.objectMap.has(value)) {
      details.result = state.objectMap.get(value);
      return true;
    }
  }
  
  // Handle Map objects
  if (isMap(value)) {
    const newMap = new Map();
    
    // Store reference immediately to handle circular references
    state.objectMap.set(value, newMap);
    details.result = newMap;
    
    // Copy all entries
    value.forEach((val, key) => {
      newMap.set(copy(key), copy(val));
    });
    
    return true;
  }
  
  // Handle Set objects
  if (isSet(value)) {
    const newSet = new Set();
    
    // Store reference immediately to handle circular references
    state.objectMap.set(value, newSet);
    details.result = newSet;
    
    value.forEach(val => {
      newSet.add(copy(val));
    });
    
    return true;
  }
  
  return false;
}

// Example with circular references
const circular = { name: "Test" };
circular.self = circular;
circular.map = new Map([["key", circular]]);
circular.set = new Set([circular]);

const copied = objDeepCopy(circular, complexHandler, { objectMap: new WeakMap() });

console.log(copied.self === copied); // true - circular reference preserved
console.log(copied.map.get("key") === copied); // true
```

## Handling DOM Elements

When working in browser environments, you might need to handle DOM elements:

```typescript
import { objDeepCopy, IObjDeepCopyHandlerDetails, isElementLike } from "@nevware21/ts-utils";

function domHandler(details: IObjDeepCopyHandlerDetails): boolean {
  const value = details.value;
  
  // Handle DOM elements
  if (isElementLike(value)) {
    // Option 1: Clone DOM element
    if (value.cloneNode) {
      details.result = value.cloneNode(true);
      return true;
    }
    // Option 2: Just reference DOM elements rather than copy them
    details.result = value;
    return true;
  }
  
  return false;
}

const withDOM = {
  div: document.createElement('div'),
  data: { name: "test" }
};

const domCopy = objDeepCopy(withDOM, domHandler);
```

## Performance Considerations

Custom handlers add some overhead, so consider these best practices:

1. Only handle specific types you need special behavior for
2. Return `false` quickly for types you don't handle
3. Use the path information to limit processing for large objects
4. Consider using a WeakMap for handling circular references
5. Avoid unnecessary deep copies when shallow copies would suffice

## Combining Multiple Handlers

You can combine multiple specialized handlers into one:

```typescript
import { objDeepCopy, IObjDeepCopyHandlerDetails } from "@nevware21/ts-utils";

function dateHandler(details: IObjDeepCopyHandlerDetails): boolean {
  if (details.value instanceof Date) {
    details.result = new Date(details.value.getTime());
    return true;
  }
  return false;
}

function regExpHandler(details: IObjDeepCopyHandlerDetails): boolean {
  if (details.value instanceof RegExp) {
    details.result = new RegExp(details.value.source, details.value.flags);
    return true;
  }
  return false;
}

function combinedHandler(details: IObjDeepCopyHandlerDetails): boolean {
  return dateHandler(details) || regExpHandler(details);
}

const obj = {
  date: new Date(),
  regex: /test/gi
};

const copy = objDeepCopy(obj, combinedHandler);
```

## Filtering Properties During Copy

Custom handlers can also be used to filter properties during copying:

```typescript
import { objDeepCopy, IObjDeepCopyHandlerDetails } from "@nevware21/ts-utils";

function filteringHandler(details: IObjDeepCopyHandlerDetails): boolean {
  // Skip copying properties that start with underscore
  if (typeof details.key === 'string' && details.key.startsWith('_')) {
    details.result = undefined;
    return true;
  }
  return false;
}

const obj = {
  name: "visible",
  _hidden: "private data",
  nested: {
    public: "ok",
    _private: "hidden"
  }
};

const filtered = objDeepCopy(obj, filteringHandler);
// filtered = { name: "visible", nested: { public: "ok" } }
```

## Best Practices

1. **Handle specific types**: Return `false` for anything your handler doesn't specifically support
2. **Use the copy() helper**: Always use the provided copy function for nested objects to maintain proper handling of circular references
3. **Check for performance**: Measure impact on large objects and optimize as needed
4. **Preserve object identity**: Use a WeakMap to track already copied objects for circular references
5. **Keep handlers focused**: Create separate handlers for different concerns and combine them as needed

## Complete Example

Here's a complete example that handles multiple types and circular references:

```typescript
import { 
  objDeepCopy, 
  IObjDeepCopyHandlerDetails,
  isMap,
  isSet,
  isDate,
  isRegExp,
  isError
} from "@nevware21/ts-utils";

// Complete handler that handles multiple types
function completeHandler(details: IObjDeepCopyHandlerDetails): boolean {
  const { value, copy, state } = details;
  
  // Initialize an object map for tracking circular references
  if (!state.seen) {
    state.seen = new WeakMap();
  }
  
  // Handle circular references
  if (value && typeof value === "object") {
    if (state.seen.has(value)) {
      details.result = state.seen.get(value);
      return true;
    }
  }
  
  // Handle dates
  if (isDate(value)) {
    details.result = new Date(value.getTime());
    return true;
  }
  
  // Handle RegExp
  if (isRegExp(value)) {
    details.result = new RegExp(value.source, value.flags);
    return true;
  }
  
  // Handle Error objects
  if (isError(value)) {
    const errorCopy = new Error(value.message);
    errorCopy.name = value.name;
    errorCopy.stack = value.stack;
    
    // Copy custom properties
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        errorCopy[key] = copy(value[key]);
      }
    }
    
    details.result = errorCopy;
    return true;
  }
  
  // Handle Map objects
  if (isMap(value)) {
    const newMap = new Map();
    state.seen.set(value, newMap);
    details.result = newMap;
    
    value.forEach((val, key) => {
      newMap.set(copy(key), copy(val));
    });
    return true;
  }
  
  // Handle Set objects
  if (isSet(value)) {
    const newSet = new Set();
    state.seen.set(value, newSet);
    details.result = newSet;
    
    value.forEach(val => {
      newSet.add(copy(val));
    });
    return true;
  }
  
  // For plain objects and arrays, register them first to handle circular references,
  // but let the default handler do the actual copying
  if (value && typeof value === "object" && (Array.isArray(value) || Object.getPrototypeOf(value) === Object.prototype)) {
    const newObj = Array.isArray(value) ? [] : {};
    state.seen.set(value, newObj);
    details.result = newObj;
    
    // Let the default handler populate the object/array
    return false;
  }
  
  return false;
}

// Usage
const complex = {
  date: new Date(),
  regexp: /test/gi,
  error: new Error("Test error"),
  map: new Map([["key1", "value1"]]),
  set: new Set([1, 2, 3])
};

// Create a circular reference
complex.self = complex;
complex.map.set("circular", complex);

const copied = objDeepCopy(complex, completeHandler, { seen: new WeakMap() });

// Verify circular references are maintained
console.log(copied.self === copied); // true
console.log(copied.map.get("circular") === copied); // true

// Verify types are preserved
console.log(copied.date instanceof Date); // true
console.log(copied.regexp instanceof RegExp); // true
console.log(copied.error instanceof Error); // true
console.log(copied.map instanceof Map); // true
console.log(copied.set instanceof Set); // true
```

## Conclusion

Custom deep copy handlers provide a powerful way to control exactly how your objects are copied. By implementing custom handlers for your specific use cases, you can ensure that complex objects, special types, and circular references are handled correctly in your application.

These handlers can be as simple or as complex as needed for your specific requirements, making them an extremely flexible and powerful tool in the `@nevware21/ts-utils` library.
