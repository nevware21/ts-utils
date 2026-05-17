/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { __PROTO__, CONSTRUCTOR, PROTOTYPE } from "../internal/constants";

/**
 * Checks whether the supplied key is a known prototype pollution / object poisoning key.
 *
 * These keys are blocked by {@link forEachOwnKeySafe} to prevent assigning dangerous
 * values that can mutate object prototypes or constructor behavior.
 * @since 0.14.0
 * @group Object
 * @param key - The key to validate.
 * @returns `true` if the key is a dangerous key (`__proto__`, `constructor`, `prototype`), otherwise `false`.
 * @example
 * ```ts
 * isUnsafePropKey("__proto__");   // true
 * isUnsafePropKey("safeValue");   // false
 * ```
 */
/*#__NO_SIDE_EFFECTS__*/
export function isUnsafePropKey(key: PropertyKey): boolean {
    return key === __PROTO__ || key === CONSTRUCTOR || key === PROTOTYPE;
}
