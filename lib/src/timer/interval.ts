/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { _extractArgs } from "../internal/extract_args";
import { ITimerHandler, _createTimerHandler } from "./handler";

/**
 * Repeatedly calls a function or executes a code snippet, with a fixed time delay between each call.
 *
 * @since 0.4.4
 * @group Timer
 *
 * @param callback - The function to be executed after the timer expires.
 * @param timeout - The time, in milliseconds that the timer should wait before the specified
 * function or code is executed. If this parameter is omitted, a value of 0 is used, meaning
 * execute "immediately", or more accurately, the next event cycle.
 * @param args - Additional arguments which are passed through to the function specified by `callback`.
 * @returns A {@link ITimerHandler} instance which can be used to cancel or refresh the interval.
 * @example
 * ```ts
 * let intervalCalled = 0;
 * let theIntervalTimer = scheduleInvertal(() => {
 *     // This callback will be called every 100ms as this uses setInterval()
 *     intervalCalled++;
 * }, 100);
 *
 * // Instead of calling clearInterval() with the returned value from setInterval() the returned
 * // handler instance can be used instead to cancel the timer
 * theIntervalTimer.cancel();
 *
 * // You can also "restart" the timer, whether it has previously triggered not not via the `refresh()`
 * theIntervalTimer.refresh();
 * ```
 */
export function scheduleInterval<A extends any[]>(callback: (...args: A) => void, timeout: number, ...args: A): ITimerHandler {
    let self = this;
    let theArguments = _extractArgs(arguments, 0);

    return _createTimerHandler(true, function (intervalId: any) {
        intervalId && clearInterval(intervalId);
        return setInterval.apply(self, theArguments);
    }, function (intervalId: any) {
        clearInterval(intervalId);
    });
}
