/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { isNullOrUndefined, objToString } from "../helpers/base";

export function polyIsArray<T>(arg: any): arg is T[] {
    if (isNullOrUndefined(arg)) {
        return false;
    }

    return objToString(arg) === "[object Array]";
}

