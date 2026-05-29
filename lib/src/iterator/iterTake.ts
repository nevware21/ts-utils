/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { createIterableIterator } from "./create";
import { _asIterator, _doIteratorReturn } from "./helpers";
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
    let complete = false;

    function _complete(value?: T): T | undefined {
        if (!complete) {
            complete = true;
            return _doIteratorReturn(source, value);
        }

        return value;
    }

    return createIterableIterator<T>({
        n: function() {
            let isDone = true;

            if (!complete) {
                if (remaining <= 0) {
                    _complete();
                } else {
                    let next = source.next();
                    if (next.done) {
                        complete = true;
                    } else {
                        this.v = next.value;
                        remaining--;
                        if (remaining <= 0) {
                            _complete();
                        }

                        isDone = false;
                    }
                }
            }

            return isDone;
        },
        r: function(value?: T) {
            return _complete(value);
        }
    });
}
