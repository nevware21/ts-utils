/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

/// <reference lib="es2015" />

import { polyArrAt } from "./array/at";
import { polyArrFill } from "./array/fill";
import { polyArrFlatMap } from "./array/flatMap";
import { polyArrWith } from "./array/with";
import { _installPolyfills } from "./internal/poly_install";
import { polyStrReplaceAll } from "./string/replace_all";

// Adds the polyfills for any of the native functions which are not defined
_installPolyfills();

export { polyArrAt, polyArrFill, polyArrFlatMap, polyArrWith, polyStrReplaceAll };
