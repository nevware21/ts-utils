/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

export function makePolyFn<T extends Function>(poly: T): T {
    return function(): T {
        let theArgs = [ this ];
        for (let lp = 0; lp < arguments.length; lp++) {
            theArgs.push(arguments[lp]);
        }
        
        return poly.apply(this, theArgs);
    } as any;
}
