/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, isNumber } from "./base";

export function getIntValue(value?: string | number, defValue?: number): number {
    if (!isNullOrUndefined(value)) {
        if (isNumber(value)) {
            return value;
        }

        let theValue = parseInt(value, 10);
        return isNaN(theValue) ? defValue : theValue;
    }

    return defValue;
}

