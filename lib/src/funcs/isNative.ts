/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isGenerator } from "../helpers/base";
import { EMPTY, FUNCTION, FuncToString, UNDEF_VALUE } from "../internal/constants";
import { fnCall } from "./funcs";

// The source text of a function which isn't written in JavaScript (eg. a built-in function, a bound function or a
// callable Proxy), which the ECMAScript specification (Function.prototype.toString()) requires to have the syntax of a
// NativeFunction: "function" NativeFunctionAccessor(opt) PropertyName(opt) "(" FormalParameters ")" "{" "[" "native"
// "code" "]" "}", the runtimes only differ in the whitespace (eg. IE and Safari add new lines). The first group is the
// name, including any accessor (eg. "get size"), which is matched as runs of non-whitespace characters separated by
// whitespace, so no two quantifiers can match the same whitespace and the time is linear (an optional name between two
// whitespace quantifiers backtracked catastrophically on the source of a function with a long run of whitespace, eg.
// seconds for 10,000 spaces). The lint rule flags any nested quantifier, but each repetition must start with whitespace
// and end with a non-whitespace character, so it can't backtrack (1 million characters take milliseconds)
// eslint-disable-next-line security/detect-unsafe-regex
const NATIVE_FN = /^\s*function\b\s*(?:([^\s(]+(?:\s+[^\s(]+)*)\s*)?\([^)]*\)\s*\{\s*\[\s*native\s+code\s*\]\s*\}\s*$/;

/**
 * Checks whether the value is a native function, a function which isn't written in JavaScript (eg. a built-in function
 * like `Array` or `Math.max`, a function returned by the native `Function.prototype.bind()` or a callable `Proxy`), and
 * when a `name` is provided, whether it is the native function with that name.
 *
 * Its source text, from the intrinsic `Function.prototype.toString()` (captured when the module is loaded, so one which
 * is replaced later, or a function's own `toString()`, isn't used), is matched against the `NativeFunction` syntax
 * which the ECMAScript specification requires for these functions, eg. `function Array() { [native code] }` (a runtime
 * may add whitespace, eg. new lines), in linear time. The source text of a function written in JavaScript is its code,
 * which can't have this syntax as `[native code]` isn't valid JavaScript, except where the runtime doesn't return its
 * code: V8 (eg. Chrome and Node) returns a native source text for a function which has more than 65,535 characters
 * between the `function` keyword and its parameters (eg. `function` followed by 65,536 spaces and `Array() {}`), so
 * (as the source text is all it uses) such a function is also identified as a native function there. So it identifies
 * the runtime's functions (eg. to choose a native implementation), it isn't a security check of a value which may have
 * been created to look like a native function.
 *
 * It returns a `boolean` rather than being a type guard, as a `false` result doesn't mean that the value isn't a
 * function (a function written in JavaScript also returns `false`), use {@link isFunction} to narrow the type.
 * @since 0.20.0
 * @group Type Identity
 * @group Function
 * @param value - The value to check
 * @param name - The name of the native function (its initial name, eg. `"Array"`, `"max"`, `"get size"` for a getter, or
 * `""` for an anonymous one such as a bound function), when it isn't provided any native function matches
 * @returns `true` when the value is a native function (with the name), otherwise `false`
 * @example
 * ```ts
 * isNativeFn(Array);                // true
 * isNativeFn(Array, "Array");       // true
 * isNativeFn(Math.max, "max");      // true
 * isNativeFn(Math.max, "min");      // false
 * isNativeFn(function Array() {});  // false, written in JavaScript
 * isNativeFn(() => {});             // false
 * isNativeFn(Array.bind(null));     // true, eg. "function () { [native code] }"
 * isNativeFn("function Array() { [native code] }"); // false, not a function
 *
 * // Another realm's (eg. an iframe's) Array is also the native Array
 * isNativeFn(iframe.contentWindow.Array, "Array"); // true
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isNativeFn(value: any, name?: string): boolean {
    let match = isFunction(value) && NATIVE_FN.exec(fnCall(FuncToString as any, value));

    // Only an undefined name (not eg. the string "undefined") matches any native function
    return !!match && (name === UNDEF_VALUE || (match[1] || EMPTY) === name);
}

/**
 * Checks whether the value is a constructor, a function which can be called with `new` (like the ECMAScript
 * IsConstructor() operation), without calling it.
 *
 * Where there is a `Proxy` (ES2015+) a Proxy of the value, whose `construct` trap doesn't call it (or read any of its
 * properties), is called with `new`, which is only possible for a constructor: a class, a function declaration or
 * expression, a built-in constructor (eg. `Array`, and also `Symbol` and `BigInt`, which are constructors which throw
 * when they are called with `new`), a bound constructor or a Proxy of one. An arrow function, a method, a generator, an
 * async function or a built-in function which isn't a constructor (eg. `Math.max`) isn't one.
 *
 * On a runtime without `Proxy` (eg. ES5) `instanceof` is used, which only reads the function's `prototype` (for a bound
 * function its target's, and on these runtimes it can't be a getter) and throws a TypeError when it isn't an object.
 * So a function written in JavaScript, a built-in constructor and a bound constructor are constructors, while a
 * built-in function which isn't a constructor (eg. `Math.max` or `Array.prototype.push`, which have no `prototype`), a
 * bound function of one, a host function (eg. IE's `alert`), an arrow function or a method (on a runtime which has them
 * but no `Proxy`) isn't, and neither is a generator function (which has a `prototype`). The only exception is a
 * function written in JavaScript whose `prototype` has been replaced with a value which isn't an object, which isn't
 * identified as a constructor there. A runtime with `Symbol.hasInstance` or async generator functions but without
 * `Proxy` doesn't exist, on one a function's own `Symbol.hasInstance` would be used and an async generator function
 * (which has a `prototype` and isn't identified as a generator) would be identified as a constructor.
 * @since 0.20.0
 * @group Type Identity
 * @group Function
 * @param value - The value to check
 * @returns `true` when the value is a constructor, otherwise `false`
 * @example
 * ```ts
 * isConstructor(Array);                    // true
 * isConstructor(class Foo {});             // true
 * isConstructor(function () {});          // true
 * isConstructor(() => {});                 // false
 * isConstructor(Math.max);                 // false
 * isConstructor({ method() {} }.method);   // false
 * isConstructor(function* () {});         // false
 * isConstructor(null);                     // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isConstructor(value: any): value is (new (...args: any[]) => any) {
    let result = isFunction(value);

    if (result) {
        if (typeof Proxy === FUNCTION) {
            try {
                result = !!new (new Proxy(value, { construct: () => ({}) }))();
            } catch (e) {
                result = false;
            }
        } else {
            try {
                // A {} is only an instance of Object (or a function whose prototype is Object.prototype)
                result = (({} instanceof value) || result) && !isGenerator(value);
            } catch (e) {
                result = false;
            }
        }
    }

    return result;
}
