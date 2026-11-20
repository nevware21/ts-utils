/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isFunction } from "../../helpers/base";
import { createCachedValue, ICachedValue } from "../../helpers/cache";
import { getInst } from "../../helpers/environment";
import { _initTestHooks } from "../../helpers/lazy";
import { ScheduleMicrotaskFn } from "../../helpers/types";
import { UNDEF_VALUE } from "../../internal/constants";
import { _eTaskQueueType, _getRunnerQueueFn, _IQueueRunner, _resetRunner } from "./taskQueue";

let _promiseCls: ICachedValue<PromiseConstructor | undefined>;
const _promiseRunner: _IQueueRunner<PromiseConstructor> = {
    r: (promiseCls, flushFn) => {
        promiseCls.resolve().then(flushFn);
    }
};

/**
 * @internal
 * Returns the Promise-based microtask scheduler, re-resolving the global Promise when the lazy
 * bypass flag is active (e.g. during tests) so that changes to the global Promise are reflected.
 * @since 0.15.0
 */
export function _getPromiseQueueFn(queueType: _eTaskQueueType): ScheduleMicrotaskFn | undefined {
    if (_initTestHooks().lzy || !_promiseCls) {
        let promClass = getInst<PromiseConstructor>("Promise");
        if (promClass && isFunction(promClass.resolve)) {
            _promiseCls = createCachedValue(promClass);
            _promiseRunner.f = UNDEF_VALUE;
        } else {
            // Clear stale Promise cache when Promise is unavailable or invalid so callers can
            // reliably fall back to timer-backed scheduling.
            _promiseCls = UNDEF_VALUE;
            _resetRunner(_promiseRunner);
        }
    }

    // The Promise class is only cached when it's available
    return _promiseCls ? _getRunnerQueueFn(_promiseRunner, _promiseCls.v, queueType) : UNDEF_VALUE;
}

