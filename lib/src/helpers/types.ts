/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/**
 * A readonly map-like object type alias.
 * @since 0.14.0
 * @group Helpers
 * @typeParam K - Identifies the key type.
 * @typeParam V - Identifies the value type.
 * @example
 * ```ts
 * const themes: ReadonlyRecord<string, string> = {
 *     light: "#ffffff",
 *     dark:  "#000000"
 * };
 *
 * // themes.light = "#ff0000";  // Error: cannot assign to a read-only property
 * ```
 */
export type ReadonlyRecord<K extends keyof any, V> = Readonly<Record<K, V>>;

/**
 * Represents a writable version of a type by removing readonly from top-level properties.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - The type to transform.
 * @example
 * ```ts
 * interface Point {
 *     readonly x: number;
 *     readonly y: number;
 * }
 *
 * function translate(p: Point, dx: number, dy: number): Point {
 *     const result = { ...p } as Mutable<Point>;
 *     result.x += dx; // OK — no longer readonly
 *     result.y += dy;
 *     return result;
 * }
 * ```
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P]
};

/**
 * Creates a union of all property values of a type.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - The type to extract values from.
 * @example
 * ```ts
 * const Direction = {
 *     Up:    "up",
 *     Down:  "down",
 *     Left:  "left",
 *     Right: "right"
 * } as const;
 *
 * type DirectionValue = ValueOf<typeof Direction>; // "up" | "down" | "left" | "right"
 *
 * function move(dir: DirectionValue) { }
 *
 * move("up");    // OK
 * move("north"); // Error: not assignable
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * Represents an array that must contain at least one element.
 * @since 0.14.0
 * @group Helpers
 * @typeParam T - Element type.
 * @example
 * ```ts
 * function first<T>(arr: NonEmptyArray<T>): T {
 *     return arr[0]; // safe — at least one element is always present
 * }
 *
 * first([1, 2, 3]); // OK
 * first([]);        // Error: not assignable to NonEmptyArray
 * ```
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Type alias for a microtask callback function, which is a function that is scheduled to run in the microtask
 * queue after the current execution context completes.
 * @since 0.15.0
 * @group Timer
 * @group Environment
 */
export type MicrotaskFn = () => void;

/**
 * Type alias for a function that is used to schedule a microtask, which is a function
 * that takes a callback and schedules it to run
 *
 * @since 0.15.0
 * @group Timer
 * @group Environment
 * @param callback - The microtask callback function to schedule.
 * @param maxQueuedTasks - Optional, the maximum number of queued tasks allowed before the scheduler
 * starts dropping tasks or throwing errors, depending on the implementation.
 */
export type ScheduleMicrotaskFn = (callback: MicrotaskFn, maxQueuedTasks?: number) => void | boolean;

/**
 * A generic interface for holding a cached value
 * @since 0.10.5
 * @group Helpers
 * @group Cache
 * @typeParam T - The type of the value to be cached
 * @example
 * ```ts
 * let cachedValue: ICachedValue<string> = {
 *    v: "some value"
 * };
 * ```
 */
export interface ICachedValue<T> {
    /**
     * Returns the current cached value
     */
    v: T,

    /**
     * Returns the current cached value
     */
    toJSON(): T;
}

/**
 * Interface of the object returned by the {@link getLazy} instance
 * @since 0.4.5
 * @group Lazy
 */
export interface ILazyValue<T> extends ICachedValue<T> {
    /**
     * Returns the current cached value from the lazy lookup, if the callback function has not yet occurred
     * accessing the value will cause the lazy evaluation to occur and the result will be returned.
     */
    v: T,

    /**
     * Identifies if this instance is bypassing the internal caching mechanism which is used for testing
     */
    b?: boolean
}

/**
 * The signature of the override timeout function used to create a new timeout instance, it follows the same signature as
 * the native `setTimeout` API.
 * @since 0.4.4
 * @group Timer
 * @param callback - A function to be executed after the timer expires.
 * @param ms - The time, in milliseconds that the timer should wait before the specified function or code is executed.
 * If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
 * @param args - Additional arguments which are passed through to the function specified by callback.
 * @return The returned timeoutID is a positive integer value which identifies the timer created by the call to setTimeout().
 * This value can be passed to clearTimeout() to cancel the timeout.
 */
export type TimeoutOverrideFn = <TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) => number | any;

/**
 * The signatire of the function to override clearing a previous timeout created with the {@link TimeoutOverrideFn}, it will be passed
 * the result returned from the {@link TimeoutOverrideFn} call.
 * @since 0.4.5
 * @group Timer
 * @param timeoutId - The value returned from the previous {@link TimeoutOverrideFn}.
 */
export type ClearTimeoutOverrideFn = (timeoutId: number | any) => void;

/**
 * Defines the array signature used to pass the override set and clean functions for creating a timeout.
 * The first index [0] is the set function to be used and the second index [1] is the clear function to be used.
 * @since 0.4.5
 * @group Timer
 */
export type TimeoutOverrideFuncs = [ TimeoutOverrideFn | null, ClearTimeoutOverrideFn | null ];

/**
 * The signature of an async generator function, this has the same shape as the `AsyncGeneratorFunction` provided by
 * TypeScript v3.6 and later, it is defined here so that the exported types can be used with earlier versions. The
 * results are `any` so a value of this type can be assigned to an `AsyncGeneratorFunction`.
 * @since 0.20.0
 * @group Type Identity
 */
export interface IAsyncGeneratorFunction {
    /**
     * Creates a new async generator object.
     * @param args - The arguments for the async generator function
     */
    new (...args: any[]): any;

    /**
     * Calls the async generator function and returns the new async generator object.
     * @param args - The arguments for the async generator function
     */
    (...args: any[]): any;

    /**
     * The number of arguments expected by the async generator function.
     */
    readonly length: number;

    /**
     * The name of the async generator function.
     */
    readonly name: string;

    /**
     * The prototype of the async generator objects created by the async generator function.
     */
    readonly prototype: any;
}
