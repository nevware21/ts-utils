/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { MicrotaskFn } from "../../helpers/types";
import { scheduleTimeout } from "../timeout";

/**
 * @internal
 * Runs a microtask callback and ensures that any exceptions thrown are re-thrown in a new task to avoid swallowing errors.
 * This is necessary because when using the fallback for microtasks, any exceptions thrown in the callback will be caught
 * and not re-thrown, which can lead to silent failures. By catching exceptions and re-throwing them in a new task
 * (using `scheduleTimeout`), we ensure that errors are properly surfaced even when using the Promise or timeout fallback.
 * @since 0.15.0
 * @param callback - The callback to execute.
 */
export function _runMicroTask(callback: MicrotaskFn): void {
    try {
        if (callback) {
            callback();
        }
    } catch (e) {
        scheduleTimeout(() => {
            throw e;
        }, 0);
    }
}

