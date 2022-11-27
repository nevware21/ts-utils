/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { LENGTH } from "../internal/constants";
import { objDefine } from "../object/define";
import { createIterator, CreateIteratorContext } from "./create";

/**
 * Create an iterator which is backed by the provided array, unlike a normal
 * array iterators where the array cannot be modified function creates
 * a shallow copy of the array using `slice()` so that you are free to modify
 * the original array.
 *
 * This will still return an iterator if the provided `values` is null or
 * undefined which will result in no entries.
 * @since 0.4.2
 * @group Iterator
 * @param values - The source array to create an iterator from
 * @returns A new iterator
 * @example
 * ```ts
 * let cnt = 0;
 * let values = [];
 * iterForOf(createArrayIterator([10, 20, 5, 15]), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * ```
 */
export function createArrayIterator<T>(values: T[]): Iterator<T> {
    let idx = -1;
    let theValues = values ? values.slice() : [];
    let len = theValues[LENGTH]

    function _value(): T {
        if (idx >= 0 && idx < len) {
            return theValues[idx];
        }
    }

    function _getNext() {
        idx++;
        return idx >= len;
    }

    let ctx: CreateIteratorContext<T> = {
        n: _getNext
    };

    objDefine(ctx, "v", { g: _value });

    return createIterator<T>(ctx);
}