/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isNullOrUndefined } from "../helpers/base";
import { LENGTH } from "../internal/constants";
import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { asString } from "./as_string";
import { strEndsWith } from "./ends_with";
import { strStartsWith } from "./starts_with";
import { strSubstring } from "./substring";

/**
 * Wraps a value with a prefix and suffix.
 * @since 0.14.0
 * @group String
 * @group Conversion
 * @param value - The value to wrap.
 * @param prefix - The wrapper prefix value.
 * @param suffix - Optional wrapper suffix value. If omitted, prefix is used.
 * @returns The wrapped string.
 * @throws TypeError If value is null or undefined.
 */
/*#__NO_SIDE_EFFECTS__*/
export function strWrap(value: string, prefix: string, suffix?: string): string {
    _throwIfNullOrUndefined(value);
    
    return prefix + asString(value) + (isNullOrUndefined(suffix) ? prefix : suffix);
}

/**
 * Removes a single wrapping prefix / suffix pair if present.
 * @since 0.14.0
 * @group String
 * @group Conversion
 * @param value - The value to unwrap.
 * @param prefix - The expected wrapper prefix value.
 * @param suffix - Optional wrapper suffix value. If omitted, prefix is used.
 * @returns The unwrapped string when the wrapper is present; otherwise the original string.
 * @throws TypeError If value is null or undefined.
 */
/*#__NO_SIDE_EFFECTS__*/
export function strUnwrap(value: string, prefix: string, suffix?: string): string {
    _throwIfNullOrUndefined(value);
    let theValue = asString(value);
    let close: string = isNullOrUndefined(suffix) ? prefix : suffix as string;

    if (strStartsWith(theValue, prefix) && strEndsWith(theValue, close) && theValue[LENGTH] >= (prefix[LENGTH] + close[LENGTH])) {
        theValue = strSubstring(theValue, prefix[LENGTH], theValue[LENGTH] - close[LENGTH]);
    }

    return theValue;
}
