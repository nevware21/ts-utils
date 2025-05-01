/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnApply } from "../funcs/funcs";
import { isArray, isFunction } from "../helpers/base";
import { ArrSlice, CALL, UNDEF_VALUE } from "../internal/constants";
import { _getGlobalConfig } from "../internal/global";
import { ITimerHandler, _createTimerHandler } from "./handler";

// Package instance timeout override functions
let _setTimeoutFn: TimeoutOverrideFn | undefined;
let _clearTimeoutFn: ClearTimeoutOverrideFn | undefined;

function _resolveTimeoutFn(timeoutFn: TimeoutOverrideFn): TimeoutOverrideFn {
    let result = isFunction(timeoutFn) ? timeoutFn : _setTimeoutFn;
    if (!result) {
        // Get global timeout overrides if available
        let globalOverrides = _getGlobalConfig().tmOut || [];
        if (isArray(globalOverrides) && globalOverrides.length > 0 && isFunction(globalOverrides[0])) {
            result = (globalOverrides as TimeoutOverrideFuncs)[0];
        }
    }

    return result || setTimeout;
}

function _resolveClearTimeoutFn(timeoutFn: ClearTimeoutOverrideFn): ClearTimeoutOverrideFn {
    let result = isFunction(timeoutFn) ? timeoutFn : _clearTimeoutFn;
    if (!result) {
        // Get global timeout overrides if available
        let globalOverrides = _getGlobalConfig().tmOut || [];
        if (isArray(globalOverrides) && globalOverrides.length > 1 && isFunction(globalOverrides[1])) {
            result = (globalOverrides as TimeoutOverrideFuncs)[1];
        }
    }

    return result || clearTimeout;
}

function _createTimeoutWith(startTimer: boolean, overrideFn: TimeoutOverrideFn | TimeoutOverrideFuncs, theArgs: any[]): ITimerHandler {
    let isArr = isArray(overrideFn);
    let len = isArr ? overrideFn.length : 0;
    
    // Use package instance override functions if provided and no specific override was given
    // If no package overrides, try global overrides before falling back to native functions
    let setFn = _resolveTimeoutFn(len > 0 ? (overrideFn as TimeoutOverrideFuncs)[0] : (!isArr ? overrideFn as TimeoutOverrideFn: UNDEF_VALUE));
    let clearFn = _resolveClearTimeoutFn(len > 1 ? (overrideFn as TimeoutOverrideFuncs)[1] : UNDEF_VALUE);

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
 * Sets the setTimeout and clearTimeout override functions for this package/closure instance to be used by all timeout operations
 * when no specific override functions are provided. If called with no parameters or undefined,
 * it will reset both overrides to undefined, reverting to native implementations.
 *
 * @since 0.12.3
 * @group Timer
 *
 * @param overrideFn - setTimeout override function this will be called instead of the `setTimeout`, if the value
 * of `overrideFn` is null or undefined it will reset both setTimeout and clearTimeout to their native implementations.
 * May also be an array with both the setTimeout and clearTimeout override functions, if either is not provided the
 * default native functions will be used
 * @remarks
 * These override functions apply only to this package instance and do not affect the global setTimeout/clearTimeout functions
 * used elsewhere in your application.
 * @example
 * ```ts
 * // Override with a single function for setTimeout
 * // The native clearTimeout will still be used
 * function customSetTimeout<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
 *     console.log(`Setting timeout for ${ms}ms`);
 *     return setTimeout(callback, ms);
 * }
 *
 * // Set the timeout override function
 * setTimeoutOverrides(customSetTimeout);
 *
 * // Now all timeout operations will use the custom setTimeout
 * let timer = scheduleTimeout(() => {
 *     console.log("Timer triggered");
 * }, 100);
 *
 * // Reset to native implementations
 * setTimeoutOverrides(undefined);
 * ```
 * @example
 * ```ts
 * // Override both setTimeout and clearTimeout with custom implementations
 * function customSetTimeout<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
 *     console.log(`Setting timeout for ${ms}ms`);
 *     return setTimeout(callback, ms);
 * }
 *
 * function customClearTimeout(timeoutId: number) {
 *     console.log(`Clearing timeout ${timeoutId}`);
 *     return clearTimeout(timeoutId);
 * }
 *
 * // Set both override functions
 * setTimeoutOverrides([customSetTimeout, customClearTimeout]);
 *
 * // Now all timeout operations will use the custom implementations
 * let timer = scheduleTimeout(() => {
 *     console.log("Timer triggered");
 * }, 100);
 *
 * // This will use the custom clearTimeout
 * timer.cancel();
 *
 * // Reset to native implementations
 * setTimeoutOverrides();
 * ```
 */
export function setTimeoutOverrides(overrideFn?: TimeoutOverrideFn | TimeoutOverrideFuncs): void {
    let isArr = isArray(overrideFn);
    let len = isArr ? overrideFn.length : 0;
    
    _setTimeoutFn = (len > 0 ? (overrideFn as TimeoutOverrideFuncs)[0] : (!isArr ? overrideFn as TimeoutOverrideFn: UNDEF_VALUE));
    _clearTimeoutFn = (len > 1 ? (overrideFn as TimeoutOverrideFuncs)[1] : UNDEF_VALUE);
}

/**
 * Sets global timeout override functions that will be used as fallback by all timeout operations
 * when no specific or default package override functions are provided. If called with no parameters or
 * undefined, it will reset the global overrides to undefined.
 *
 * @since 0.12.3
 * @group Timer
 *
 * @param overrideFn - setTimeout override function this will be called instead of the `setTimeout`, if the value
 * of `overrideFn` is null or undefined it will reset the global overrides to undefined.
 * May also be an array with both the setTimeout and clearTimeout override functions, if either is not provided the
 * default native functions will be used
 * @remarks
 * The global timeout overrides serve as a fallback when no specific or package level overrides are provided.
 * The priority order for timeout functions is:
 * 1. Specific override provided to the individual function call for {@link scheduleTimeoutWith} or {@link createTimeoutWith}
 * 2. Package instance overrides set via {@link setTimeoutOverrides}
 * 3. Global overrides set via this function
 * 4. Native setTimeout/clearTimeout functions
 * @example
 * ```ts
 * // Override with global custom setTimeout and clearTimeout implementations
 * function customSetTimeout<TArgs extends any[]>(callback: (...args: TArgs) => void, ms?: number, ...args: TArgs) {
 *     console.log(`Global: Setting timeout for ${ms}ms`);
 *     return setTimeout(callback, ms);
 * }
 *
 * function customClearTimeout(timeoutId: number) {
 *     console.log(`Global: Clearing timeout ${timeoutId}`);
 *     return clearTimeout(timeoutId);
 * }
 *
 * // Set global override functions
 * setGlobalTimeoutOverrides([customSetTimeout, customClearTimeout]);
 *
 * // Now all timeout operations will use these global implementations when no other overrides are provided
 * let timer = scheduleTimeout(() => {
 *     console.log("Timer triggered");
 * }, 100);
 *
 * // Reset global overrides
 * setGlobalTimeoutOverrides();
 * ```
 */
export function setGlobalTimeoutOverrides(overrideFn?: TimeoutOverrideFn | TimeoutOverrideFuncs): void {
    let isArr = isArray(overrideFn);
    let len = isArr ? overrideFn.length : 0;
    
    let globalCfg = _getGlobalConfig();
    
    if (!overrideFn) {
        // If no override provided, reset the global overrides
        globalCfg.tmOut = undefined;
    } else {
        // Set the global timeout overrides
        globalCfg.tmOut = [
            (len > 0 ? (overrideFn as TimeoutOverrideFuncs)[0] : (!isArr ? overrideFn as TimeoutOverrideFn : null)),
            (len > 1 ? (overrideFn as TimeoutOverrideFuncs)[1] : null)
        ] as TimeoutOverrideFuncs;
    }
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
