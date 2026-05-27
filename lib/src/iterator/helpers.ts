/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2026 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { fnCall } from "../funcs/funcs";
import { isArrayLike, isStrictNullOrUndefined } from "../helpers/base";
import { arrSlice } from "../array/slice";
import { getKnownSymbol } from "../symbol/symbol";
import { WellKnownSymbols } from "../symbol/well_known";
import { createArrayIterator } from "./array";
import { createIterableIterator } from "./create";
import { isIterable, isIterator } from "./iterator";

export function _asIterator<T>(iter: Iterator<T> | Iterable<T> | ArrayLike<T>): Iterator<T> {
    if (isIterator(iter)) {
        return iter;
    }

    if (isArrayLike(iter)) {
        return createArrayIterator(arrSlice(iter));
    }

    if (isIterable(iter)) {
        let iteratorFn = (iter as any)[getKnownSymbol(WellKnownSymbols.iterator)];
        if (iteratorFn) {
            return fnCall(iteratorFn, iter);
        }
    }

    return createIterableIterator<T>({
        n: function() {
            return true;
        }
    });
}

export function _getIteratorThisArg<T>(source: Iterator<T>, thisArg?: any): any {
    return isStrictNullOrUndefined(thisArg) ? source : thisArg;
}

export function _doIteratorReturn<T, R>(source: Iterator<T>, value?: R): R | undefined {
    source.return && source.return(value as any);
    return value;
}
