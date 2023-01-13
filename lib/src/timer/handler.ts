/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

/**
 * A Timer handler which is returned from {@link scheduleTimeout} which contains functions to
 * cancel or restart (refresh) the timeout function.
 *
 * @since 0.4.4
 * @group Timer
 */
export interface ITimerHandler {
    /**
     * Cancels a timeout that was previously scheduled, after calling this function any previously
     * scheduled timer will not execute.
     * @example
     * ```ts
     * let theTimer = scheduleTimeout(...);
     * theTimer.cancel();
     * ```
     */
    cancel: () => void;

    /**
     * Reschedules the timer to call its callback at the previously specified duration
     * adjusted to the current time. This is useful for refreshing a timer without allocating
     * a new JavaScript object.
     *
     * Using this on a timer that has already called its callback will reactivate the timer.
     * Calling on a timer that has not yet executed will just reschedule the current timer.
     * @example
     * ```ts
     * let theTimer = scheduleTimeout(...);
     * // The timer will be restarted (if already executed) or rescheduled (if it has not yet executed)
     * theTimer.refresh();
     * ```
     */
    refresh: () => ITimerHandler;

    /**
     * When called, requests that the event loop not exit so long when the ITimerHandler is active.
     * Calling timer.ref() multiple times will have no effect. By default, all ITimerHandler objects
     * will create "ref'ed" instances, making it normally unnecessary to call timer.ref() unless
     * timer.unref() had been called previously.
     * @since 0.7.0
     * @returns the ITimerHandler instance
     * @example
     * ```ts
     * let theTimer = createTimeout(...);
     *
     * // Make sure the timer is referenced (the default) so that the runtime (Node) does not terminate
     * // if there is a waiting referenced timer.
     * theTimer.ref();
     * ```
     */
    ref(): this;

    /**
     * When called, the any active ITimerHandler instance will not require the event loop to remain
     * active (Node.js). If there is no other activity keeping the event loop running, the process may
     * exit before the ITimerHandler instance callback is invoked. Calling timer.unref() multiple times
     * will have no effect.
     * @since 0.7.0
     * @returns the ITimerHandler instance
     * @example
     * ```ts
     * let theTimer = createTimeout(...);
     *
     * // Unreference the timer so that the runtime (Node) may terminate if nothing else is running.
     * theTimer.unref();
     * ```
     */
    unref(): this;

    /**
     * If true, any running referenced `ITimerHandler` instance will keep the Node.js event loop active.
     * @since 0.7.0
     * @example
     * ```ts
     * let theTimer = createTimeout(...);
     *
     * // Unreference the timer so that the runtime (Node) may terminate if nothing else is running.
     * theTimer.unref();
     * let hasRef = theTimer.hasRef(); // false
     *
     * theTimer.ref();
     * hasRef = theTimer.hasRef(); // true
     * ```
     */
    hasRef(): boolean;
}

/**
 * @ignore
 * @internal
 * Internal function to create and manage an ITimerHandler implementation, the object returned from this function
 * it directly used / returned by the pulic functions used to create timers (idle, interval and timeout)
 * @param startTimer - Should the timer be started as part of creating the handler
 * @param refreshFn - The function used to create/start or refresh the timer
 * @param cancelFn - The function used to cancel the timer
 * @returns The new ITimerHandler instance
 */
export function _createTimerHandler<T>(startTimer: boolean, refreshFn: (timerId: T) => T, cancelFn: (timerId: T) => void): ITimerHandler {
    let ref = true;
    let timerId: T = startTimer ? refreshFn(null) : null;

    function _unref() {
        ref = false;
        timerId && timerId["unref"] && timerId["unref"]();
        return timer;
    }

    function _ref() {
        ref = true;
        timerId && timerId["ref"] && timerId["ref"]();
        return timer;
    }

    function _hasRef() {
        if (timerId && timerId["hasRef"]) {
            return timerId["hasRef"]();
        }
        return ref;
    }

    let timer: ITimerHandler = {
        cancel: function() {
            timerId && cancelFn(timerId);
            timerId = null;
        },
        refresh: function() {
            timerId = refreshFn(timerId);
            if (!ref) {
                _unref();
            }

            return timer;
        },
        hasRef: _hasRef,
        ref: _ref,
        unref: _unref
    };

    return timer;
}
