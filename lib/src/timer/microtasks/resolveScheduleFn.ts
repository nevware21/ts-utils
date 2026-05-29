/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictUndefined } from "../../helpers/base";
import { ScheduleMicrotaskFn } from "../../helpers/types";
import { _getPromiseQueueFn } from "./promiseQueue";
import { _eTaskQueueType } from "./taskQueue";

/**
 * @internal
 * Shared fallback scheduler options shape used by timer helpers.
 * @since 0.15.0
 */
export interface _IFallbackScheduleOptions {
    scheduleFn?: ScheduleMicrotaskFn;
    useTimeout?: boolean;
}

/**
 * @internal
 * Resolve a fallback schedule function from per-call and default options.
 * The per-call options take precedence over default options.
 * @since 0.15.0
 */
export function _resolveScheduleFn(options: _IFallbackScheduleOptions | undefined, defaultOptions: _IFallbackScheduleOptions | undefined, taskQueueType: _eTaskQueueType): ScheduleMicrotaskFn | undefined {
    let resolvedFn = (options && options.scheduleFn) || (defaultOptions && defaultOptions.scheduleFn);
    if (!resolvedFn) {
        // Per-call options.useTimeout takes full precedence over the global default when it is
        // explicitly provided (even as false), so only fall back to defaultOptions when the per-call
        // value is undefined/absent. usePromise is the inverse: true unless useTimeout is explicitly set.
        let usePromise = !((options && !isStrictUndefined(options.useTimeout))
            ? options.useTimeout
            : (defaultOptions && defaultOptions.useTimeout));
        if (usePromise) {
            // Use the Promise based fallback if available, otherwise use setTimeout
            resolvedFn = _getPromiseQueueFn(taskQueueType);
        }
    }

    return resolvedFn;
}
