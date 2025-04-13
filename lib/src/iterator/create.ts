/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { objDefine } from "../object/define";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";

/**
 * The context used to manage how the {@link createIterator} returns and moves to the next item,
 * and provides to the current value `v`.
 * @since 0.4.2
 * @group Iterator
 */
export interface CreateIteratorContext<T> {
    /**
     * A function that returns a boolean to indicate whether it was able to produce
     * the next value in the sequence. It should return `true` when the sequence is done.
     * @param args - Optional additional arguments that where passed to the iterator `next` function.
     * @return `false` if a new value was produced and assigned to the `v` of the context, otherwise
     * `true` to indicate that the sequence is done.
     */
    n: (...args: any) => boolean;

    /**
     * The current value to be assigned to the returned iterator result, the next `n`
     * function should assign this value to the context as part of incrementing to
     * the next value.
     */
    v?: T;

    /**
     * Optional function that accepts zero or one argument. This function is called via the
     * iterator `return` function when the iterator caller does not intend to make any more
     * `next()` calls so the implementation and can perform any cleanup actions.
     * @return [Optional] value to be included in the final iteration result
     */
    r?: (value?: T) => T | undefined;

    /**
     * A function that accepts zero or one argument. The function is called via the iterator
     * `throw` function when that the iterator caller detects an error condition, and e is
     * typically an Error instance.
     * @return [Optional] value to be included in the final iteration result
     */
    t?: (e?: any) => T | undefined;
}

/**
 * Create an iterable which conforms to the `Iterable` protocol, it uses the provided `ctx` to
 * create an `Iterator` via {@link createIterator}.
 *
 * @see [Iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)
 * @since 0.4.2
 * @group Iterator
 * @typeParam T - Identifies the type that will be returned by the iterator
 * @param ctx - The context used to manage the iteration over the items.
 * @returns A new Iterable instance
 * @example
 * ```ts
 * let current = 0;
 * let next = 1;
 * let done = false;
 * let fibCtx: CreateIteratorContext<number> = {
 *     n: function() {
 *         fibCtx.v = current;
 *         current = next;
 *         next = fibCtx.v + next;
 *
 *         // Return not done
 *         return false;
 *     },
 *     r: function(value) {
 *         done = true;
 *         return value;
 *     }
 * };
 *
 * let values: number[] = [];
 * iterForOf(createIterable(fibCtx), (value) => {
 *     values.push(value);
 *     if (values.length === 10) {
 *         return -1;
 *     }
 * });
 *
 * // Done is true
 * // done === true
 * // Values: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function createIterable<T>(ctx: CreateIteratorContext<T>): Iterable<T> {
    return makeIterable({} as Iterable<T>, ctx);
}

/**
 * Adds or replaces an iterable implementation that conforms to the `Iterable` protocol to the target instance, it
 * uses the provided `ctx` to create an `Iterator` via {@link createIterator}.
 *
 * @see [Iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)
 * @since 0.4.2
 * @group Iterator
 * @typeParam T - Identifies the target type
 * @typeParam I - Identifies the type that will be returned by the iterator
 * @param ctx - The context used to manage the iteration over the items.
 * @returns A new Iterable instance
 * @example
 * ```ts
 * let current = 0;
 * let next = 1;
 * let done = false;
 * let fibCtx: CreateIteratorContext<number> = {
 *     n: function() {
 *         fibCtx.v = current;
 *         current = next;
 *         next = fibCtx.v + next;
 *
 *         // Return not done, so it will just continue
 *         return false;
 *     }
 * };
 *
 * let values: number[] = [];
 * let theIterable: Iterable<T> = makeIterable({}, fibCtx);
 *
 * iterForOf(theIterable, (value) => {
 *     values.push(value);
 *     if (values.length === 10) {
 *         return -1;
 *     }
 * });
 *
 * // Values: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
 * ```
 */
export function makeIterable<T, I>(target: T, ctx: CreateIteratorContext<I>): T & Iterable<I> {
    let itSymbol = getKnownSymbol(WellKnownSymbols.iterator);

    function _createIterator() {
        return createIterator(ctx);
    }

    (target as any)[itSymbol] = _createIterator;

    return target as T & Iterable<I>;
}

/**
 * Create an iterator which conforms to the `Iterator` protocol, it uses the provided `ctx` to
 * managed moving to the `next`.
 *
 * @see [Iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol)
 * @since 0.4.2
 * @group Iterator
 * @typeParam T - Identifies the type that will be returned by the iterator
 * @param ctx - The context used to manage the iteration over the items.
 * @returns A new Iterator instance
 * @example
 * ```ts
 * let idx = -1;
 * let theValues = [ 5, 10, 15, 20, 25, 30 ];
 *
 * function getNextFn() {
 *     idx++;
 *     let isDone = idx >= theValues.length;
 *     if (!isDone) {
 *         // this is passed as the current iterator
 *         // so you can directly assign the next "value" that will be returned
 *         this.v = theValues[idx];
 *     }
 *
 *     return isDone;
 * }
 *
 * let theIterator = createIterator<number>({ n: getNextFn });
 *
 * let values: number[] = [];
 * iterForOf(theIterator, (value) => {
 *     values.push(value);
 * });
 *
 * // Values: [5, 10, 15, 20, 25, 30 ]
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function createIterator<T>(ctx: CreateIteratorContext<T>): Iterator<T> {
    let isDone = false;

    function _value(): T {
        return ctx.v;
    }

    function _next(): IteratorResult<T> {
        if (!isDone) {
            isDone = (ctx.n ? ctx.n(arguments) : true);
        }

        let result  = {
            done: isDone
        };

        if (!isDone) {
            objDefine<IteratorResult<T>>(result as any, "value", { g: _value });
        }

        return result as IteratorResult<T>;
    }

    function _return(value?: T): IteratorReturnResult<T> {
        isDone = true;
        return {
            done: true,
            value: ctx.r && ctx.r(value)
        };
    }

    function _throw(e?: any): IteratorResult<T> {
        isDone = true;
        return {
            done: true,
            value: ctx.t && ctx.t(e)
        };
    }

    let theIterator: Iterator<T> = {
        next: _next
    };
    
    if (ctx.r) {
        theIterator.return = _return;
    }

    if (ctx.t) {
        theIterator.throw = _throw;
    }

    return theIterator;
}
