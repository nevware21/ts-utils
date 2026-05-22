/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictUndefined } from "../helpers/base";
import { _getGlobalInstFn, getInst } from "../helpers/environment";
import { ITimerHandler, _TimerHandler, _createTimerHandler } from "./handler";
import { _getPromiseMicrotaskFn } from "./microtasks/promiseMicrotask";
import { _addMicrotaskToQueue } from "./microtasks/timerMicrotask";

let _defaultOptions: MicroTaskOptions | undefined;

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
 */
export type ScheduleMicrotaskFn = (callback: MicrotaskFn) => void;

/**
 * Controls how `scheduleMicrotask` chooses fallback behavior when native
 * `queueMicrotask` is not available.
 *
 * @since 0.15.0
 * @group Timer
 */
export interface MicroTaskOptions {
    /**
     * Provide a custom scheduling function to use when native `queueMicrotask` is unavailable.
     * When specified, this takes precedence over both the Promise fallback and the timer-backed
     * queue fallback, regardless of whether Promise support is available.
     */
    scheduleFn?: ScheduleMicrotaskFn;

    /**
     * When `true`, skips the Promise fallback and uses `scheduleTimeout(..., 0)` instead. When
     * `scheduleFn` is not provided, this option controls whether to use `scheduleTimeout(..., 0)`
     * as the fallback instead of `Promise.resolve().then(...)`.
     * A per-call value of `false` explicitly opts back in to the Promise fallback even when the global
     * default set via {@link setMicroTaskFallbackOptions} has `useTimeout: true`.
     */
    useTimeout?: boolean;
}

/**
 * Returns the global `queueMicrotask` function if available, or `null` when unavailable.
 *
 * @function
 * @since 0.15.0
 * @group Timer
 * @group Environment
 * @example
 * ```ts
 * const queueFn = getQueueMicrotask();
 * if (queueFn) {
 *     queueFn(() => {
 *         console.log("microtask");
 *     });
 * }
 * ```
 */
export const getQueueMicrotask = (/*#__PURE__*/_getGlobalInstFn<ScheduleMicrotaskFn>(getInst as any, ["queueMicrotask"]));

/**
 * Identifies if the runtime supports the `queueMicrotask` API.
 *
 * @since 0.15.0
 * @group Timer
 * @group Environment
 * @returns True if the runtime supports `queueMicrotask` otherwise false.
 * @example
 * ```ts
 * if (hasQueueMicrotask()) {
 *     console.log("Native queueMicrotask support is available");
 * }
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasQueueMicrotask(): boolean {
    return !!( /*#__PURE__*/getQueueMicrotask());
}

/**
 * Sets the default fallback behavior for {@link scheduleMicrotask} when
 * `queueMicrotask` is not available.
 *
 * @since 0.15.0
 * @group Timer
 *
 * @param options - The fallback options to apply. Passing `undefined` resets
 * options to defaults.
 * @example
 * ```ts
 * setMicroTaskFallbackOptions({
 *     useTimeout: true
 * });
 *
 * scheduleMicrotask(() => {
 *     console.log("timer-backed microtask fallback");
 * });
 *
 * setMicroTaskFallbackOptions();
 * ```
 */
export function setMicroTaskFallbackOptions(options?: MicroTaskOptions): void {
    _defaultOptions = options;
}

/**
 * Schedules a callback to run in the microtask queue.
 *
 * It uses the native `queueMicrotask` when available, otherwise falls back to
 * `Promise.resolve().then(...)`, and if `Promise` is unavailable it falls back to
 * `scheduleTimeout(..., 0)`.
 * Unlike standard microtasks, this helper returns a cancellable `ITimerHandler`
 * so scheduled callbacks can be canceled before execution.
 * This provides consistent microtask scheduling behavior across all supported runtimes,
 * including Node.js, browsers, and web workers.
 *
 * @since 0.15.0
 * @group Timer
 *
 * @param callback - The callback to execute.
 * @param options - Optional per-call fallback options when `queueMicrotask` is unavailable.
 * @returns A handler that can be used to cancel or refresh the scheduled callback.
 * @example
 * ```ts
 * let order: string[] = [];
 * order.push("sync");
 *
 * const handler = scheduleMicrotask(() => {
 *     order.push("microtask");
 * });
 *
 * scheduleTimeout(() => {
 *     order.push("timeout");
 * }, 0);
 *
 * // order becomes ["sync", "microtask", "timeout"]
 * handler.enabled; // true until the microtask executes
 * ```
 * @example
 * ```ts
 * scheduleMicrotask(() => {
 *     console.log("custom fallback scheduler");
 * }, {
 *     scheduleFn: (cb) => {
 *         setTimeout(cb, 0);
 *     }
 * });
 * ```
 */
export function scheduleMicrotask(callback: () => void, options?: MicroTaskOptions): ITimerHandler {
    let scheduleFn: ScheduleMicrotaskFn | undefined;
    let queueMicrotaskFn = getQueueMicrotask();

    if (!queueMicrotaskFn) {
        // Do we have a custom schedule function to use
        scheduleFn = (options && options.scheduleFn) || (_defaultOptions && _defaultOptions.scheduleFn);
        if (!scheduleFn) {
            // Per-call options.useTimeout takes full precedence over the global default when it is
            // explicitly provided (even as false), so only fall back to _defaultOptions when the per-call
            // value is undefined/absent. usePromise is the inverse: true unless useTimeout is explicitly set.
            let usePromise = !((options && !isStrictUndefined(options.useTimeout))
                ? options.useTimeout
                : (_defaultOptions && _defaultOptions.useTimeout));
            if (usePromise) {
                // Use the Promise based fallback if available, otherwise use setTimeout
                queueMicrotaskFn = _getPromiseMicrotaskFn();
            }
        }
    }

    return _createCancellableMicroTask(callback, scheduleFn || queueMicrotaskFn || _addMicrotaskToQueue);
}

/**
 * @internal
 * @since 0.15.0
 */
function _createCancellableMicroTask(callback: () => void, queueFn: ScheduleMicrotaskFn): ITimerHandler {
    let handler: _TimerHandler;
    // Used to track the currently scheduled task, incremented to cancel pending tasks when needed
    let currentTask = 0;

    function _scheduleTask() {
        let taskId = ++currentTask;
        queueFn(() => {
            if (taskId === currentTask) {
                handler.dn();
                callback();
            }
        });

        return taskId;
    }

    function _cancelTask(taskId: number) {
        if (taskId === currentTask) {
            currentTask++;
        }
    }

    handler = _createTimerHandler(false, _scheduleTask, _cancelTask);
    // Start the timer only after handler is fully assigned so that any synchronous
    // queueFn implementation that fires the callback immediately can safely access handler.dn().
    handler.h.refresh();

    return handler.h;
}
