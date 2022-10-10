/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { LENGTH } from "./constants";

/**
 * @internal
 * @ignore
 * @param args - The arguments to extract from
 * @param startAt - The starting position
 * @returns A new array containing the extracted arguments
 */
export function _extractArgs(args: IArguments, startAt: number) {
    let theArgs = [];
    for (let lp = startAt; lp < args[LENGTH]; lp++) {
        theArgs[lp - startAt] = args[lp];
    }

    return theArgs;
}
