/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _closeIter } from "./forOf";
import { _asIterator, _createIterHelper, _iterNext } from "./helpers";
import { mathFloor } from "../math/floor";

/**
 * Creates a lazy iterator that yields at most `count` values.
 * @since 0.15.0
 * @group Iterator
 * @example
 * ```ts
 * const firstThree = iterTake([10, 20, 30, 40, 50], 3);
 * iterToArray(firstThree); // [10, 20, 30]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function iterTake<T>(iter: Iterator<T> | Iterable<T>, count: number): IterableIterator<T> {
    let source = _asIterator(iter);
    let remaining = count > 0 ? mathFloor(count) : 0;

    return _createIterHelper<T, T>(source, (ctx) => {
        if (remaining <= 0) {
            // Like the native take() the source is closed when the count is reached
            _closeIter(source);
            return true;
        }

        // Like the native take() the result's done (and value) is only read once
        let next = _iterNext(source);
        if (next.done) {
            return true;
        }

        ctx.v = next.value;
        remaining--;
        return false;
    });
}
