/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

export { arrAppend } from "./array/append";
export { ArrPredicateCallbackFn, ArrPredicateCallbackFn2, ArrMapCallbackFn, ArrFromMapFn } from "./array/callbacks";
export { arrEvery, arrFilter } from "./array/every";
export { arrFind, arrFindIndex, arrFindLast, arrFindLastIndex } from "./array/find";
export { arrForEach } from "./array/forEach";
export { arrFrom } from "./array/from";
export { arrContains, arrIncludes } from "./array/includes";
export { arrIndexOf, arrLastIndexOf } from "./array/indexOf";
export { arrMap } from "./array/map";
export { ArrReduceCallbackFn, arrReduce } from "./array/reduce";
export { arrSlice } from "./array/slice";
export { arrSome } from "./array/some";
export { fnApply, fnBind, fnCall } from "./funcs/funcs";
export { createFnDeferredProxy, createProxyFuncs } from "./funcs/fnProxy";
export { readArgs } from "./funcs/readArgs";
export { ProxyFunctionDef, TypeFuncNames } from "./funcs/types";
export {
    isTypeof, isUndefined, isNullOrUndefined, isDefined, isString, isFunction, isObject, isArray, isDate, isNumber, isBoolean,
    isRegExp, isFile, isFormData, isBlob, isArrayBuffer, isPromiseLike, isPromise, isThenable, isNotTruthy, isTruthy, objToString,
    isStrictNullOrUndefined, isStrictUndefined, isError, isPrimitive, isPrimitiveType
} from "./helpers/base";
export { ICachedValue, createCachedValue, createDeferredCachedValue } from "./helpers/cache";
export { CustomErrorConstructor, createCustomError, throwUnsupported } from "./helpers/customError";
export { utcNow, polyUtcNow } from "./helpers/date";
export { dumpObj } from "./helpers/diagnostics";
export {
    EnumCls, EnumNameMap, EnumValueMap, EnumTypeMap, createEnum, createEnumKeyMap, createEnumValueMap, createSimpleMap, createTypeMap
} from "./helpers/enum";
export {
    getGlobal, getInst, lazySafeGetInst, hasDocument, getDocument, hasWindow, getWindow, hasNavigator, getNavigator, hasHistory,
    getHistory, isNode, isWebWorker
} from "./helpers/environment";
export { encodeAsHtml, encodeAsJson, normalizeJsName } from "./helpers/encode";
export {
    deepExtend, objExtend
} from "./helpers/extend";
export { ILazyValue, getLazy, setBypassLazyCache, getWritableLazy } from "./helpers/lazy";
export { IGetLength as GetLengthImpl, getLength } from "./helpers/length";
export { getIntValue } from "./helpers/number";
export { getPerformance, hasPerformance, elapsedTime, perfNow } from "./helpers/perf";
export { createFilenameRegex, createWildcardRegex, makeGlobRegex } from "./helpers/regexp";
export { safe, ISafeReturn, SafeReturnType } from "./helpers/safe";
export { safeGet } from "./helpers/safe_get";
export { safeGetLazy, safeGetWritableLazy } from "./helpers/safe_lazy";
export { throwError, throwTypeError, throwRangeError } from "./helpers/throw";
export { hasValue } from "./helpers/value";
export { createArrayIterator } from "./iterator/array";
export { CreateIteratorContext, createIterator, createIterable, makeIterable } from "./iterator/create";
export { iterForOf } from "./iterator/forOf";
export { isIterable, isIterator } from "./iterator/iterator";
export { createRangeIterator } from "./iterator/range";
export { mathCeil, mathFloor } from "./math/floor";
export { mathMin, mathMax } from "./math/min_max";
export { mathRound } from "./math/round";
export { mathToInt } from "./math/to_int";
export { mathTrunc } from "./math/trunc";
export {
    IObjDeepCopyHandlerDetails, ObjDeepCopyHandler, objDeepCopy, objCopyProps,
    arrayDeepCopyHandler, dateDeepCopyHandler, functionDeepCopyHandler, plainObjDeepCopyHandler
} from "./object/copy";
export { objCreate } from "./object/create";
export { ObjDefinePropDescriptor, ObjDefinePropDescriptorMap, objDefine, objDefineProp, objDefineGet, objDefineAccessors, objDefineProperties, objDefineProps } from "./object/define";
export { objForEachKey } from "./object/for_each_key";
export { objGetOwnPropertyDescriptor } from "./object/get_own_prop_desc";
export { objHasOwn, polyObjHasOwn } from "./object/has_own";
export { objHasOwnProperty } from "./object/has_own_prop";
export { isPlainObject } from "./object/is_plain_object";
export {
    objAssign, objKeys, objDeepFreeze, objFreeze, objSeal, objGetPrototypeOf, objEntries, objIs
} from "./object/object";
export { objSetPrototypeOf } from "./object/set_proto";
export { getValueByKey, setValueByKey, getValueByIter, setValueByIter } from "./helpers/get_set_value";
export { strCamelCase, strKebabCase, strLetterCase, strSnakeCase } from "./string/conversion";
export { strEndsWith } from "./string/ends_with";
export { strContains, strIncludes, polyStrIncludes } from "./string/includes";
export { strIndexOf, strLastIndexOf } from "./string/index_of";
export { strIsNullOrWhiteSpace, strIsNullOrEmpty } from "./string/is_null_or";
export { strPadEnd, strPadStart } from "./string/pad";
export { strRepeat } from "./string/repeat";
export { strSlice } from "./string/slice";
export { strStartsWith } from "./string/starts_with";
export { strSubstr, strSubstring, strLeft, strRight, polyStrSubstr } from "./string/substring";
export { asString } from "./string/as_string";
export { strSplit, strSymSplit } from "./string/split";
export { strTrim, strTrimEnd, strTrimLeft, strTrimRight, strTrimStart } from "./string/trim";
export { strLower, strUpper } from "./string/upper_lower";
export { isSymbol, getSymbol, getKnownSymbol, hasSymbol, newSymbol, symbolFor, symbolKeyFor } from "./symbol/symbol";
export { WellKnownSymbols } from "./symbol/well_known";
export { ITimerHandler } from "./timer/handler";
export {
    hasIdleCallback, scheduleIdleCallback, setDefaultIdleTimeout, setDefaultMaxExecutionTime,
    getIdleCallback, getCancelIdleCallback, RequestIdleCallback, CancelIdleCallback
} from "./timer/idle";
export { scheduleInterval } from "./timer/interval";
export { TimeoutOverrideFn, ClearTimeoutOverrideFn, TimeoutOverrideFuncs, scheduleTimeout, scheduleTimeoutWith, createTimeout, createTimeoutWith } from "./timer/timeout";

// Exporting the helpers, but not the "initialization" code to populate any missing values
// This will enable anyone to "reuse" or create their own polyfills.ts implementation if they want.
export { polyIsArray, polyArrFind, polyArrFindIndex, polyArrFindLast, polyArrFindLastIndex, polyArrIncludes, polyArrFrom } from "./polyfills/array";
export { polyObjKeys, polyObjEntries, polyObjIs } from "./polyfills/object";
export { polyStrSymSplit } from "./polyfills/split";
export { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "./polyfills/symbol";
export { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "./polyfills/trim";
