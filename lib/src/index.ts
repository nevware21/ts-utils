/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

export { ArrReduceCallbackFn, arrForEach, arrAppend, arrIndexOf, arrReduce } from "./helpers/array";
export {
    isTypeof, isUndefined, isNullOrUndefined, isDefined, isString, isFunction, isObject, isArray, isDate, isNumber, isBoolean,
    isRegExp, isFile, isFormData, isBlob, isArrayBuffer, isPromiseLike, isPromise, isNotTruthy, isTruthy, objToString,
    isStrictNullOrUndefined, isStrictUndefined, isError
} from "./helpers/base";
export { CustomErrorConstructor, createCustomError, throwUnsupported } from "./helpers/customError";
export { dumpObj } from "./helpers/diagnostics";
export { EnumCls, EnumNameMap, EnumValueMap, EnumTypeMap, createEnum, createEnumKeyMap, createEnumValueMap, createSimpleMap, createTypeMap } from "./helpers/enum";
export {
    getGlobal, getInst, hasDocument, getDocument, hasWindow, getWindow, hasNavigator, getNavigator, hasHistory, getHistory,
    isNode, isWebWorker
} from "./helpers/environment";
export {
    deepExtend, objExtend
} from "./helpers/extend";
export { getIntValue } from "./helpers/number";
export { throwError, throwTypeError, throwRangeError } from "./helpers/throw";
export { hasValue } from "./helpers/value";
export { mathCeil, mathFloor } from "./math/floor";
export { mathToInt } from "./math/to_int";
export { mathTrunc } from "./math/trunc";
export { objCreate } from "./object/create";
export { objDefineProp, objDefineGet, objDefineAccessors } from "./object/define";
export { objForEachKey } from "./object/for_each_key";
export { objHasOwnProperty } from "./object/has_own_prop";
export {
    objAssign, objKeys, objDeepCopy, objCopyProps, objDeepFreeze, objFreeze, objSeal
} from "./object/object";
export { objSetPrototypeOf } from "./object/set_proto";
export { strEndsWith } from "./string/ends_with";
export { strIndexOf, strLastIndexOf } from "./string/index_of";
export { strIsNullOrWhiteSpace, strIsNullOrEmpty } from "./string/is_null_or";
export { strPadEnd, strPadStart } from "./string/pad";
export { strRepeat } from "./string/repeat";
export { strSlice } from "./string/slice";
export { strStartsWith } from "./string/starts_with";
export { strTrim, strTrimEnd, strTrimLeft, strTrimRight, strTrimStart } from "./string/trim";
export { isSymbol, getSymbol, getKnownSymbol, hasSymbol, newSymbol, symbolFor, symbolKeyFor } from "./symbol/symbol";
export { WellKnownSymbols } from "./symbol/well_known";

// Exporting the helpers, but not the "initialization" code to populate any missing values
// This will enable anyone to "reuse" or create their own polyfills.ts implementation if they want.
export { polyIsArray } from "./polyfills/array";
export { polyObjKeys } from "./polyfills/object";
export { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "./polyfills/symbol";
export { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "./polyfills/trim";