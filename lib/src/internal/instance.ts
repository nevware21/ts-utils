/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { utcNow } from "../helpers/date";
import { getLazy, ILazyValue } from "../helpers/lazy";

/**
 * @internal
 * @ignore
 * Internal constant to hold the unique instance ID for the current instance
 * of the library. This is used to ensure that each instance of the library has a unique identifier.
 */
export let _uniqueInstanceId: ILazyValue<string> = (/*#__PURE__*/getLazy(() => {
    let value = (utcNow().toString(36).slice(2));
    while(value.length < 16) {
        value += Math.random().toString(36).slice(2);
    }

    value = value.substring(0, 16);

    return value;
}));