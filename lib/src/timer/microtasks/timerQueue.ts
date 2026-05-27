/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { UNDEF_VALUE } from "../../internal/constants";
import { _returnNothing } from "../../internal/stubs";
import { ITimerHandler } from "../handler";
import { _setMicrotaskCallback, scheduleTimeout } from "../timeout";
import { _addToQueue, _eTaskQueueType, _flushQueues } from "./taskQueue";

let _sharedTimer: ITimerHandler | undefined;
let _isFlushing = false;

function _doFlush() {
    try {
        _isFlushing = true;
        _flushQueues();
    } finally {
        _isFlushing = false;
    }
}

/**
 * @internal
 * Internal function to ensure the shared timer is set. If the timer is already set and not enabled it will be refreshed
 * to ensure it will pick up the new queue items when it flushes.
 */
function _ensureSharedTimer(): void {
    if (_isFlushing) {
        return;
    }

    _setMicrotaskCallback(_doFlush);

    let handler = _sharedTimer;
    if (!handler) {
        _sharedTimer = scheduleTimeout(_returnNothing, 0);
    } else if (!handler.enabled) {
        // Restart the timer if it's not already running, otherwise just let the current timer run
        // and it will pick up the new queue items when it flushes
        handler.refresh();
    }
}

/**
 * @internal
 * @since 0.15.0
 */
export function _addNextTickToQueue(callback: () => void, maxQueuedTasks?: number): boolean {
    return _addToQueueWithTimer(_eTaskQueueType.nextTick, callback, maxQueuedTasks);
}

/**
 * @internal
 * @since 0.15.0
 */
export function _addMicrotaskQueue(callback: () => void, maxQueuedTasks?: number): boolean {
    return _addToQueueWithTimer(_eTaskQueueType.microtask, callback, maxQueuedTasks);
}

function _addToQueueWithTimer(queueType: _eTaskQueueType, callback: () => void, maxQueuedTasks?: number): boolean {
    let result = _addToQueue(queueType, callback, maxQueuedTasks);
    if (result) {
        _ensureSharedTimer();
    }

    return result;
}


/**
 * @internal
 * Resets the internal shared timer. This is primarily intended for testing purposes to ensure a clean state between tests.
 * @since 0.15.0
 */
export function _resetSharedTimer(): void {
    if (_sharedTimer) {
        _sharedTimer.cancel();
        _sharedTimer = UNDEF_VALUE;
    }
}
