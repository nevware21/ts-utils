/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

export {
    isTypeof, isUndefined, isNullOrUndefined, isDefined, isString, isFunction, isObject, isArray, isDate, isNumber, isBoolean,
    isRegExp, isFile, isFormData, isBlob, isArrayBuffer, isPromiseLike, isPromise, isNotTruthy, isTruthy, objToString
} from "./helpers/base";
export { arrForEach, arrAppend } from "./helpers/array";
export { dumpObj } from "./helpers/disgnostics";
export {
    getGlobal, getInst, hasDocument, getDocument, hasWindow, getWindow, hasNavigator, getNavigator, hasHistory, getHistory,
    isNode, isWebWorker
} from "./helpers/environment";
export { getIntValue } from "./helpers/number";
export {
    objAssign, objHasOwnProperty, objKeys, objForEachKey, objDeepCopy, objCopyProps, objExtend,
    objDefineProp, objDefineGet, objDefineAccessors, objDeepFreeze
} from "./helpers/object";
export { strIsNullOrWhiteSpace, strIsNullOrEmpty } from "./helpers/string";
export { throwError, throwTypeError } from "./helpers/throw";
export { hasValue } from "./helpers/value";