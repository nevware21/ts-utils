/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { NULL_VALUE } from "../internal/constants";
import { objDefineProp } from "../object/define";

const REF = "ref";
const UNREF = "unref";
const HAS_REF = "hasRef";
const ENABLED = "enabled";

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
    cancel(): void;

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
    refresh(): ITimerHandler;

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

    /**
     * Gets or Sets a flag indicating if the underlying timer is currently enabled and running.
     * Setting the enabled flag to the same as it's current value has no effect, setting to `true`
     * when already `true` will not {@link ITimerHandler.refresh | refresh}() the timer.
     * And setting to `false` will {@link ITimerHandler.cancel | cancel}() the timer.
     * @since 0.8.1
     * @example
     * ```ts
     * let theTimer = createTimeout(...);
     *
     * // Check if enabled
     * theTimer.enabled; // false
     *
     * // Start the timer
     * theTimer.enabled = true;     // Same as calling refresh()
     * theTimer.enabled; //true
     *
     * // Has no effect as it's already running
     * theTimer.enabled = true;
     *
     * // Will refresh / restart the time
     * theTimer.refresh()
     *
     * let theTimer = scheduleTimeout(...);
     *
     * // Check if enabled
     * theTimer.enabled; // true
     * ```
     */
    enabled: boolean;
}

/**
 * @ignore
 * @internal
 */
export interface _TimerHandler {
    /**
     * The public handler to return to the caller
     */
    h: ITimerHandler,

    /**
     * The callback function that should be called when the timer operation
     * has completed and will not automatically rescheduled
     * @returns
     */
    dn: () => void
}

/**
 * @ignore
 * @internal
 * Internal function to create and manage an ITimerHandler implementation, the object returned from this function
 * it directly used / returned by the pulic functions used to create timers (idle, interval and timeout)
 * @param startTimer - Should the timer be started as part of creating the handler
 * @param refreshFn - The function used to create/start or refresh the timer
 * @param cancelFn - The function used to cancel the timer.
 * @returns The new ITimerHandler instance
 */
/*#__NO_SIDE_EFFECTS__*/
export function _createTimerHandler<T>(startTimer: boolean, refreshFn: (timerId: T) => T, cancelFn: (timerId: T) => void): _TimerHandler {
    let ref = true;
    let timerId: T = startTimer ? refreshFn(NULL_VALUE) : NULL_VALUE;
    let theTimerHandler: ITimerHandler;

    function _unref() {
        ref = false;
        timerId && timerId[UNREF] && timerId[UNREF]();
        return theTimerHandler;
    }

    function _cancel() {
        timerId && cancelFn(timerId);
        timerId = NULL_VALUE;
    }

    function _refresh() {
        timerId = refreshFn(timerId);
        if (!ref) {
            _unref();
        }

        return theTimerHandler;
    }

    function _setEnabled(value: boolean) {
        !value && timerId && _cancel();
        value && !timerId && _refresh();
    }

    theTimerHandler = {
        cancel: _cancel,
        refresh: _refresh
    } as any;

    theTimerHandler[HAS_REF] = () => {
        if (timerId && timerId[HAS_REF]) {
            return timerId[HAS_REF]();
        }

        return ref;
    };

    theTimerHandler[REF] = () => {
        ref = true;
        timerId && timerId[REF] && timerId[REF]();
        return theTimerHandler;
    };

    theTimerHandler[UNREF] = _unref;

    theTimerHandler = objDefineProp(theTimerHandler, ENABLED, {
        get: () => !!timerId,
        set: _setEnabled
    });

    return {
        h: theTimerHandler,
        dn: () => {
            timerId = NULL_VALUE;
        }
    };
}
