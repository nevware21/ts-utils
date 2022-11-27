/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined } from "../helpers/base";
import { UNDEF_VALUE } from "../internal/constants";
import { objDefine } from "../object/define";
import { createIterator, CreateIteratorContext } from "./create";

/**
 * Create a simple range iterator which will return an iterator that increments it's value from
 * `start` to `end` by the `step`.
 * - If `end` is omitted, null or undefined the value will be set to `start`
 * - If the `step` value is omitted, null, undefined or zero then it will default to 1 if end > start otherwise -1.
 *
 * @since 0.4.2
 * @group Iterator
 * @param start - The initial value of the numeric iterator
 * @param end - The inclusive maximum (or minimum when moving backwards) value of the iterator.
 * @param step - The step size for each iteration, may be positive or negative. Defaults to 1 when
 * start <= end and -1 when start > end. Zero is treated as not provided.
 * @returns A new iterator which will return a numeric value between start and end at step intervals
 * @example
 * ```ts
 * let cnt = 0;
 * iterForOf(createRangeIterator(0, -1, 1), (value) => {
 *     // Will never get called as -1 < 0
 * });
 *
 * cnt = 0;
 * let values: number[] = [];
 * iterForOf(createRangeIterator(1, 1), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * // cnt === 1
 * // values: [ 1 ]
 *
 * cnt = 0;
 * values = [];
 * iterForOf(createRangeIterator(10, null as any), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * // cnt === 1
 * // values: [ 10 ]
 *
 * cnt = 0;
 * values = [];
 * iterForOf(createRangeIterator(-10, undefined as any), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * // cnt === 1
 * // values: [ -10 ]
 *
 * cnt = 0;
 * values = [];
 * iterForOf(createRangeIterator(5, 20, 5), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * // cnt === 4
 * // values: [ 5, 10, 15, 20 ]
 *
 * cnt = 0;
 * values = [];
 * iterForOf(createRangeIterator(20, 5, -5), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * // cnt === 4
 * // values: [ 20, 15, 10, 5 ]
 *
 * cnt = 0;
 * values = [];
 * iterForOf(createRangeIterator(20, 15), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * // cnt === 6
 * // values: [ 20, 19, 18, 17, 16, 15 ]
 *
 * cnt = 0;
 * values = [];
 * iterForOf(createRangeIterator(-1, 1), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * // cnt === 3;
 * // values: [ -1, 0, 1 ]
 *
 * cnt = 0;
 * values = [];
 * iterForOf(createRangeIterator(1, -1), (value) => {
 *     cnt++;
 *     values.push(value);
 * });
 * // cnt === 3;
 * // values: [ 1, 0, -1 ]
 * ```
 */
export function createRangeIterator(start: number, end: number, step?: number): Iterator<number> {
    let nextValue = start;
    let theValue: number = UNDEF_VALUE;

    if (isNullOrUndefined(end)) {
        end = start;
    }

    let theStep = step || ((start <= end) ? 1 : -1);

    function _value(): number {
        return theValue;
    }

    function _getNext() {

        let isDone = false;
        if (theStep > 0) {
            isDone = nextValue > end;
        } else {
            isDone = nextValue < end;
        }

        if (!isDone) {
            theValue = nextValue;
            nextValue += theStep;
        }

        return isDone;
    }

    let ctx: CreateIteratorContext<number> = {
        n: _getNext
    };

    objDefine(ctx, "v", { g: _value });

    return createIterator<number>(ctx);
}