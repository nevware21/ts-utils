/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { arrForEach } from "../array/forEach";
import { isDefined, isNullOrUndefined } from "./base";
import { strSplit } from "../string/split";
import { iterForOf } from "../iterator/forOf";

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
export function getValueByKey<V, T extends object = any>(target: T, path: string, defValue?: V): V {
    if (!path || !target) {
        return defValue;
    }

    let parts = strSplit(path, ".");
    let cnt = parts.length;

    for (let lp = 0; lp < cnt && !isNullOrUndefined(target); lp++) {
        target = target[parts[lp]];
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
export function getValueByIter<V, T extends object = any>(target: T, iter: Iterator<string> | Iterable<string>, defValue?: V): V {
    if (!iter || !target) {
        return defValue;
    }

    iterForOf(iter, (value) => {
        if (isNullOrUndefined(target)) {
            return -1;
        }

        target = target[value];
    });

    return (!isNullOrUndefined(target) ? target : defValue) as V;
}

/**
 * Set the named value on the target object where the path may be presented by a string which
 * contains "." characters to separate the nested objects of the heirarchy / path to the value.
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
    
        arrForEach(parts, (key) => {
            if (isNullOrUndefined(target[key])) {
                // Add an empty object / map
                target[key] = {};
            }
    
            target = target[key];
        });
    
        target[lastKey] = value;
    }
}

/**
 * Set the named value on the target object where the path is represented by the string iterator
 * or iterable to separate the nested objects of the heirarchy / path to the value.
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
        let lastKey: string;
    
        iterForOf(iter, (key: string) => {
            if (lastKey) {
                if (isNullOrUndefined(target[lastKey])) {
                    // Add an empty object / map
                    target[lastKey] = {};
                }
        
                target = target[lastKey];
            }

            lastKey = key;
        });
    
        target[lastKey] = value;
    }
}