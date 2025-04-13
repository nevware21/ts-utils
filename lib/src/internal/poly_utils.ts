/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { safe } from "../helpers/safe";
import { objDefine } from "../object/define";
import { POLYFILL_TAG, POLYFILL_TYPE_NAME } from "./poly_helpers";

/**
 * Tags the target object as a polyfill with the specified type name.
 * This is used to identify polyfills in the codebase.
 * @internal
 * @ignore
 * @group Polyfill
 * @param target - The target object to tag as a polyfill.
 * @param polyfillTypeName - The type name of the polyfill.
 * @returns
 */
export function _tagAsPolyfill<T>(target: T, polyfillTypeName: string): T {
    if (target) {
        safe(() => {
            (target as any)[POLYFILL_TAG] = true;
            (target as any)[POLYFILL_TYPE_NAME] = polyfillTypeName;
        });
        // Attempt to define the POLYFILL_TAG property on the target object)
        safe(objDefine, [target, POLYFILL_TAG, {
            v: true,
            w: false,
            e: false
        }]);

        // Attempt to define the POLYFILL_TYPE_NAME property on the target object
        safe(objDefine, [target, POLYFILL_TYPE_NAME, {
            v: polyfillTypeName,
            w: false,
            e: false
        }]);
    }

    return target;
}
