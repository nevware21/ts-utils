/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ITimerHandler, _TimerHandler, _createTimerHandler } from "../handler";
import { ScheduleMicrotaskFn } from "../microtask";

/**
 * @internal
 * @since 0.15.0
 */
export function _createCancellableTask(callback: () => void, queueFn: ScheduleMicrotaskFn, maxQueuedTasks?: number): ITimerHandler {
    let handler: _TimerHandler;
    let currentTask = 0;

    function _scheduleTask() {
        let taskId = ++currentTask;
        let queued = queueFn(() => {
            if (taskId === currentTask) {
                handler.dn();
                callback();
            }
        }, maxQueuedTasks);

        if (queued === false) {
            handler.dn();
        }

        return taskId;
    }

    function _cancelTask(taskId: number) {
        if (taskId === currentTask) {
            currentTask++;
        }
    }

    handler = _createTimerHandler(false, _scheduleTask, _cancelTask);
    // Start after handler assignment in case queueFn executes synchronously.
    handler.h.refresh();

    return handler.h;
}
