/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

/**
 * Return the number of milliseconds that have elapsed since January 1, 1970 00:00:00 UTC.
 *
 * To offer protection against timing attacks and fingerprinting, the precision of dateNow()
 * might get rounded depending on browser settings. In Firefox, the privacy.reduceTimerPrecision
 * preference is enabled by default and defaults to 20µs in Firefox 59; in 60 it will be 2ms.
 *
 * @since 0.4.4
 * @group Timer
 *
 * @returns A Number representing the milliseconds elapsed since the UNIX epoch.
 * @example
 * ```ts
 * let now = utcNow();
 * ```
 */
export function utcNow() {
    return (Date.now || polyUtcNow)();
}

/**
 * Polyfill fallback to return the number of milliseconds that have elapsed since January 1, 1970 00:00:00 UTC.
 *
 * To offer protection against timing attacks and fingerprinting, the precision of dateNow()
 * might get rounded depending on browser settings. In Firefox, the privacy.reduceTimerPrecision
 * preference is enabled by default and defaults to 20µs in Firefox 59; in 60 it will be 2ms.
 *
 * @since 0.4.4
 * @group Timer
 * @group Polyfill
 *
 * @returns A Number representing the milliseconds elapsed since the UNIX epoch.
  * @example
 * ```ts
 * let now = polyUtcNow();
 * ```
*/
export function polyUtcNow() {
    return new Date().getTime();
}
