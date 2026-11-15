/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isStrictNullOrUndefined } from "../helpers/base";
import { throwTypeError } from "../helpers/throw";

/**
 * Throws a TypeError if the provided object is null or undefined.
 * This is a utility function to ensure that the object is valid before performing operations on it.
 * @param obj - The object to check
 * @internal
 * @since 0.12.0
 */
export function _throwIfNullOrUndefined(obj: any): void {
    // Ensure we're working with an object
    if (isStrictNullOrUndefined(obj)) {
        throwTypeError("Cannot convert undefined or null to object");
    }
}
