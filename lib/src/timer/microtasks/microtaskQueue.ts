/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { getQueueMicrotask } from "../../helpers/environment";
import { ScheduleMicrotaskFn } from "../../helpers/types";
import { UNDEF_VALUE } from "../../internal/constants";
import { _eTaskQueueType, _getRunnerQueueFn, _IQueueRunner, _resetRunner } from "./taskQueue";

const _microtaskRunner: _IQueueRunner<ScheduleMicrotaskFn> = {
    r: (microtaskFn, flushFn) => {
        microtaskFn(flushFn);
    }
};

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
    let queueFn = getQueueMicrotask();

    return queueFn ? _getRunnerQueueFn(_microtaskRunner, queueFn, queueType) : UNDEF_VALUE;
}

/**
 * @internal
 * Reset helper for tests.
 * @since 0.15.0
 */
export function _resetMicrotaskQueueFns(): void {
    _resetRunner(_microtaskRunner);
}

