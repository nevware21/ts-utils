/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, isString } from "./base";

const EMPTY = "";

export function strIsNullOrWhiteSpace(value: string): boolean {
    if (isString(value)) {
        return value.replace(/[\s\t\r\n\f]+/g, EMPTY) === EMPTY;
    }

    return isNullOrUndefined(value)
}

export function strIsNullOrEmpty(value: string): boolean {
    if (isString(value)) {
        return value === EMPTY;
    }

    return isNullOrUndefined(value)
}

