/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

export { arrForEach, arrAppend } from "./helpers/array";
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
export { isSymbol, getSymbol, getKnownSymbol, hasSymbol, newSymbol, symbolFor, symbolKeyFor } from "./symbol/symbol";
export { WellKnownSymbols } from "./symbol/well_known";
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
export { strIsNullOrWhiteSpace, strIsNullOrEmpty } from "./string/is_null_or";
export { strStartsWith } from "./string/starts_with";
export { strEndsWith } from "./string/ends_with";
export { throwError, throwTypeError, throwRangeError } from "./helpers/throw";
