/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { HAS_OWN_PROPERTY, ObjProto } from "../internal/constants";

export function objHasOwnProperty<T = any>(obj: T, prop: PropertyKey): boolean {
    return obj && ObjProto[HAS_OWN_PROPERTY].call(obj, prop);
}
