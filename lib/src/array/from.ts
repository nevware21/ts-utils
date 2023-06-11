/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { ArrCls } from "../internal/constants";
import { _unwrapFunction } from "../internal/unwrapFunction";
import { polyArrFrom } from "../polyfills/array";
import { ArrFromMapFn } from "./callbacks";

/**
 * Creates an new shallow-copied array from an array-like object or an iterable.
 * @since 0.9.7
 * @group ArrayLike
 * @group Array
 * @group Iterator
 * @typeParam T - Identifies the element type of the array-like or iterable.
 * @typeParam U - Identifies returned type of the array
 * @param theValue - An array-like object or iterable to convert to an array.
 * @param mapfn - A {@link ArrFromMapFn | mapping function} to call on every element of the array. If provided, every
 * value to be added to the array is first passed through this map function, and the return
 * value is added to the array instead. The function is called with the following arguments:
 * @param thisArg Value of 'this' used to invoke the mapfn.
 * @example
 * ```ts
 * arrFrom("Hello");
 * // [ "H", "e", "l", "l", "o" ]
 *
 * arrFrom(new Set(["Hello", "Darkness", "my", "old", "friend"]));
 * // ["Hello", "Darkness", "my", "old", "friend"]
 *
 * let map = new Map([
 *   [ 1, "Hello" ],
 *   [ 2, "Darkness" ],
 *   [ 3, "my" ],
 *   [ 4, "old" ],
 *   [ 5, "friend"]
 * ]);
 *
 * arrFrom(map.values());
 * // ["Hello", "Darkness", "my", "old", "friend"]
 *
 * arrFrom(map.keys());
 * // [ 1, 2, 3, 4, 5 ]
 *
 * arrFrom(map.entries());
 * // [ [ 1, "Hello" ], [ 2, "Darkness" ], [ 3, "my" ], [ 4, "old" ], [ 5, "friend"] ]
 *
 * // With a Mapping function
 * const map = new Map([
 *   [ 1, "Hello" ],
 *   [ 2, "Darkness" ],
 *   [ 3, "my" ],
 *   [ 4, "old" ],
 *   [ 5, "friend"]
 * ]);
 *
 * arrFrom(map, ([ key, value ]) => ({ [key]: value }));
 * // [ {"1": "Hello"}, {"2": "Darkness"}, {"3": "my"}, {"4": "old"}, {"5": "friend"} ]
 * ```
 */
export const arrFrom: <T, U = T>(theValue: ArrayLike<T> | Iterable<T>, mapFn?: ArrFromMapFn<T, U>, thisArg?: any) => U[] = ArrCls.from || polyArrFrom;
