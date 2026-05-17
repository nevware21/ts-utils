/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isNullOrUndefined, isStrictNullOrUndefined } from "./base";
import { strSplit } from "../string/split";
import { iterForOf } from "../iterator/forOf";
import { isUnsafeTarget } from "../object/isUnsafeTarget";
import { isUnsafePropKey } from "../object/isUnsafePropKey";

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
 * // value === "my"
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
    let cnt = parts.length;

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
 * If the passed `iter` is both an Iterable<T> and Iterator<T> the Iterator<T> interface takes preceedence.
 * @since 0.9.1
 * @group Value
 * @param target - The source object that contains the value
 * @param iter - The iter identifying the path of the final key value
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
 * let value = getValueByKey(theValue, ["Hello", "Darkness", "my"], "friend");
 * // value === "my"
 *
 * let value = getValueByKey(theValue, ["My", "Old"], "friend");
 * // value === "friend"
 *
 * let value = getValueByKey(theValue, ["come", "to"], "friend");
 * // value === { see: "you" }
 *
 * let value = getValueByKey(theValue, ["friend"], "friend");
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
 * such as a built-in prototype object, without writing the final value.
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
        let parts = strSplit(path, ".");
        let lastKey = parts.pop();
        let isValidPath = true;
        let addedTarget: any;
        let addedKey: string | undefined;
    
        arrForEach(parts, (key) => {
            if (isUnsafeTarget(target) || isUnsafePropKey(key)) {
                isValidPath = false;
                return -1;
            }

            if (isNullOrUndefined(target[key])) {
                // Add an empty object / map
                target[key] = {};

                if (!addedTarget) {
                    // Track the first added target and key for cleanup if we end up with an invalid path
                    // We only track the first added key as if the path is invalid we know we won't have
                    // written any further keys and this allows us to preserve any existing intermediate
                    // objects that may have been present on the target.
                    addedTarget = target;
                    addedKey = key;
                }
            }
    
            target = target[key];
        });

        if (isValidPath && !isStrictNullOrUndefined(lastKey) && !isUnsafeTarget(target) && !isUnsafePropKey(lastKey)) {
            target[lastKey] = value;
        } else if (addedTarget) {
            try {
                delete addedTarget[addedKey as any];
            } catch (e) {
                // Ignore cleanup failures and preserve existing behavior.
            }
        }
    }
}

/**
 * Set the named value on the target object where the path is represented by the string iterator
 * or iterable to separate the nested objects of the heirarchy / path to the value.
 *
 * For safety, this helper blocks setting any path that includes unsafe keys (`__proto__`,
 * `constructor`, or `prototype`) and will also stop if the traversal reaches an unsafe target
 * such as a built-in prototype object, without writing the final value.
 *
 * The order of processing of the iterator is not reset if you add or remove elements to the iterator,
 * the actual behavior will depend on the iterator imeplementation.
 *
 * If the passed `iter` is both an Iterable<T> and Iterator<T> the Iterator<T> interface takes preceedence.
 * @since 0.9.1
 * @group Value
 * @param target - The target object
 * @param iter - The iter identifying the path of the final key value
 * @param value - The value to set
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
        let firstAddedTarget: any;
        let firstAddedKey: string | undefined;
    
        iterForOf(iter, (key: string) => {
            if (isUnsafeTarget(target) || isUnsafePropKey(key)) {
                isValidPath = false;
                return -1;
            }

            if (lastKey) {
                if (isNullOrUndefined(target[lastKey])) {
                    // Add an empty object / map
                    target[lastKey] = {};

                    if (isNullOrUndefined(firstAddedTarget)) {
                        firstAddedTarget = target;
                        firstAddedKey = lastKey;
                    }
                }
        
                target = target[lastKey];
            }

            lastKey = key;
        });

        if (isValidPath && !isUnsafeTarget(target) && typeof lastKey === "string" && !isUnsafePropKey(lastKey)) {
            target[lastKey] = value;
        } else if (!isNullOrUndefined(firstAddedTarget) && typeof firstAddedKey === "string") {
            try {
                delete firstAddedTarget[firstAddedKey];
            } catch (e) {
                // Ignore cleanup failures and preserve existing behavior.
            }
        }
    }
}