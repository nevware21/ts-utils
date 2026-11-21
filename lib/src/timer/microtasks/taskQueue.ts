/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictUndefined } from "../../helpers/base";
import { throwRangeError } from "../../helpers/throw";
import { ScheduleMicrotaskFn } from "../../helpers/types";
import { LENGTH, UNDEF_VALUE } from "../../internal/constants";
import { _runMicroTask } from "./runMicrotask";

export const enum _eTaskQueueType {
    microtask = 0,
    nextTick = 1
}

/**
 * @internal
 * The state of a scheduler which flushes the task queues using an implementation (eg. queueMicrotask() or the
 * Promise class), so that only a single flush is pending at a time for each scheduler.
 */
export interface _IQueueRunner<K> {
    /**
     * Requests the flush (the callback) using the implementation
     */
    r: (impl: K, flushFn: () => void) => void;

    /**
     * Identifies whether a flush is pending
     */
    p?: boolean;

    /**
     * The implementation used by the pending flush
     */
    k?: K;

    /**
     * The (cached) schedule functions for each queue type
     */
    f?: { [key in _eTaskQueueType]?: ScheduleMicrotaskFn };
}

let _taskQueues: { [key in _eTaskQueueType]?: (() => void)[] } | undefined;

/**
 * The number of tasks which have been run from each queue while it is being flushed, the tasks which have run remain
 * in the queue until the flush completes, so only the remaining (pending) tasks are counted against the maximum
 */
let _runCount: number[] = [];

// Identifies the queues which are being flushed
let _flushing: boolean[] = [];

export function _flushQueues(): void {
    if (_taskQueues) {
        _taskQueues[_eTaskQueueType.nextTick] && _flushTaskQueue(_eTaskQueueType.nextTick);
        _taskQueues[_eTaskQueueType.microtask] && _flushTaskQueue(_eTaskQueueType.microtask);
    }
}

export function _flushTaskQueue(queueType: _eTaskQueueType): void {
    // Like native microtasks (which never run inside another microtask), a flush of a queue which is started while
    // that queue is being flushed (eg. by a ts-utils timer callback which a fake clock runs synchronously inside a task)
    // is ignored, as the outer flush continues with the remaining tasks (it would otherwise run the tasks which have
    // already run again)
    if (_taskQueues && !_flushing[queueType]) {
        _flushing[queueType] = true;
        try {
            let queue = _taskQueues[queueType];
            let queueIdx = 0;
            while (queue && queue[LENGTH] > queueIdx) {
                // Counted before the task runs, so a task which it schedules only counts the tasks which are still pending
                _runCount[queueType] = queueIdx + 1;
                _runMicroTask(queue[queueIdx++]);

                // Special case for microtask queue to ensure nextTick queue is flushed between each microtask callback
                if (queueType === _eTaskQueueType.microtask && _taskQueues[_eTaskQueueType.nextTick]) {
                    _flushTaskQueue(_eTaskQueueType.nextTick);
                }
            }

            _taskQueues[queueType] = UNDEF_VALUE;
            _runCount[queueType] = 0;
        } finally {
            _flushing[queueType] = false;
        }
    }
}


/**
 * @internal
 * Adds the callback to the queue, calling the addedFn (when provided) once it has been added.
 */
export function _addToQueue(queueType: _eTaskQueueType, callback: () => void, maxQueuedTasks?: number, addedFn?: () => void): boolean {
    let result = false;

    if (!_taskQueues) {
        _taskQueues = {};
    }

    let queue = _taskQueues[queueType];
    if (!queue) {
        queue = [];
        _taskQueues[queueType] = queue;
    }

    if (isStrictUndefined(maxQueuedTasks) || maxQueuedTasks === 0 || (queue[LENGTH] - (_runCount[queueType] || 0) < maxQueuedTasks)) {
        queue.push(callback);
        result = true;
        addedFn && addedFn();
    } else {
        throwRangeError(
            "schedule" + (queueType === _eTaskQueueType.microtask ? "Microtask" : "NextTick") + "() queue depth exceeded [" + maxQueuedTasks + "]"
        );
    }

    return result;
}

function _ensureRunner<K>(runner: _IQueueRunner<K>, impl: K): void {
    // If the implementation has changed (e.g. lazy bypass tests), the stale pending state is ignored
    // so a fresh batch can be scheduled with the current implementation.
    if (!runner.p || runner.k !== impl) {
        let flushFn = () => {
            runner.p = false;
            runner.k = UNDEF_VALUE;
            _flushQueues();
        };

        runner.p = true;
        runner.k = impl;
        try {
            runner.r(impl, flushFn);
        } catch (e) {
            flushFn();
        }
    }
}

/**
 * @internal
 * Returns the (cached) function which adds the callback to the queue and ensures that a flush is requested using
 * the runner's implementation, the function is cached for each queue type until the runner is reset.
 */
export function _getRunnerQueueFn<K>(runner: _IQueueRunner<K>, impl: K, queueType: _eTaskQueueType): ScheduleMicrotaskFn {
    let queueFns = runner.f || (runner.f = {});
    let result = queueFns[queueType];
    if (!result) {
        let addedFn = () => {
            _ensureRunner(runner, impl);
        };

        result = queueFns[queueType] = function(callback: () => void, maxQueuedTasks?: number): boolean {
            return _addToQueue(queueType, callback, maxQueuedTasks, addedFn);
        };
    }

    return result;
}

/**
 * @internal
 * Resets the runner, clearing the cached schedule functions and any pending state.
 */
export function _resetRunner<K>(runner: _IQueueRunner<K>): void {
    runner.f = runner.k = UNDEF_VALUE;
    runner.p = false;
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

    _runCount = [];
}