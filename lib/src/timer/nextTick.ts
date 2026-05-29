/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isArray, isFunction, isStrictUndefined } from "../helpers/base";
import { _getGlobalInstFn, getInst, getQueueMicrotask, isNode } from "../helpers/environment";
import { ITimerHandler } from "./handler";
import { _createCancellableTask } from "./microtasks/cancellableTask";
import { _getProcessNextTickFn } from "./microtasks/processNextTick";
import { _resolveScheduleFn } from "./microtasks/resolveScheduleFn";
import { _addNextTickToQueue } from "./microtasks/timerQueue";
import { _eTaskQueueType } from "./microtasks/taskQueue";
import { fnBindArgs } from "../funcs/fnBindArgs";
import { UNDEF_VALUE } from "../internal/constants";
import { MicrotaskFn, ScheduleMicrotaskFn } from "../helpers/types";
import { _getMicrotaskQueueFn } from "./microtasks/microtaskQueue";

const _defaultMaxQueuedTasks = 1000;

let _defaultOptions: NextTickOptions | undefined;

/**
 * Controls how `scheduleNextTick` chooses fallback behavior when native `process.nextTick` is not available.
 *
 * @since 0.15.0
 * @group Timer
 */
export interface NextTickOptions {
    /**
     * Provide a custom scheduling function to use when native `process.nextTick` is unavailable.
     * When specified, this takes precedence over both the Promise fallback and the timer-backed
     * queue fallback.
     */
    scheduleFn?: ScheduleMicrotaskFn;

    /**
     * When `true`, skips the Promise fallback and uses the timer-backed queue instead.
     * When omitted or `false`, `scheduleNextTick` prefers the Promise fallback before the timer fallback.
     */
    useTimeout?: boolean;

    /**
     * The maximum number of queued nextTick callbacks that may be pending at once when using the fallback queues.
     * When the limit is reached, scheduling throws a RangeError.
     */
    maxQueuedTasks?: number;
}

/**
 * Node-compatible `process.nextTick` function signature.
 *
 * Unlike {@link ScheduleMicrotaskFn}, this supports variadic callback arguments and always returns `void`.
 * @since 0.15.0
 * @group Timer
 * @group Environment
 */
export type ProcessNextTickFn = (callback: (...args: any[]) => void, ...args: any[]) => void;

/**
 * Sets the default fallback behavior for {@link scheduleNextTick} when
 * `process.nextTick` is not available.
 *
 * @since 0.15.0
 * @group Timer
 *
 * @param options - The fallback options to apply. Passing `undefined` resets
 * options to defaults.
 * @example
 * ```ts
 * setNextTickFallbackOptions({
 *     useTimeout: true
 * });
 *
 * scheduleNextTick(() => {
 *     console.log("timer-backed nextTick fallback");
 * });
 *
 * setNextTickFallbackOptions();
 * ```
 */
export function setNextTickFallbackOptions(options?: NextTickOptions): void {
    _defaultOptions = options;
}

/**
 * Returns the global `process.nextTick` function if available, otherwise `null`.
 *
 * The returned function matches the Node.js signature and supports variadic callback arguments.
 *
 * @function
 * @since 0.15.0
 * @group Timer
 * @group Environment
 * @example
 * ```ts
 * const nextTickFn = getProcessNextTick();
 * if (nextTickFn) {
 *     nextTickFn((value: string) => {
 *         console.log("process.nextTick", value);
 *     }, "works-with-args");
 * }
 * ```
 */
export const getProcessNextTick = (/*#__PURE__*/_getGlobalInstFn<ProcessNextTickFn | null>(() => {
    let processInst = getInst<any>("process");
    return isNode() && processInst && isFunction(processInst.nextTick) ? processInst.nextTick as ProcessNextTickFn : null;
}));

/**
 * Identifies if the runtime supports the `process.nextTick` API.
 *
 * @since 0.15.0
 * @group Timer
 * @group Environment
 * @returns True if the runtime supports `process.nextTick` otherwise false.
 * @example
 * ```ts
 * if (hasProcessNextTick()) {
 *     console.log("process.nextTick is available");
 * }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasProcessNextTick(): boolean {
    return !!getProcessNextTick();
}

/**
 * Schedules a callback to run using `process.nextTick` when available and otherwise uses
 * queueMicrotask, a Promise-based fallback or finally a timer-backed queue.
 *
 * When `scheduleFn` is provided, it is used before the Promise and timer-backed fallbacks, if
 * queueMicrotask is available it is used before all fallbacks.
 * When `useTimeout` is `true`, the timer-backed queue is used instead of the Promise fallback only
 * when native `process.nextTick` and `queueMicrotask` are unavailable.
 * `maxQueuedTasks` controls the fallback queue depth limit; when omitted the fallback queue uses
 * the default limit (set via `setNextTickFallbackOptions`) or a Node-compatible default of 1000.
 * Setting/passing `maxQueuedTasks` to `0` disables the limit (for fallbacks only, the native
 * `process.nextTick` is not affected by this limit).
 *
 * @since 0.15.0
 * @group Timer
 *
 * @param callback - The callback to execute.
 * @param args - Optional callback arguments to pass when the callback executes.
 * @param options - Optional fallback behavior when native `process.nextTick` is not available.
 * @returns A handler that can be used to cancel or refresh the scheduled callback.
 * @example
 * ```ts
 * scheduleNextTick(() => {
 *     console.log("nextTick callback");
 * });
 *
 * scheduleNextTick(() => {
 *     console.log("timer-backed nextTick");
 * }, {
 *     useTimeout: true
 * });
 *
 * scheduleNextTick(() => {
 *     console.log("custom nextTick fallback");
 * }, {
 *     scheduleFn: (cb) => {
 *         setTimeout(cb, 0);
 *     }
 * });
 * ```
 * @example
 * ```ts
 * // Args only
 * scheduleNextTick((name: string, count: number) => {
 *     console.log(name, count);
 * }, ["task", 1]);
 *
 * // Args + options
 * scheduleNextTick((name: string, count: number) => {
 *     console.log(name, count);
 * }, ["task", 2], {
 *     useTimeout: true
 * });
 * ```
 */
export function scheduleNextTick(callback: MicrotaskFn, options?: NextTickOptions): ITimerHandler;
export function scheduleNextTick<TArgs extends any[]>(callback: (...args: TArgs) => void, args: TArgs, options?: NextTickOptions): ITimerHandler;
export function scheduleNextTick<TArgs extends any[]>(callback: (...args: TArgs) => void, argsOrOptions?: TArgs | NextTickOptions, options?: NextTickOptions): ITimerHandler {
    let callbackArgs: TArgs | undefined;
    let theOptions: NextTickOptions | undefined;

    if (arguments.length > 1 && argsOrOptions && isArray(argsOrOptions)) {
        callbackArgs = argsOrOptions as TArgs;
        theOptions = options;
    } else {
        theOptions = argsOrOptions as NextTickOptions;
    }

    let taskCallback = callbackArgs ? fnBindArgs(callback, UNDEF_VALUE, callbackArgs) : (callback as MicrotaskFn);
    let nextTickFn = _getProcessNextTickFn() || _getMicrotaskQueueFn(_eTaskQueueType.nextTick);
    let maxQueuedTasks = (theOptions && !isStrictUndefined(theOptions.maxQueuedTasks))
        ? theOptions.maxQueuedTasks
        : ((_defaultOptions && !isStrictUndefined(_defaultOptions.maxQueuedTasks))
            ? _defaultOptions.maxQueuedTasks
            : _defaultMaxQueuedTasks);

    if (!nextTickFn) {
        nextTickFn = _resolveScheduleFn(theOptions, _defaultOptions, _eTaskQueueType.nextTick);
    }

    return _createCancellableTask(taskCallback, nextTickFn || _addNextTickToQueue, maxQueuedTasks);
}
