/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { LENGTH } from "./constants";

/*#__NO_SIDE_EFFECTS__*/
export function makePolyFn<T extends Function>(poly: T): T {
    return function(): T {
        let theArgs = [ this ];
        for (let lp = 0; lp < arguments[LENGTH]; lp++) {
            theArgs[lp + 1] = arguments[lp];
        }
        
        return poly.apply(this, theArgs);
    } as any;
}
