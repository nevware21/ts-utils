# Usage Guide for @nevware21/ts-utils

This guide provides practical examples for using the @nevware21/ts-utils library in your JavaScript or TypeScript projects.

## Table of Contents
- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Type Checking Functions](#type-checking-functions)
  - [Array Operations](#array-operations)
  - [Object Manipulations](#object-manipulations)
  - [String Functions](#string-functions)
  - [Safe Operations](#safe-operations)
- [Runtime Environment Helpers](#runtime-environment-helpers)
- [Advanced Usage](#advanced-usage)
  - [Working with Iterators](#working-with-iterators)
  - [Lazy Evaluation](#lazy-evaluation)
  - [Deep Copy with Custom Handlers](#deep-copy-with-custom-handlers)
- [Performance and Minification Benefits](#performance-and-minification-benefits)

## Installation

Install the npm package:

```bash
npm install @nevware21/ts-utils --save
```

It is recommended to use the following definition in your `package.json` to maintain compatibility with future releases:

```json
{
  "dependencies": {
    "@nevware21/ts-utils": ">= 0.12.3 < 2.x"
  }
}
```

## Basic Usage

### Type Checking Functions

The library provides numerous type checking functions to safely verify types in JavaScript:

```typescript
import { 
  isArray, isString, isObject, isFunction, isNumber, isBoolean, 
  isDefined, isUndefined, isNull, isNullOrUndefined, isTruthy 
} from "@nevware21/ts-utils";

// Basic type checks
const value = "test";
if (isString(value)) {
  // Work with string...
}

// Array check (safer than instanceof Array)
const arr = [1, 2, 3];
if (isArray(arr)) {
  // Work with array...
}

// Null/undefined checks
if (!isNullOrUndefined(value)) {
  // Safe to use value
}

// Truthiness check
if (isTruthy(value)) {
  // Value is not false, 0, "", null, undefined, etc.
}
```

### Array Operations

Array helper functions provide polyfill support and consistent API across environments:

```typescript
import { 
  arrForEach, arrMap, arrFilter, arrFind, arrReduce, 
  arrIncludes, arrSlice, arrFrom 
} from "@nevware21/ts-utils";

const numbers = [1, 2, 3, 4, 5];

// Iterate through array
arrForEach(numbers, (value, index) => {
  console.log(`Value at ${index}: ${value}`);
});

// Transform array
const doubled = arrMap(numbers, (value) => value * 2);
// [2, 4, 6, 8, 10]

// Filter array
const evens = arrFilter(numbers, (value) => value % 2 === 0);
// [2, 4]

// Find element
const found = arrFind(numbers, (value) => value > 3);
// 4

// Create array from iterable
const arrayFromString = arrFrom("hello");
// ["h", "e", "l", "l", "o"]
```

### Object Manipulations

Safely work with objects using these utility functions:

```typescript
import { 
  objForEachKey, objAssign, objCopyProps, objDeepCopy,
  objKeys, objValues, objEntries, objHasOwnProperty 
} from "@nevware21/ts-utils";

const person = {
  name: "Alice",
  age: 30,
  city: "Wonderland"
};

// Iterate through object keys
objForEachKey(person, (key, value) => {
  console.log(`${key}: ${value}`);
});

// Safe property check
if (objHasOwnProperty(person, "age")) {
  console.log(person.age);
}

// Deep copy objects
const personCopy = objDeepCopy(person);

// Get array of keys
const keys = objKeys(person);
// ["name", "age", "city"]

// Merge objects safely
const merged = objAssign({}, person, { job: "Developer" });
```

### String Functions

String manipulation with built-in polyfill support:

```typescript
import { 
  strTrim, strStartsWith, strEndsWith, strIncludes,
  strLeft, strRight, strSubstring, strIsNullOrEmpty,
  strCamelCase, strKebabCase, strSnakeCase
} from "@nevware21/ts-utils";

const text = "  Hello World!  ";

// Basic operations
const trimmed = strTrim(text);           // "Hello World!"
const hasPrefix = strStartsWith(text, "  He");  // true
const hasSuffix = strEndsWith(trimmed, "!");    // true
const includes = strIncludes(text, "World");    // true

// Get substrings
const leftPart = strLeft(trimmed, 5);    // "Hello"
const rightPart = strRight(trimmed, 7);  // "World!" 

// Case transformations
const camelCase = strCamelCase("hello-world");  // "helloWorld"
const kebabCase = strKebabCase("helloWorld");   // "hello-world"
const snakeCase = strSnakeCase("helloWorld");   // "hello_world"

// Check for empty strings
if (!strIsNullOrEmpty(text)) {
  // Safe to work with text
}
```

### Safe Operations

Perform operations safely without worrying about null/undefined errors:

```typescript
import { safe, safeGet, safeGetLazy } from "@nevware21/ts-utils";

const obj = {
  user: {
    profile: {
      name: "Alice"
    }
  }
};

// Safe function execution
const result = safe(() => {
  // This code won't throw even if something is undefined
  return obj.user.profile.address.street;
}, "Default value");

// Safe property access (nested)
const name = safeGet(obj, (o) => o.user.profile.name); // "Alice"
const address = safeGet(obj, (o) => o.user.profile.address, "Unknown"); // "Unknown"

// Lazy evaluation (only computed when needed)
const lazyValue = safeGetLazy(obj, () => {
  // Complex calculation only performed when value is accessed
  return calculateSomething(obj);
});
```

## Runtime Environment Helpers

Check and access runtime environment features safely:

```typescript
import { 
  isNode, isWebWorker, hasWindow, hasDocument,
  getGlobal, getWindow, getDocument, getNavigator 
} from "@nevware21/ts-utils";

// Environment detection
if (isNode()) {
  // Node.js specific code
} else if (isWebWorker()) {
  // Web Worker specific code
} else if (hasWindow()) {
  // Browser-specific code
}

// Safe access to global objects
const global = getGlobal();
const doc = hasDocument() ? getDocument() : null;
```

## Advanced Usage

### Working with Iterators

Create and work with iterators and iterables:

```typescript
import { 
  createIterator, createArrayIterator, makeIterable,
  isIterable, isIterator, iterForOf
} from "@nevware21/ts-utils";

// Create a custom iterator
const rangeIterator = createIterator({
  index: 0,
  max: 5
}, (ctx) => {
  if (ctx.index < ctx.max) {
    return { value: ctx.index++, done: false };
  }
  return { done: true };
});

// Make an object iterable
const iterableObject = makeIterable({
  items: [1, 2, 3, 4, 5]
}, function(this) {
  return createArrayIterator(this.items);
});

// Loop using iterForOf (works with any iterable)
iterForOf(iterableObject, (value) => {
  console.log(value);
});
```

### Lazy Evaluation

Use lazy evaluation to defer expensive operations until needed:

```typescript
import { getLazy, getWritableLazy } from "@nevware21/ts-utils";

// Create a lazy value
const lazyValue = getLazy(() => {
  console.log("Computing expensive value...");
  return performExpensiveCalculation();
});

// Value is calculated only when accessed
console.log("Before accessing lazy value");
const value = lazyValue.v;  // "Computing expensive value..." is logged here
console.log(`The value is ${value}`);

// Writable lazy value
const writableLazy = getWritableLazy(() => "initial value");
console.log(writableLazy.v);  // "initial value"

// Update the lazy value
writableLazy.v = "new value";
console.log(writableLazy.v);  // "new value"
```

### Deep Copy with Custom Handlers

Handle complex objects during deep copying:

```typescript
import { objDeepCopy, IObjDeepCopyHandlerDetails, isMap } from "@nevware21/ts-utils";

class User {
  constructor(public id: string, public name: string) {}
  
  greet() {
    return `Hello, my name is ${this.name}`;
  }
}

// Custom deep copy handler
function customDeepCopyHandler(details: IObjDeepCopyHandlerDetails): boolean {
  const value = details.value;
  
  if (value instanceof User) {
    // Create a new User instance
    details.result = new User(value.id, value.name);
    return true;  // We handled this object type
  }
  
  // Let the default implementation handle other types
  return false;
}

const original = {
  user: new User("123", "Alice"),
  settings: new Map([
    ["theme", "dark"],
    ["fontSize", 16]
  ])
};

const copy = objDeepCopy(original, customDeepCopyHandler);
console.log(copy.user.greet());  // "Hello, my name is Alice"
console.log(copy.user !== original.user);  // true - different instances
```

## Performance and Minification Benefits

Using ts-utils functions instead of direct JS methods provides better minification due to:

1. **Function Name Minification**: Helper functions from ts-utils get minified to single letters while standard JS methods cannot.

2. **Error Prevention**: Many ts-utils functions handle edge cases that standard JS methods might not.

3. **Consistent API**: Works across different browsers and environments without worrying about polyfills.

Example comparison of minified code:

```javascript
// Using ts-utils (minified)
function fn(t){var r=[];if(a(t)){f(t,function(v,i){if(h(t,v)){r.push(i+":"+v)}})}else{k(t,function(k,v){if(v){r.push(k+"="+v)}})}return r}

// Using standard JS (minified)
function fn(t){var r=[];if(Array.isArray(t)){for(var i=0;i<t.length;i++){if(i in t){var v=t[i];if(t.hasOwnProperty(v)){r.push(i+":"+v)}}}}else{Object.keys(t).forEach(function(k){var v=t[k];if(v){r.push(k+"="+v)}})}return r}
```

While ts-utils adds a small overhead for the first usage, the savings increase significantly as you use more functions throughout your code.
