/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { _polyObjKeys } from "./polyfills/object";

const ObjClass = Object;
const KEYS = "keys";

if (!ObjClass[KEYS]) {
    ObjClass[KEYS] = _polyObjKeys;
}