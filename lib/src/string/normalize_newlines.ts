/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { _throwIfNullOrUndefined } from "../internal/throwIf";
import { throwTypeError } from "../helpers/throw";
import { asString } from "./as_string";
import { strReplace } from "./replace";
import { arrIndexOf } from "../array/indexOf";

const _validNewlines = ["\n", "\r\n", "\r", "\n\r"];

/**
 * Normalizes all line endings in a string.
 * @since 0.14.0
 * @group String
 * @group Conversion
 * @param value - The value containing line endings to normalize.
 * @param newlineType - Optional target line ending. Supported values are "\n", "\r\n", "\r", and "\n\r". Defaults to "\n".
 * @returns A string with normalized line endings.
 * @throws TypeError If value is null or undefined, or newlineType is not a supported newline string.
 */
/*#__NO_SIDE_EFFECTS__*/
export function strNormalizeNewlines(value: string, newlineType?: "\n" | "\r\n" | "\r" | "\n\r"): string {
    _throwIfNullOrUndefined(value);
    
    let target = newlineType !== undefined ? newlineType : "\n";

    if (arrIndexOf(_validNewlines, target) === -1) {
        throwTypeError("Unsupported newlineType value");
    }

    return strReplace(asString(value), /\r\n|\n\r|\r|\n/g, target);
}
