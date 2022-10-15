/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { UNDEF_VALUE } from "../internal/constants";
import { _lazySafeGet } from "../internal/lazy_safe_check";
import { utcNow } from "./date";
import { getInst } from "./environment";
import { ILazyValue } from "./lazy";

let _perf: ILazyValue<Performance>

/**
 * Identify whether the runtimne contains a `performance` object
 *
 * @since 0.4.4
 * @group Environment
 * @returns
 */
export function hasPerformance(): boolean {
    return !!getPerformance();
}

/**
 * Returns the global `performance` Object if available, which can be used to
 * gather performance information about the current document. It serves as the
 * point of exposure for the Performance Timeline API, the High Resolution Time
 * API, the Navigation Timing API, the User Timing API, and the Resource Timing API.
 *
 * @since 0.4.4
 * @group Environment
 * @param useCached - [Optional] used for testing to bypass the cached lookup, when `true` this will
 * cause the cached global to be reset.
 * @returns The global performance object if available.
 */
export function getPerformance(useCached?: boolean): Performance {
    (!_perf || useCached === false) && (_perf = _lazySafeGet(() => performance || getInst("performance"), UNDEF_VALUE));
    return _perf.v;
}

/**
 * Returns the number of milliseconds that has elapsed since the time origin, if
 * the runtime does not support the `performance` API it will fallback to return
 * the number of milliseconds since the unix epoch.
 *
 * @since 0.4.4
 * @group Timer
 *
 * @returns The number of milliseconds as a `DOMHighResTimeStamp` double value or
 * an integer depending on the runtime.
 * @example
 * ```ts
 * let now = perfNow();
 * ```
 */
export function perfNow(): number {
    let perf = getPerformance();
    if (perf && perf.now) {
        return perf.now();
    }

    return utcNow();
}

/**
 * Return the number of milliseconds that have elapsed since the provided `startTime`
 * the `startTime` MUST be obtained from {@link perfNow} to ensure the correct elapsed
 * value is returned.
 *
 * @since 0.4.4
 * @group Timer
 *
 * @param startTime - The startTime obtained from `perfNow`
 * @returns The number of milliseconds that have elapsed since the startTime.
 * @example
 * ```ts
 * let start = perfNow();
 * // Do some work
 * let totalTime = elapsedTime(start);
 * ```
 */
export function elapsedTime(startTime: number): number {
    return perfNow() - startTime;
}