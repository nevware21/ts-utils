/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

let _theTimeout: Function;

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
}

/**
 * Override the setTimeout function to call the override function instead of the `setTImeout`, if the value
 * of `overrideFn` is null or undefined it will revert back to the native `setTimeout`
 * @param overrideFn - The new setTimeout function to call instead of `setTimeout`
 *
 * @since 0.4.4
 * @group Timer
 */
export function setTimeoutOverride(overrideFn: <TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) => number) {
    _theTimeout = overrideFn || setTimeout;
}

/**
 * Sets a timer which executes a function or specified piece of code once the timer expires.
 * Same as `setTimeout` but provides a return object for cancelling and restarting (refresh) the timer.
 * 
 * The timer may be cancelled (cleared) by calling the `cancel()` function on the returned {@link ITimerHandler}, or
 * you can "reschedule" and/or "restart" the timer by calling the `refresh()` function on the returned {@link ITimerHandler}
 * instance
 *
 * @since 0.4.4
 * @group Timer
 *
 * @param callback - The function to be executed after the timer expires.
 * @param timeout - The time, in milliseconds that the timer should wait before the specified
 * function or code is executed. If this parameter is omitted, a value of 0 is used, meaning
 * execute "immediately", or more accurately, the next event cycle.
 * @param args - Additional arguments which are passed through to the function specified by `callback`.
 * @returns A {@link ITimerHandler} instance which can be used to cancel the timeout.
 * @example
 * ```ts
 * let timeoutCalled = false;
 * let theTimeout = scheduleTimeout(() => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // Instead of calling clearTimeout() with the returned value from setTimeout() the returned
 * // handler instance can be used instead to cancel the timer
 * theTimeout.cancel();
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theTimeout.refresh();
 * ```
 */
export function scheduleTimeout<A extends any[]>(callback: (...args: A) => void, timeout: number, ...args: A): ITimerHandler {
    let self = this;
    let theArguments = arguments;
    let timeoutId = (_theTimeout || setTimeout).apply(self, theArguments);

    return {
        cancel: function() {
            clearTimeout(timeoutId);
        },
        refresh: function() {
            clearTimeout(timeoutId);
            timeoutId = (_theTimeout || setTimeout).apply(self, theArguments);

            return this;
        }
    };
}
