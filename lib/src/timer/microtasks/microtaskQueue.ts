/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { getQueueMicrotask } from "../../helpers/environment";
import { ScheduleMicrotaskFn } from "../../helpers/types";
import { _addToQueue, _eTaskQueueType, _flushQueues } from "./taskQueue";

let _microtaskPending = false;
let _pendingMicrotaskFn: ScheduleMicrotaskFn | undefined;
let _microtaskQueueFns: { [key in _eTaskQueueType]?: ScheduleMicrotaskFn } | undefined;

function _ensureMicrotask(microtaskFn: ScheduleMicrotaskFn): void {
    // If the microtask implementation has changed (e.g. lazy bypass tests), clear stale pending state
    // so a fresh microtask batch can be scheduled with the current implementation.
    if (_microtaskPending && _pendingMicrotaskFn !== microtaskFn) {
        _microtaskPending = false;
    }

    if (!_microtaskPending) {
        _microtaskPending = true;
        _pendingMicrotaskFn = microtaskFn;
        try {
            microtaskFn(() => {
                _microtaskPending = false;
                _pendingMicrotaskFn = undefined;
                _flushQueues();
            });
        } catch (e) {
            _microtaskPending = false;
            _pendingMicrotaskFn = undefined;
            _flushQueues();
        }
    }
}

function _microtaskScheduleFn(microtaskFn: ScheduleMicrotaskFn, queueType: _eTaskQueueType): ScheduleMicrotaskFn {
    return function(callback: () => void, maxQueuedTasks?: number): boolean {
        let added = _addToQueue(queueType, callback, maxQueuedTasks);
        if (added) {
            _ensureMicrotask(microtaskFn);
        }

        return added;
    };
}

/**
 * @internal
 * Returns the queueMicrotask-based scheduler, this is used to ensure that only a single queueMicrotask
 * is scheduled at a time for each queue type to avoid unnecessary multiple queueMicrotask calls when
 * multiple nextTick (or queueMicrotask) callbacks are scheduled within the same tick, this is important
 * when queueMicrotask is used as a fallback for process.nextTick to provide both more efficient scheduling
 * and more consistent behavior with the native process.nextTick which also batches callbacks.
 * @since 0.15.0
 */
export function _getMicrotaskQueueFn(queueType: _eTaskQueueType): ScheduleMicrotaskFn | undefined {
    let result: ScheduleMicrotaskFn | undefined;
    let queueFn = getQueueMicrotask();

    if (queueFn) {
        !_microtaskQueueFns && (_microtaskQueueFns = {});
        result = _microtaskQueueFns[queueType];
        if (!result) {
            result = _microtaskScheduleFn(queueFn, queueType);
            _microtaskQueueFns[queueType] = result;
        }
    }

    return result;
}

/**
 * @internal
 * Reset helper for tests.
 * @since 0.15.0
 */
export function _resetMicrotaskQueueFns(): void {
    _microtaskQueueFns = undefined;
    _microtaskPending = false;
    _pendingMicrotaskFn = undefined;
}

