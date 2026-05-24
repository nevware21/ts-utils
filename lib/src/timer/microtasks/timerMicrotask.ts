/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { UNDEF_VALUE } from "../../internal/constants";
import { ITimerHandler } from "../handler";
import { MicrotaskFn } from "../microtask";
import { _setMicrotaskCallback, scheduleTimeout } from "../timeout";
import { _runMicroTask } from "./runMicrotask";

let _microtaskQueue: MicrotaskFn[] | undefined;
let _microtaskTimer: ITimerHandler | undefined;

/**
 * @internal
 * @since 0.15.0
 */
function _flushMicrotaskQueue(): void {
    if (_microtaskTimer) {
        // Cancel the timeout used to trigger the microtask queue flush, if it exists. If this function
        // is being called as part of the timeout callback and the flush may have been called before this
        // timeout callback was executed, so we need to check if the timer is still active before canceling it.
        _microtaskTimer.cancel();
    }

    // Run all microtasks in the queue, if any are added while the flushing is being executed, they will be
    // appended to the end of the queue and will be flushed in this loop as well before the function exits,
    // this ensures that all microtasks are executed in the correct order even if new microtasks are scheduled
    // while flushing the queue.
    let queueIdx = 0;
    while (_microtaskQueue && _microtaskQueue.length > queueIdx) {
        _runMicroTask(_microtaskQueue[queueIdx++]);
    }

    // Now clear the queue to ensure that any new tasks scheduled after this point will be added to a new queue
    // and not executed in the current flush loop.
    _microtaskQueue = UNDEF_VALUE;
}

/**
 * @internal
 * @since 0.15.0
 */
export function _addMicrotaskToQueue(callback: () => void): void {
    if (!_microtaskQueue) {
        _microtaskQueue = [];
    }

    // Add the microtask callback to the queue, if the queue is currently being flushed and the callback is added
    // after the current index, it will be executed as part of the current flush loop, otherwise it will be executed
    // in the next flush loop when the queue is flushed again.
    _microtaskQueue.push(callback);

    if (!_microtaskTimer || !_microtaskTimer.enabled) {
        // Hook into the scheduleTimeout callback to flush the microtask queue, this is used as a
        // fallback when native queueMicrotask is not available.
        _setMicrotaskCallback(_flushMicrotaskQueue);

        // As there may not be any existing timers to flush the microtask queue, we need to schedule
        // a timeout to ensure the queue is flushed even if the user does not schedule any timeouts
        // themselves. If there is an existing timeout scheduled before the microtask callback is
        // flushed, the microtask queue will be flushed before this timeout callback is executed
        // as part of the timeout scheduling logic.
        if (!_microtaskTimer) {
            _microtaskTimer = scheduleTimeout(_flushMicrotaskQueue, 0);
        } else {
            // If there is already a timer scheduled, we can just ensure it is enabled to trigger the flush of the microtask queue
            // If we called refresh() and the timer was already active, it will reset (and reorder) the timer to trigger the flush
            // later than any existing timers, but this is necessary to ensure that the microtask queue is flushed in a future turn
            // of the event loop and not immediately.
            _microtaskTimer.enabled = true;
        }
    }
}

/**
 * @internal
 * Reset the timer-backed microtask queue state. Intended for tests that need a clean queue/timer instance.
 * @since 0.15.0
 */
export function _resetMicrotaskQueue(): void {
    if (_microtaskTimer) {
        _microtaskTimer.cancel();
        _microtaskTimer = UNDEF_VALUE;
    }

    _microtaskQueue = UNDEF_VALUE;
}

