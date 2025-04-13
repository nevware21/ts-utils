/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { ObjClass } from "../internal/constants";
import { _pureAssign, _pureRef } from "../internal/treeshake_helpers";

/**
 * The `objGetOwnPropertySymbols()` method returns an array of all symbol properties found directly upon
 * the given object. Unlike Object.getOwnPropertyNames(), this method returns symbol properties only.
 *
 * @function
 * @since 0.12.0
 * @group Object
 * @param obj - The object whose symbol properties are to be returned.
 * @returns An array of all symbol properties found directly upon the given object.
 * @example
 * ```typescript
 * const obj = {};
 * const a = Symbol('a');
 * const b = Symbol.for('b');
 *
 * obj[a] = 'localSymbol';
 * obj[b] = 'globalSymbol';
 *
 * const symbolProps = objGetOwnPropertySymbols(obj);
 *
 * console.log(symbolProps.length); // 2
 * console.log(symbolProps[0] === a); // true
 * console.log(symbolProps[1] === b); // true
 * ```
 */
export const objGetOwnPropertySymbols: (obj: any) => symbol[] = (/* #__PURE__*/_pureAssign((/* #__PURE__ */_pureRef<typeof Object.getOwnPropertySymbols>(ObjClass, "getOwnPropertySymbols")), () => []));
