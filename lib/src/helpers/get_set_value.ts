/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction, isNullOrUndefined } from "./base";
import { strSplit } from "../string/split";
import { iterForOf } from "../iterator/forOf";
import { isUnsafeTarget } from "../object/isUnsafeTarget";
import { isUnsafePropKey } from "../object/isUnsafePropKey";
import { objHasOwn } from "../object/has_own";
import { LENGTH, UNDEF_VALUE } from "../internal/constants";
import { asString } from "../string/as_string";
import { isSymbol } from "../symbol/symbol";

/**
 * Get the named value from the target object where the path may be presented by a string which
 * contains "." characters to separate the nested objects of the heirarchy / path to the value.
 * @since 0.9.1
 * @group Value
 * @param target - The source object that contains the value
 * @param path - The path identifing the location where the value should be located
 * @param defValue - If the final value or any intervening object in the heirarchy is not present
 * the default value will be returned
 * @returns The value located based on the path or the defaule value
 * @example
 * ```ts
 * let theValue = {
 *   Hello: {
 *      Darkness: {
 *          my: "old"
 *      }
 *   },
 *   friend: "I've",
 *   come: {
 *      to: {
 *          see: "you"
 *      }
 *   }
 * };
 *
 * let value = getValueByKey(theValue, "Hello.Darkness.my", "friend");
 * // value === "old"
 *
 * let value = getValueByKey(theValue, "My.Old", "friend");
 * // value === "friend"
 *
 * let value = getValueByKey(theValue, "come.to", "friend");
 * // value === { see: "you" }
 *
 * let value = getValueByKey(theValue, "friend", "friend");
 * // value === "I've"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function getValueByKey<V, T extends object = any>(target: T, path: string, defValue?: V): V {
    if (!path || !target) {
        return defValue;
    }

    let parts = strSplit(path, ".");
    let cnt = parts[LENGTH];

    for (let lp = 0; lp < cnt && !isNullOrUndefined(target); lp++) {
        target = (target as any)[parts[lp]];
    }

    return (!isNullOrUndefined(target) ? target : defValue) as V;
}

/**
 * Get the named value from the target object where the path is represented by the string iterator
 * or iterable to separate the nested objects of the heirarchy / path to the value. If the target
 * does not contain the full path the iterator will not be completed.
 *
 * The order of processing of the iterator is not reset if you add or remove elements to the iterator,
 * the actual behavior will depend on the iterator imeplementation.
 *
 * If the passed `iter` is both an Iterable<T> and Iterator<T>, like `for...of` (and {@link iterForOf}) the iterator
 * returned by its `[Symbol.iterator]()` is used.
 *
 * The path is read like {@link iterForOf}, so on a runtime without `Symbol.iterator` (eg. IE) an array, an iterator
 * (or an iterable created by this library) and a `Map` or `Set` are read, but a value which is only iterable where
 * there is `Symbol.iterator` (eg. an `arguments` object) has no keys, so (like an empty path) the target itself is
 * returned. Pass an array (eg. using {@link arrFrom}) to use the same path on every runtime.
 * @since 0.9.1
 * @group Value
 * @param target - The source object that contains the value
 * @param iter - The iter identifying the path of the final key value
 * @param defValue - If the final value or any intervening object in the heirarchy is not present
 * the default value will be returned
 * @returns The value located based on the path or the defaule value
 * @throws TypeError when the iter's `[Symbol.iterator]` isn't `null`, `undefined` or a function, its
 * `[Symbol.iterator]()` doesn't return an iterator, the iterator's `next()` returns a value which is not an object, or
 * (like `for...of`) when it stops early (an intervening value is not present) and the iterator's `return()` doesn't
 * return an object
 * @example
 * ```ts
 * let theValue = {
 *   Hello: {
 *      Darkness: {
 *          my: "old"
 *      }
 *   },
 *   friend: "I've",
 *   come: {
 *      to: {
 *          see: "you"
 *      }
 *   }
 * };
 *
 * let value = getValueByIter(theValue, ["Hello", "Darkness", "my"], "friend");
 * // value === "old"
 *
 * let value = getValueByIter(theValue, ["My", "Old"], "friend");
 * // value === "friend"
 *
 * let value = getValueByIter(theValue, ["come", "to"], "friend");
 * // value === { see: "you" }
 *
 * let value = getValueByIter(theValue, ["friend"], "friend");
 * // value === "I've"
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function getValueByIter<V, T extends object = any>(target: T, iter: Iterator<string> | Iterable<string>, defValue?: V): V {
    if (!iter || !target) {
        return defValue;
    }

    iterForOf(iter, (value) => {
        if (isNullOrUndefined(target)) {
            return -1;
        }

        target = (target as any)[value];
    });

    return (!isNullOrUndefined(target) ? target : defValue) as V;
}

/**
 * Set the named value on the target object where the path may be presented by a string which
 * contains "." characters to separate the nested objects of the heirarchy / path to the value.
 *
 * For safety, this helper blocks setting any path that includes unsafe keys (`__proto__`,
 * `constructor`, or `prototype`) and will also stop if the traversal reaches an unsafe target
 * such as a built-in prototype object, without writing the final value. A missing (`null` or
 * `undefined`) value of the path is replaced by a new object, as is (since 0.20.0) an inherited
 * function (eg. the `hasOwnProperty` of an object or a method of a class), which is added as an own
 * property of the target, so the path sets the target's own properties rather than changing an
 * inherited (eg. built-in) function, eg. `"hasOwnProperty.call"` sets the target's own
 * `hasOwnProperty` to `{ call: value }`. Any objects which were added for the path are removed
 * again when the value is not set (unless one was passed to an inherited setter). Since 0.20.0 the parts of the
 * path are set with {@link setValueByIter}, so they have the same checks and the added objects are
 * removed in the same way (an empty part, eg. the second part of `"a..b"`, is still used as a key).
 * @since 0.9.1
 * @group Value
 * @param target - The target object
 * @param path - The path identifying the location of the final key value
 * @param value - The value to set
 * @example
 * ```ts
 * let theValue = { };
 * setValueByKey(theValue, "Hello.Darkness.my", "old");
 * // Resulting Object: { Hello: { Darkness: { my: "old" } } }
 * setValueByKey(theValue, "friend", "I've");
 * // Resulting Object: { Hello: { Darkness: { my: "old" } }, friend: "I've" }
 * setValueByKey(theValue, "come.to.see", "you");
 * // Resulting Object: { Hello: { Darkness: { my: "old" } }, friend: "I've", come: { to : { see: "you" } } }
 * ```
 */
export function setValueByKey<T>(target: any, path: string, value: T) {
    if (target && path) {
        // The parts of the path are set with the same checks (and the removal of any added objects) as setValueByIter
        setValueByIter(target, strSplit(path, "."), value);
    }
}

/**
 * Set the named value on the target object where the path is represented by the string iterator
 * or iterable to separate the nested objects of the heirarchy / path to the value.
 *
 * For safety, this helper blocks setting any path that includes unsafe keys (`__proto__`,
 * `constructor`, or `prototype`) and will also stop if the traversal reaches an unsafe target
 * such as a built-in prototype object, without writing the final value. A missing (`null` or
 * `undefined`) value of the path is replaced by a new object, as is (since 0.20.0) an inherited
 * function (eg. the `hasOwnProperty` of an object or a method of a class), which is added as an own
 * property of the target, so the path sets the target's own properties rather than changing an
 * inherited (eg. built-in) function, eg. `["hasOwnProperty", "call"]` sets the target's own
 * `hasOwnProperty` to `{ call: value }`. Each key is converted to a property key (a string, unless it's a symbol)
 * once, like a property access, before it is checked and used (except that a key which isn't a symbol but converts to
 * one, eg. a boxed `Symbol`, throws a TypeError). Any objects which were added for the
 * path are removed again (or the own `null` or `undefined` value they replaced is restored) when the
 * value is not set (unless one was passed to an inherited setter), including when the iterator (or
 * its `return()`, which like `for...of` must return an object) throws.
 *
 * The order of processing of the iterator is not reset if you add or remove elements to the iterator,
 * the actual behavior will depend on the iterator imeplementation.
 *
 * If the passed `iter` is both an Iterable<T> and Iterator<T>, like `for...of` (and {@link iterForOf}) the iterator
 * returned by its `[Symbol.iterator]()` is used.
 *
 * The path is read like {@link iterForOf}, so on a runtime without `Symbol.iterator` (eg. IE) an array, an iterator
 * (or an iterable created by this library) and a `Map` or `Set` are read, but a value which is only iterable where
 * there is `Symbol.iterator` (eg. an `arguments` object) has no keys, so nothing is set. Pass an array (eg. using
 * {@link arrFrom}) to use the same path on every runtime.
 * @since 0.9.1
 * @group Value
 * @param target - The target object
 * @param iter - The iter identifying the path of the final key value
 * @param value - The value to set
 * @throws TypeError when the iter's `[Symbol.iterator]` isn't `null`, `undefined` or a function, its
 * `[Symbol.iterator]()` doesn't return an iterator, the iterator's `next()` returns a value which is not an object, or
 * (like `for...of`) when it stops early (the path is not valid) and the iterator's `return()` doesn't return an object
 * @example
 * ```ts
 * let theValue = { };
 * setValueByIter(theValue, ["Hello", "Darkness", "my"], "old");
 * // Resulting Object: { Hello: { Darkness: { my: "old" } } }
 * setValueByIter(theValue, ["friend"], "I've");
 * // Resulting Object: { Hello: { Darkness: { my: "old" } }, friend: "I've" }
 * setValueByIter(theValue, ["come", "to", "see"], "you");
 * // Resulting Object: { Hello: { Darkness: { my: "old" } }, friend: "I've", come: { to : { see: "you" } } }
 * ```
 */
export function setValueByIter<T>(target: any, iter: Iterator<string> | Iterable<string>, value: T) {
    if (target && iter) {
        let lastKey: string | undefined;
        let isValidPath = true;
        let isSet = false;

        // The first object which is added for the path, where it was added and the null or undefined value it replaced
        let added: any;
        let addedTarget: any;
        let addedKey: any;
        let addedPrev: any;
        let addedIsOwn: boolean | undefined;

        try {
            iterForOf(iter, (theKey: string) => {
                // The key is converted to a property key (a string, unless it's a symbol) once, like a property access
                // does, so a key which converts to an unsafe key (eg. ["constructor"] or an object whose toString()
                // returns "constructor") is also blocked, and the converted key is the one which is used (a polyfill symbol
                // is an object, which is converted to its unique string key like a property access does)
                let key: string = isSymbol(theKey) ? theKey : asString(theKey);
                if (isUnsafeTarget(target) || isUnsafePropKey(key)) {
                    isValidPath = false;
                    return -1;
                }

                // The previous key wasn't the last one, so its value is the next target (a key which converts to an
                // empty string is also used, like a property access)
                if (lastKey !== UNDEF_VALUE) {
                    let next = target[lastKey];

                    // A missing value, or an inherited function (eg. the hasOwnProperty of an object or a method of a
                    // class), is replaced by an object which is added as an own property of the target, so the path sets
                    // the target's own properties rather than changing an inherited (eg. built-in) function. Any other
                    // inherited value (eg. the object returned by a getter of a class) is still used
                    if (isNullOrUndefined(next) || (isFunction(next) && !objHasOwn(target, lastKey))) {
                        // Add an empty object / map
                        let newValue = {};
                        if (!added) {
                            // Only the first added object is tracked, as any later objects are added to it, and this
                            // preserves any existing intermediate objects
                            added = newValue;
                            addedTarget = target;
                            addedKey = lastKey;
                            addedPrev = next;
                            addedIsOwn = objHasOwn(target, lastKey);
                        }

                        target[lastKey] = newValue;
                        next = target[lastKey];
                    }

                    if (isFunction(next) && !objHasOwn(target, lastKey)) {
                        // The added object didn't become an own property (eg. an inherited setter took it) and an
                        // inherited getter returned a function rather than it, which is not walked into
                        isValidPath = false;
                        return -1;
                    }

                    target = next;
                }

                lastKey = key;
            });

            // The last key is a string or (like the other keys) a symbol, it is only undefined when there were no keys
            if (isValidPath && !isUnsafeTarget(target) && lastKey !== UNDEF_VALUE && !isUnsafePropKey(lastKey)) {
                target[lastKey] = value;
                isSet = true;
            }
        } finally {
            // The first object which was added (and so any objects added to it) is removed when the value was not set,
            // because the path is not valid or something threw (eg. the iterator, its return() or a getter)
            if (!isSet && added) {
                try {
                    // Only the object which was added is removed, rather than a value which replaced it (eg. by a getter),
                    // and an own null or undefined value which it replaced is restored
                    if (addedTarget[addedKey] === added) {
                        if (addedIsOwn) {
                            addedTarget[addedKey] = addedPrev;
                        } else {
                            delete addedTarget[addedKey];
                        }
                    }
                } catch (e) {
                    // Ignore cleanup failures and preserve existing behavior.
                }
            }
        }
    }
}