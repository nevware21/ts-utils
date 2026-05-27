/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictUndefined } from "../../helpers/base";
import { throwRangeError } from "../../helpers/throw";
import { UNDEF_VALUE } from "../../internal/constants";
import { _runMicroTask } from "./runMicrotask";

export const enum _eTaskQueueType {
    microtask = 0,
    nextTick = 1
}

let _taskQueues: { [key in _eTaskQueueType]?: (() => void)[] } | undefined;

export function _flushQueues(): void {
    if (_taskQueues) {
        _taskQueues[_eTaskQueueType.nextTick] && _flushTaskQueue(_eTaskQueueType.nextTick);
        _taskQueues[_eTaskQueueType.microtask] && _flushTaskQueue(_eTaskQueueType.microtask);
    }
}

export function _flushTaskQueue(queueType: _eTaskQueueType): void {
    if (_taskQueues) {
        let queue = _taskQueues[queueType];
        let queueIdx = 0;
        while (queue && queue.length > queueIdx) {
            _runMicroTask(queue[queueIdx++]);

            // Special case for microtask queue to ensure nextTick queue is flushed between each microtask callback
            if (queueType === _eTaskQueueType.microtask && _taskQueues[_eTaskQueueType.nextTick]) {
                _flushTaskQueue(_eTaskQueueType.nextTick);
            }
        }

        _taskQueues[queueType] = UNDEF_VALUE;
    }
}


export function _addToQueue(queueType: _eTaskQueueType, callback: () => void, maxQueuedTasks?: number): boolean {
    let result = false;

    if (!_taskQueues) {
        _taskQueues = {};
    }

    let queue = _taskQueues[queueType];
    if (!queue) {
        queue = [];
        _taskQueues[queueType] = queue;
    }

    if (isStrictUndefined(maxQueuedTasks) || maxQueuedTasks === 0 || (queue.length < maxQueuedTasks)) {
        queue.push(callback);
        result = true;
    } else {
        throwRangeError(
            "schedule" + (queueType === _eTaskQueueType.microtask ? "Microtask" : "NextTick") + "() queue depth exceeded [" + maxQueuedTasks + "]"
        );
    }

    return result;
}


/**
 * @internal
 * Reset helper for tests.
 * @since 0.15.0
 */
export function _clearTaskQueues(): void {
    if (_taskQueues) {
        _taskQueues[_eTaskQueueType.nextTick] = UNDEF_VALUE;
        _taskQueues[_eTaskQueueType.microtask] = UNDEF_VALUE;
        _taskQueues = UNDEF_VALUE;
    }
}