/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isUndefined } from "../helpers/base";
import { _getGlobalInstFn, getInst } from "../helpers/environment";
import { elapsedTime, perfNow } from "../helpers/perf";
import { ITimerHandler, _createTimerHandler } from "./handler";
import { scheduleTimeout } from "./timeout";

let _defaultIdleTimeout = 100;
let _maxExecutionTime = 50;

/**
 * Type that represents the global `requestIdleCallback` function, which can be used to
 * schedule work when there is free time in the event loop. Defined as a type alias for
 * easier reference and to support older TypeScript versions.
 * @since 0.11.2
 * @param callback - A callback function that should be called in the near future, when
 * the event loop is idle. The callback function is passed an [IdleDeadline](https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline)
 * object describing the amount of time available and whether or not the callback has
 * been run because the timeout period expired.
 * @param options - Contains optional configuration parameters. Currently only one property is defined:
 * - `timeout` If the number of milliseconds represented by this parameter has elapsed and the callback
 * has not already been called, then a task to execute the callback is queued in the event loop (even
 * if doing so risks causing a negative performance impact). timeout must be a positive value or it
 * is ignored.
 * @returns A handle which can be used to cancel the callback by passing it into the `cancelIdleCallback()` method.
 */
export type RequestIdleCallback = (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;

/**
 * Type that represents the global `cancelIdleCallback` function, which can be used to
 * cancel a previously scheduled idle callback. Defined as a type alias for easier reference
 * and to support older TypeScript versions.
 * @since 0.11.2
 * @param handle - The handle returned by the `requestIdleCallback` function that identifies
 * the idle callback to cancel.
 */
export type CancelIdleCallback = (handle: number) => void;

/**
 * Identifies if the runtime supports the `requestIdleCallback` API.
 *
 * @since 0.4.4
 * @group Timer
 * @group Idle
 * @group Environment
 *
 * @returns True if the runtime supports `requestIdleCallback` otherwise false.
 * @example
 * ```ts
 * let nativeIdleTimeouts = hasIdleCallback();
 * // true === idle timeouts are supported by the runtime otherwise false and the {@linke scheduleIdleCallback}
 * will use `setTimeout` instead.
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function hasIdleCallback(): boolean {
    return !!( /*#__PURE__*/getIdleCallback());
}

/**
 * Returns the global `requestIdleCallback` function if available, which can be used to
 * schedule work when there is free time in the event loop, or if the runtime does not
 * support the `requestIdleCallback` it will return `null`.
 * @since 0.11.2
 * @group Idle
 * @group Environment
 */
export const getIdleCallback = (/*#__PURE__*/_getGlobalInstFn<RequestIdleCallback>(getInst, ["requestIdleCallback"]));

/**
 * Returns the global `cancelIdleCallback` function if available, which can be used to
 * cancel a previously scheduled idle callback, or if the runtime does not support the
 * `cancelIdleCallback` it will return `null`.
 * @since 0.11.2
 * @group Idle
 * @group Environment
 */
export const getCancelIdleCallback = (/*#__PURE__*/_getGlobalInstFn<CancelIdleCallback>(getInst, ["cancelIdleCallback"]));

/**
 * Set the idle timeout fallback timeout which is used when the runtime does not support `requestIdleCallback`
 * the default idle timeout will be used for the scheduled timer. Defaults to 100ms
 *
 * @since 0.4.4
 * @group Timer
 *
 * @param timeout - The time in milliseconds that the timer should wait before calling the idle function.
 */
export function setDefaultIdleTimeout(timeout: number) {
    _defaultIdleTimeout = timeout;
}

/**
 * Set the idle timeout fallback simulated maximum execution time, used when the runtime doesn't
 * support `requestIdleTimeout` to simulate the [IdleDeadline](https://w3c.github.io/requestidlecallback/#dom-idledeadline)
 * `timeRemaining` value.
 * This value is used as the base time of the [IdleDeadline.timeRemaining](https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline/timeRemaining)
 * less the start time the callback was called. Defaults to 50ms.
 *
 * @since 0.4.4
 * @group Timer
 *
 * @param maxTime - The maximum execution time in milliseconds.
 */
export function setDefaultMaxExecutionTime(maxTime: number) {
    _maxExecutionTime = maxTime;
}

/**
 * Queues a function to be called during a browser's idle periods. This enables developers to
 * perform background and low priority work on the main event loop, without impacting latency-critical
 * events such as animation and input response. Functions are generally called in first-in-first-out
 * order; however, callbacks which have a timeout specified may be called out-of-order if necessary
 * in order to run them before the timeout elapses.
 *
 * You can call scheduledleCallback() within an idle callback function to schedule another callback to
 * take place no sooner than the next pass through the event loop.
 *
 * If the runtime does not support the [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
 * it will fallback to use `setTimeout` with either the provided timeout or the current default idle
 * timeout, which can be set via {@link setDefaultIdleTimeout}. It will always supply a deadline which
 * indicates that the request timed out.
 *
 * @since 0.4.4
 * @group Timer
 *
 * @param callback - A reference to a function that should be called in the near future, when the
 * event loop is idle. The callback function is passed an [IdleDeadline](https://w3c.github.io/requestidlecallback/#dom-idledeadline)
 * object describing the amount of time available and whether or not the callback has been run because
 * the timeout period expired.
 * @param options - Contains optional configuration parameters. Currently only one property is defined:
 * `timeout` If the number of milliseconds represented by this parameter has elapsed and the callback
 * has not already been called, then a task to execute the callback is queued in the event loop (even
 * if doing so risks causing a negative performance impact). timeout must be a positive value or it
 * is ignored.
 * @returns A handle which can be used to cancel the callback by passing it into the `cancelIdleCallback()`
 * method.
 * @example
 * ```ts
 * let idleCalled = false;
 * let idleTimedOut = false;
 * let theIdleTimer = scheduleIdleCallback((idleDeadline: IdleDeadline) => {
 *     // This callback will be called when the system is idle (via requestIdleCallback) or after the provided timeout 100ms
 *     idleCalled = true;
 *     idleTimedOut = idleDeadline?.didTimeout;
 *     while ((idleDeadline.timeRemaining() > 0 || deadline.didTimeout)) {
 *         // Do some background operations while there is time remaining or we timed out
 *         // Unlike interval timers this callback will NOT be called again unless you call "refresh"
 *         // to restart it or create a new idle timer
 *     }
 * }, 100);
 *
 * // Instead of calling cancelIdleCallback() with the returned value from requestIdleCallback() the returned
 * // handler instance can be used instead to cancel the idle timer
 * theIdleTimer.cancel();
 * theIdleTimer.enabled;    // false
 *
 * // You can start the timer via enabled
 * theIdleTimer.enabled = true;
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theIdleTimer.refresh();
 * ```
 */
export function scheduleIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): ITimerHandler {
    function _createDeadline(timedOut: boolean) {
        let startTime = perfNow();
        return {
            didTimeout: timedOut,
            timeRemaining: () => {
                return _maxExecutionTime - elapsedTime(startTime);
            }
        };
    }

    if (hasIdleCallback()) {
        let handler = _createTimerHandler(true, (idleId: number) => {
            idleId && getCancelIdleCallback()(idleId);
            return getIdleCallback()((deadline: IdleDeadline) => {
                handler.dn();
                callback(deadline || _createDeadline(false));
            }, options);
        }, (idleId: number) => {
            getCancelIdleCallback()(idleId);
        });

        return handler.h;
    }

    let timeout = (options || {}).timeout;
    if (isUndefined(timeout)) {
        timeout = _defaultIdleTimeout;
    }
    
    return scheduleTimeout(() => {
        callback(_createDeadline(true));
    }, timeout);
}
