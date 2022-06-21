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
    isRegExp, isFile, isFormData, isBlob, isArrayBuffer, isPromiseLike, isPromise, isNotTruthy, isTruthy, objToString
} from "./helpers/base";
export { CustomErrorConstructor, createCustomError, throwUnsupported } from "./helpers/customError";
export { dumpObj } from "./helpers/diagnostics";
export {
    getGlobal, getInst, hasDocument, getDocument, hasWindow, getWindow, hasNavigator, getNavigator, hasHistory, getHistory,
    isNode, isWebWorker
} from "./helpers/environment";
export {
    deepExtend, objExtend
} from "./helpers/extend";
export { getIntValue } from "./helpers/number";
export { objCreate } from "./object/create";
export { objDefineProp, objDefineGet, objDefineAccessors } from "./object/define";
export { objForEachKey } from "./object/for_each_key";
export { objHasOwnProperty } from "./object/has_own_prop";
export {
    objAssign, objKeys, objDeepCopy, objCopyProps, objDeepFreeze, objFreeze, objSeal
} from "./object/object";
export { objSetPrototypeOf } from "./object/set_proto";
export { strIsNullOrWhiteSpace, strIsNullOrEmpty, strStartsWith, strEndsWith } from "./helpers/string";
export { throwError, throwTypeError } from "./helpers/throw";
export { hasValue } from "./helpers/value";