/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnApply } from "../funcs/funcs";
import { isArray } from "../helpers/base";
import { ArrSlice, CALL, UNDEF_VALUE } from "../internal/constants";
import { ITimerHandler, _createTimerHandler } from "./handler";

function _createTimeoutWith(startTimer: boolean, overrideFn: TimeoutOverrideFn | TimeoutOverrideFuncs, theArgs: any[]): ITimerHandler {
    let isArr = isArray(overrideFn);
    let len = isArr ? overrideFn.length : 0;
    let setFn: TimeoutOverrideFn = (len > 0 ? (overrideFn as TimeoutOverrideFuncs)[0] : (!isArr ? overrideFn as TimeoutOverrideFn: UNDEF_VALUE)) || setTimeout;
    let clearFn: ClearTimeoutOverrideFn = (len > 1 ? (overrideFn as TimeoutOverrideFuncs)[1] : UNDEF_VALUE) || clearTimeout;

    let timerFn = theArgs[0];
    theArgs[0] = function () {
        handler.dn();
        fnApply(timerFn, UNDEF_VALUE, ArrSlice[CALL](arguments));
    };
    
    let handler = _createTimerHandler(startTimer, (timerId?: any) => {
        if (timerId) {
            if (timerId.refresh) {
                timerId.refresh();
                return timerId;
            }

            fnApply(clearFn, UNDEF_VALUE, [ timerId ]);
        }

        return fnApply(setFn, UNDEF_VALUE, theArgs);
    }, function (timerId: any) {
        fnApply(clearFn, UNDEF_VALUE, [ timerId ]);
    });

    return handler.h;
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
 * Creates and starts a timer which executes a function or specified piece of code once the timer expires, this is simular
 * to using `setTimeout` but provides a return object for cancelling and restarting (refresh) the timer.
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
 * theTimeout.enabled;    // false
 *
 * // You can start the timer via enabled
 * theTimeout.enabled = true;
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theTimeout.refresh();
 * ```
 */
export function scheduleTimeout<A extends any[]>(callback: (...args: A) => void, timeout: number, ...args: A): ITimerHandler;

/**
 * Creates and starts a timer which executes a function or specified piece of code once the timer expires, this is simular
 * to using `setTimeout` but provides a return object for cancelling and restarting (refresh) the timer.
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
 * theTimeout.enabled;    // false
 *
 * // You can start the timer via enabled
 * theTimeout.enabled = true;
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theTimeout.refresh();
 * ```
 */
export function scheduleTimeout<A extends any[]>(callback: (...args: A) => void, timeout: number): ITimerHandler {
    return _createTimeoutWith(true, UNDEF_VALUE, ArrSlice[CALL](arguments));
}

/**
 * Creates and starts a timer which executes a function or specified piece of code once the timer expires. The overrideFn will be
 * used to create the timer, this is simular to using `setTimeout` but provides a return object for cancelling and restarting
 * (refresh) the timer.
 *
 * The timer may be cancelled (cleared) by calling the `cancel()` function on the returned {@link ITimerHandler}, or
 * you can "reschedule" and/or "restart" the timer by calling the `refresh()` function on the returned {@link ITimerHandler}
 * instance
 *
 * @since 0.4.4
 * @group Timer
 *
 * @param overrideFn - setTimeout override function this will be called instead of the `setTimeout`, if the value
 * of `overrideFn` is null or undefined it will revert back to the native `setTimeout`. May also be an array with contains
 * both the setTimeout and clearTimeout override functions, if either is not provided the default native functions will be used
 * @param callback - The function to be executed after the timer expires.
 * @param timeout - The time, in milliseconds that the timer should wait before the specified
 * function or code is executed. If this parameter is omitted, a value of 0 is used, meaning
 * execute "immediately", or more accurately, the next event cycle.
 * @param args - Additional arguments which are passed through to the function specified by `callback`.
 * @returns A {@link ITimerHandler} instance which can be used to cancel the timeout.
 * @example
 * ```ts
 * let timeoutCalled = false;
 * // Your own "setTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newSetTimeoutFn(callback: TimeoutOverrideFn) {
 *     overrideCalled ++;
 *     return setTimeout(callback, timeout);
 * }
 *
 * let theTimeout = scheduleTimeoutWith(newSetTimeoutFn, () => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // Instead of calling clearTimeout() with the returned value from setTimeout() the returned
 * // handler instance can be used instead to cancel the timer
 * theTimeout.cancel();
 * theTimeout.enabled;    // false
 *
 * // You can start the timer via enabled
 * theTimeout.enabled = true;
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theTimeout.refresh();
 * ```
 * @example
 * ```ts
 * let timeoutCalled = false;
 * // Your own "setTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newSetTimeoutFn(callback: TimeoutOverrideFn) {
 *     overrideCalled ++;
 *     return setTimeout(callback, timeout);
 * }
 *
 * // Your own "clearTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newClearTimeoutFn(timeoutId: number) {
 *     overrideCalled ++;
 *     return clearTimeout( timeout);
 * }
 *
 * let theTimeout = scheduleTimeoutWith([newSetTimeoutFn, newClearTimeoutFn], () => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // Instead of calling clearTimeout() with the returned value from setTimeout() the returned
 * // handler instance can be used instead to cancel the timer, internally this will call the newClearTimeoutFn
 * theTimeout.cancel();
 * theTimeout.enabled;    // false
 *
 * // You can start the timer via enabled
 * theTimeout.enabled = true;
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theTimeout.refresh();
 * ```
 */
export function scheduleTimeoutWith<A extends any[]>(overrideFn: TimeoutOverrideFn | TimeoutOverrideFuncs, callback: (...args: A) => void, timeout: number, ...args: A): ITimerHandler;

/**
 * Creates and starts a timer which executes a function or specified piece of code once the timer expires. The overrideFn will be
 * used to create the timer, this is simular to using `setTimeout` but provides a return object for cancelling and restarting
 * (refresh) the timer.
 *
 * The timer may be cancelled (cleared) by calling the `cancel()` function on the returned {@link ITimerHandler}, or
 * you can "reschedule" and/or "restart" the timer by calling the `refresh()` function on the returned {@link ITimerHandler}
 * instance
 *
 * @since 0.4.4
 * @group Timer
 *
 * @param overrideFn - setTimeout override function this will be called instead of the `setTimeout`, if the value
 * of `overrideFn` is null or undefined it will revert back to the native `setTimeout`. May also be an array with contains
 * both the setTimeout and clearTimeout override functions, if either is not provided the default native functions will be used
 * @param callback - The function to be executed after the timer expires.
 * @param timeout - The time, in milliseconds that the timer should wait before the specified
 * function or code is executed. If this parameter is omitted, a value of 0 is used, meaning
 * execute "immediately", or more accurately, the next event cycle.
 * @param args - Additional arguments which are passed through to the function specified by `callback`.
 * @returns A {@link ITimerHandler} instance which can be used to cancel the timeout.
 * @example
 * ```ts
 * let timeoutCalled = false;
 * // Your own "setTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newSetTimeoutFn(callback: TimeoutOverrideFn) {
 *     overrideCalled ++;
 *     return setTimeout(callback, timeout);
 * }
 *
 * let theTimeout = scheduleTimeoutWith(newSetTimeoutFn, () => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // Instead of calling clearTimeout() with the returned value from setTimeout() the returned
 * // handler instance can be used instead to cancel the timer
 * theTimeout.cancel();
 * theTimeout.enabled;    // false
 *
 * // You can start the timer via enabled
 * theTimeout.enabled = true;
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theTimeout.refresh();
 * ```
 * @example
 * ```ts
 * let timeoutCalled = false;
 * // Your own "setTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newSetTimeoutFn(callback: TimeoutOverrideFn) {
 *     overrideCalled ++;
 *     return setTimeout(callback, timeout);
 * }
 *
 * // Your own "clearTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newClearTimeoutFn(timeoutId: number) {
 *     overrideCalled ++;
 *     return clearTimeout( timeout);
 * }
 *
 * let theTimeout = scheduleTimeoutWith([newSetTimeoutFn, newClearTimeoutFn], () => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // Instead of calling clearTimeout() with the returned value from setTimeout() the returned
 * // handler instance can be used instead to cancel the timer, internally this will call the newClearTimeoutFn
 * theTimeout.cancel();
 * theTimeout.enabled;    // false
 *
 * // You can start the timer via enabled
 * theTimeout.enabled = true;
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theTimeout.refresh();
 * ```
 */
export function scheduleTimeoutWith<A extends any[]>(overrideFn: TimeoutOverrideFn | TimeoutOverrideFuncs, callback: (...args: A) => void, timeout: number): ITimerHandler {
    return _createTimeoutWith(true, overrideFn, ArrSlice[CALL](arguments, 1));
}

/**
 * Creates a non-running (paused) timer which will execute a function or specified piece of code when enabled and the timer expires,
 * this is simular to using `scheduleTimeout` but the timer is not enabled (running) and you MUST call `refresh` to start the timer.
 *
 * The timer may be cancelled (cleared) by calling the `cancel()` function on the returned {@link ITimerHandler}, or
 * you can "reschedule" and/or "restart" the timer by calling the `refresh()` function on the returned {@link ITimerHandler}
 * instance
 *
 * @since 0.7.0
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
 * let theTimeout = createTimeout(() => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // As the timer is not started you will need to call "refresh" to start the timer
 * theTimeout.refresh();
 *
 * // or set enabled to true
 * theTimeout.enabled = true;
 * ```
 */
export function createTimeout<A extends any[]>(callback: (...args: A) => void, timeout: number, ...args: A): ITimerHandler;

/**
 * Creates a non-running (paused) timer which will execute a function or specified piece of code when enabled and the timer expires,
 * this is simular to using `scheduleTimeout` but the timer is not enabled (running) and you MUST call `refresh` to start the timer.
 *
 * The timer may be cancelled (cleared) by calling the `cancel()` function on the returned {@link ITimerHandler}, or
 * you can "reschedule" and/or "restart" the timer by calling the `refresh()` function on the returned {@link ITimerHandler}
 * instance
 *
 * @since 0.7.0
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
 * let theTimeout = createTimeout(() => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // As the timer is not started you will need to call "refresh" to start the timer
 * theTimeout.refresh();
 *
 * // or set enabled to true
 * theTimeout.enabled = true;
 * ```
 */
export function createTimeout<A extends any[]>(callback: (...args: A) => void, timeout: number): ITimerHandler {
    return _createTimeoutWith(false, UNDEF_VALUE, ArrSlice[CALL](arguments));
}

/**
 * Creates a non-running (paused) timer which will execute a function or specified piece of code when enabled once the timer expires.
 * The overrideFn will be used to create the timer, this is simular to using `scheduleTimeoutWith` but the timer is not enabled (running)
 * and you MUST call `refresh` to start the timer.
 *
 * The timer may be cancelled (cleared) by calling the `cancel()` function on the returned {@link ITimerHandler}, or
 * you can "reschedule" and/or "restart" the timer by calling the `refresh()` function on the returned {@link ITimerHandler}
 * instance
 *
 * @since 0.7.0
 * @group Timer
 *
 * @param overrideFn - setTimeout override function this will be called instead of the `setTimeout`, if the value
 * of `overrideFn` is null or undefined it will revert back to the native `setTimeout`. May also be an array with contains
 * both the setTimeout and clearTimeout override functions, if either is not provided the default native functions will be used
 * @param callback - The function to be executed after the timer expires.
 * @param timeout - The time, in milliseconds that the timer should wait before the specified
 * function or code is executed. If this parameter is omitted, a value of 0 is used, meaning
 * execute "immediately", or more accurately, the next event cycle.
 * @param args - Additional arguments which are passed through to the function specified by `callback`.
 * @returns A {@link ITimerHandler} instance which can be used to cancel the timeout.
 * @example
 * ```ts
 * let timeoutCalled = false;
 * // Your own "setTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newSetTimeoutFn(callback: TimeoutOverrideFn) {
 *     overrideCalled ++;
 *     return setTimeout(callback, timeout);
 * }
 *
 * let theTimeout = createTimeoutWith(newSetTimeoutFn, () => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // As the timer is not started you will need to call "refresh" to start the timer
 * theTimeout.refresh();
 *
 * // or set enabled to true
 * theTimeout.enabled = true;
 * ```
 * @example
 * ```ts
 * let timeoutCalled = false;
 * // Your own "setTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newSetTimeoutFn(callback: TimeoutOverrideFn) {
 *     overrideCalled ++;
 *     return setTimeout(callback, timeout);
 * }
 *
 * // Your own "clearTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newClearTimeoutFn(timeoutId: number) {
 *     overrideCalled ++;
 *     return clearTimeout( timeout);
 * }
 *
 * let theTimeout = createTimeoutWith([newSetTimeoutFn, newClearTimeoutFn], () => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // As the timer is not started you will need to call "refresh" to start the timer
 * theTimeout.refresh();
 *
 * // or set enabled to true
 * theTimeout.enabled = true;
 * ```
 */
export function createTimeoutWith<A extends any[]>(overrideFn: TimeoutOverrideFn | TimeoutOverrideFuncs, callback: (...args: A) => void, timeout: number, ...args: A): ITimerHandler;

/**
 * Creates a non-running (paused) timer which will execute a function or specified piece of code when enabled once the timer expires.
 * The overrideFn will be used to create the timer, this is simular to using `scheduleTimeoutWith` but the timer is not enabled (running)
 * and you MUST call `refresh` to start the timer.
 *
 * The timer may be cancelled (cleared) by calling the `cancel()` function on the returned {@link ITimerHandler}, or
 * you can "reschedule" and/or "restart" the timer by calling the `refresh()` function on the returned {@link ITimerHandler}
 * instance
 *
 * @since 0.7.0
 * @group Timer
 *
 * @param overrideFn - setTimeout override function this will be called instead of the `setTimeout`, if the value
 * of `overrideFn` is null or undefined it will revert back to the native `setTimeout`. May also be an array with contains
 * both the setTimeout and clearTimeout override functions, if either is not provided the default native functions will be used
 * @param callback - The function to be executed after the timer expires.
 * @param timeout - The time, in milliseconds that the timer should wait before the specified
 * function or code is executed. If this parameter is omitted, a value of 0 is used, meaning
 * execute "immediately", or more accurately, the next event cycle.
 * @param args - Additional arguments which are passed through to the function specified by `callback`.
 * @returns A {@link ITimerHandler} instance which can be used to cancel the timeout.
 * @example
 * ```ts
 * let timeoutCalled = false;
 * // Your own "setTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newSetTimeoutFn(callback: TimeoutOverrideFn) {
 *     overrideCalled ++;
 *     return setTimeout(callback, timeout);
 * }
 *
 * let theTimeout = createTimeoutWith(newSetTimeoutFn, () => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // As the timer is not started you will need to call "refresh" to start the timer
 * theTimeout.refresh();
 *
 * // or set enabled to true
 * theTimeout.enabled = true;
 * ```
 * @example
 * ```ts
 * let timeoutCalled = false;
 * // Your own "setTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newSetTimeoutFn(callback: TimeoutOverrideFn) {
 *     overrideCalled ++;
 *     return setTimeout(callback, timeout);
 * }
 *
 * // Your own "clearTimeout" implementation to allow you to perform additional operations or possible wrap
 * // the callback to add timings.
 * function newClearTimeoutFn(timeoutId: number) {
 *     overrideCalled ++;
 *     return clearTimeout( timeout);
 * }
 *
 * let theTimeout = createTimeoutWith([newSetTimeoutFn, newClearTimeoutFn], () => {
 *     // This callback will be called after 100ms as this uses setTimeout()
 *     timeoutCalled = true;
 * }, 100);
 *
 * // As the timer is not started you will need to call "refresh" to start the timer
 * theTimeout.refresh();
 *
 * // or set enabled to true
 * theTimeout.enabled = true;
 * ```
 */
export function createTimeoutWith<A extends any[]>(overrideFn: TimeoutOverrideFn | TimeoutOverrideFuncs, callback: (...args: A) => void, timeout: number): ITimerHandler {
    return _createTimeoutWith(false, overrideFn, ArrSlice[CALL](arguments, 1));
}
