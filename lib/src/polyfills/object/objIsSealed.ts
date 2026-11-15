/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { isPrimitive } from "../../helpers/base";

/**
 * Polyfill implementation for Object.isSealed. Like the native function (since ES2015) a primitive value, including
 * `null` and `undefined`, is always sealed, while an object or function is reported as not sealed: `Object.isSealed`
 * is defined by every supported (ES5) runtime, so this is only used by a runtime which can't seal an object.
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object to check if it is sealed
 * @returns `true` for a primitive value (including `null` and `undefined`), otherwise `false`
 */
/*#__NO_SIDE_EFFECTS__*/
export function polyObjIsSealed(obj: any): boolean {
    return isPrimitive(obj);
}
