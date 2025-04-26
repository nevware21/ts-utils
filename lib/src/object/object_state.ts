/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { _returnFalse } from "../internal/stubs";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";

/**
 * The `objIsFrozen()` method determines if an object is frozen. An object is frozen if and only if it is not
 * extensible, all its properties are non-configurable, and all its data properties are non-writable.
 *
 * @function
 * @since 0.12.0
 * @group Object
 * @param obj - The object to check if it is frozen.
 * @returns A Boolean indicating whether or not the given object is frozen.
 * @example
 * ```typescript
 * const obj = { a: 1 };
 * console.log(objIsFrozen(obj)); // false
 *
 * const frozen = objFreeze({ b: 2 });
 * console.log(objIsFrozen(frozen)); // true
 * ```
 */
export const objIsFrozen: (obj: any) => boolean = (/* #__PURE__*/_pureAssign((/* #__PURE__ */_pureRef<typeof Object.isFrozen>(ObjClass, "isFrozen")), _returnFalse));

/**
 * The `objIsSealed()` method determines if an object is sealed. An object is sealed if it is not
 * extensible and if all its properties are non-configurable (but potentially still writable).
 *
 * @function
 * @since 0.12.0
 * @group Object
 * @param obj - The object to check if it is sealed.
 * @returns A Boolean indicating whether or not the given object is sealed.
 * @example
 * ```typescript
 * const obj = { a: 1 };
 * console.log(objIsSealed(obj)); // false
 *
 * const sealed = objSeal({ b: 2 });
 * console.log(objIsSealed(sealed)); // true
 *
 * // Frozen objects are also sealed
 * const frozen = objFreeze({ c: 3 });
 * console.log(objIsSealed(frozen)); // true
 * ```
 */
export const objIsSealed: (obj: any) => boolean = (/* #__PURE__*/_pureAssign((/* #__PURE__ */_pureRef<typeof Object.isSealed>(ObjClass, "isSealed")), _returnFalse));