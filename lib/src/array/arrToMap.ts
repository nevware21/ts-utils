/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArrayLike } from "../helpers/base";
import { isUnsafePropKey } from "../object/isUnsafePropKey";
import { iterForOf } from "../iterator/forOf";
import { ArrToMapKeySelectorFn, ArrToMapValueSelectorFn } from "../iterator/types";
import { arrForEach } from "./forEach";

/**
 * Creates an object map from array-like, iterator or iterable values.
 *
 * Keys are generated in stable source order via `keySelector`; later duplicate keys overwrite earlier values.
 * Unsafe keys (`__proto__`, `constructor`, `prototype`) are ignored.
 * @since 0.15.0
 * @group Array
 * @example
 * ```ts
 * const users = [
 *   { id: "u1", name: "Ada" },
 *   { id: "u2", name: "Lin" },
 *   { id: "u1", name: "Ada Updated" }
 * ];
 *
 * arrToMap(users, (value) => value.id, (value) => value.name);
 * // { u1: "Ada Updated", u2: "Lin" }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function arrToMap<T>(values: ArrayLike<T> | Iterator<T> | Iterable<T>, keySelector: ArrToMapKeySelectorFn<T>): { [key: string]: T };
/*#__NO_SIDE_EFFECTS__*/
export function arrToMap<T, V>(values: ArrayLike<T> | Iterator<T> | Iterable<T>, keySelector: ArrToMapKeySelectorFn<T>, valueSelector: ArrToMapValueSelectorFn<T, V>): { [key: string]: V };
/*#__NO_SIDE_EFFECTS__*/
export function arrToMap<T, V = T>(values: ArrayLike<T> | Iterator<T> | Iterable<T>, keySelector: ArrToMapKeySelectorFn<T>, valueSelector?: ArrToMapValueSelectorFn<T, V>): { [key: string]: V } {
    let result: { [key: string]: V } = {};

    function _processValue(value: T, index?: number) {
        let valueIndex = index || 0;
        let key = keySelector(value, valueIndex);
        let keyValue = key + "";
        if (!isUnsafePropKey(keyValue)) {
            result[keyValue] = valueSelector ? valueSelector(value, valueIndex) : (value as any as V);
        }
    }

    if (isArrayLike(values)) {
        arrForEach(values, _processValue);
    } else {
        iterForOf(values as Iterator<T> | Iterable<T>, _processValue);
    }


    return result;
}
