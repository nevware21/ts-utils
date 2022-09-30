/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { LENGTH } from "./constants";

export function makePolyFn<T extends Function>(poly: T): T {
    return function(): T {
        let theArgs = [ this ];
        for (let lp = 0; lp < arguments[LENGTH]; lp++) {
            theArgs[lp + 1] = arguments[lp];
        }
        
        return poly.apply(this, theArgs);
    } as any;
}
