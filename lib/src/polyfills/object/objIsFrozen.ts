/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { polyObjIsSealed } from "./objIsSealed";

/**
 * Polyfill implementation for Object.isFrozen. Like the native function (since ES2015) a primitive value, including
 * `null` and `undefined`, is always frozen, while an object or function is reported as not frozen: `Object.isFrozen`
 * is defined by every supported (ES5) runtime, so this is only used by a runtime which can't freeze an object. It is
 * the same function as {@link polyObjIsSealed}, as without the native functions the result is the same.
 * @since 0.12.0
 * @group Polyfill
 * @group Object
 * @param obj - The object to check if it is frozen
 * @returns `true` for a primitive value (including `null` and `undefined`), otherwise `false`
 */
export const polyObjIsFrozen: (obj: any) => boolean = polyObjIsSealed;
