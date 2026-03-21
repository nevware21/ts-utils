/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

export { arrAppend } from "./array/append";
export { ArrPredicateCallbackFn, ArrPredicateCallbackFn2, ArrMapCallbackFn, ArrFromMapFn } from "./array/callbacks";
export { arrAt } from "./array/at";
export { arrChunk } from "./array/chunk";
export { arrCompact } from "./array/compact";
export { arrDifference } from "./array/difference";
export { arrDrop } from "./array/drop";
export { arrDropWhile } from "./array/drop_while";
export { arrEvery, arrFilter } from "./array/every";
export { arrFill } from "./array/fill";
export { arrFind, arrFindIndex, arrFindLast, arrFindLastIndex } from "./array/find";
export { arrFlatten } from "./array/flatten";
export { arrForEach } from "./array/forEach";
export { arrFrom } from "./array/from";
export { ArrGroupByCallbackFn, arrGroupBy } from "./array/groupBy";
export { arrContains, arrIncludes } from "./array/includes";
export { arrIndexOf, arrLastIndexOf } from "./array/indexOf";
export { arrIntersection } from "./array/intersection";
export { arrMap } from "./array/map";
export { arrPartition } from "./array/partition";
export { ArrReduceCallbackFn, arrReduce } from "./array/reduce";
export { arrReverse } from "./array/reverse";
export { arrRotate } from "./array/rotate";
export { arrSample } from "./array/sample";
export { arrShuffle } from "./array/shuffle";
export { arrSlice } from "./array/slice";
export { arrSome } from "./array/some";
export { arrTake } from "./array/take";
export { arrTakeWhile } from "./array/take_while";
export { arrUnion } from "./array/union";
export { arrUnique } from "./array/unique";
export { arrUnzip } from "./array/unzip";
export { arrWith } from "./array/with";
export { arrZip } from "./array/zip";
export { fnApply, fnBind, fnCall } from "./funcs/funcs";
export { createFnDeferredProxy, createProxyFuncs } from "./funcs/fnProxy";
export { readArgs } from "./funcs/readArgs";
export { ProxyFunctionDef, TypeFuncNames } from "./funcs/types";
export { WritableArrayLike } from "./helpers/arrayLike";
export {
    isTypeof, isUndefined, isNullOrUndefined, isDefined, isString, isFunction, isObject, isArray, isArrayLike, isDate, isNumber, isBoolean,
    isRegExp, isFile, isFormData, isBlob, isArrayBuffer, isPromiseLike, isPromise, isThenable, isNotTruthy, isTruthy, objToString,
    isStrictNullOrUndefined, isStrictUndefined, isError, isPrimitive, isPrimitiveType, isMap, isMapLike, isSet, isSetLike,
    isWeakMap, isWeakSet, isBigInt, isAsyncFunction, isGenerator, isAsyncGenerator
} from "./helpers/base";
export { ICachedValue, createCachedValue, createDeferredCachedValue, getDeferred, getWritableDeferred } from "./helpers/cache";
export { CustomErrorConstructor, createCustomError, throwUnsupported } from "./helpers/customError";
export { utcNow, polyUtcNow } from "./helpers/date";
export { isElement, isElementLike } from "./helpers/dom";
export { isEmpty } from "./helpers/is_empty";
export { dumpObj } from "./helpers/diagnostics";
export {
    EnumCls, EnumNameMap, EnumValueMap, EnumTypeMap, createEnum, createEnumKeyMap, createEnumValueMap, createSimpleMap, createTypeMap
} from "./helpers/enum";
export {
    getGlobal, getInst, lazySafeGetInst, hasDocument, getDocument, hasWindow, getWindow, hasNavigator, getNavigator, hasHistory,
    getHistory, isNode, isWebWorker
} from "./helpers/environment";
export {
    encodeAsHtml, encodeAsJson, normalizeJsName, encodeAsBase64, decodeBase64, encodeAsBase64Url,
    decodeBase64Url, encodeAsHex, decodeHex, encodeAsUri, decodeUri
} from "./helpers/encode";
export { deepExtend, objExtend } from "./helpers/extend";
export { getValueByKey, setValueByKey, getValueByIter, setValueByIter } from "./helpers/get_set_value";
export { ILazyValue, getLazy, setBypassLazyCache, getWritableLazy } from "./helpers/lazy";
export { IGetLength as GetLengthImpl, getLength } from "./helpers/length";
export { getIntValue, isInteger, isFiniteNumber } from "./helpers/number";
export { getPerformance, hasPerformance, elapsedTime, perfNow } from "./helpers/perf";
export { createFilenameRegex, createLiteralRegex, createWildcardRegex, makeGlobRegex } from "./helpers/regexp";
export { safe, ISafeReturn, SafeReturnType } from "./helpers/safe";
export { safeGet } from "./helpers/safe_get";
export { safeGetLazy, safeGetWritableLazy, safeGetDeferred, safeGetWritableDeferred } from "./helpers/safe_lazy";
export { throwError, throwTypeError, throwRangeError } from "./helpers/throw";
export { hasValue } from "./helpers/value";
export { createArrayIterator } from "./iterator/array";
export { CreateIteratorContext, createIterator, createIterable, createIterableIterator, makeIterable } from "./iterator/create";
export { iterForOf } from "./iterator/forOf";
export { isIterable, isIterator } from "./iterator/iterator";
export { createRangeIterator } from "./iterator/range";
export { mathAbs } from "./math/abs";
export { mathCeil, mathFloor } from "./math/floor";
export { mathExp, mathLog } from "./math/exp_log";
export { mathAsin, mathAcos, mathAtan, mathAtan2 } from "./math/inverse_trig";
export { mathMin, mathMax } from "./math/min_max";
export { mathPow, mathSqrt } from "./math/power";
export { mathRandom } from "./math/random";
export { mathRound } from "./math/round";
export { mathSin, mathCos, mathTan } from "./math/trig";
export { mathToInt } from "./math/to_int";
export { mathTrunc } from "./math/trunc";
export {
    IObjDeepCopyHandlerDetails, ObjDeepCopyHandler, objDeepCopy, objCopyProps, arrayDeepCopyHandler, dateDeepCopyHandler,
    functionDeepCopyHandler, plainObjDeepCopyHandler
} from "./object/copy";
export { objCreate } from "./object/create";
export {
    ObjDefinePropDescriptor, ObjDefinePropDescriptorMap, objDefine, objDefineProp, objDefineGet, objDefineAccessors,
    objDefineProperties, objDefineProps
} from "./object/define";
export { objForEachKey } from "./object/for_each_key";
export {
    objGetOwnPropertyDescriptor, objGetOwnPropertyDescriptors, objGetOwnPropertyNames,
    objGetOwnPropertySymbols
} from "./object/get_own_property";
export { objHasOwn } from "./object/has_own";
export { objHasOwnProperty } from "./object/has_own_prop";
export { isPlainObject } from "./object/is_plain_object";
export {
    objAssign, objKeys, objDeepFreeze, objFreeze, objSeal, objGetPrototypeOf, objEntries,
    objIs, objValues
} from "./object/object";
export { objFromEntries, ObjFromEntriesFn } from "./object/from_entries";
export { objPreventExtensions, objIsExtensible } from "./object/prevent_extensions";
export { objPropertyIsEnumerable } from "./object/property_is_enumerable";
export { objSetPrototypeOf } from "./object/set_proto";
export { objIsFrozen, objIsSealed } from "./object/object_state";
export { strCamelCase, strCapitalizeWords, strKebabCase, strLetterCase, strSnakeCase } from "./string/conversion";
export { strCount } from "./string/count";
export { strAt, polyStrAt } from "./string/at";
export { strEndsWith } from "./string/ends_with";
export { strContains, strIncludes, polyStrIncludes } from "./string/includes";
export { strIndexOf, strLastIndexOf } from "./string/index_of";
export { strMatchAll, polyStrMatchAll } from "./string/match_all";
export { strIsNullOrWhiteSpace, strIsNullOrEmpty } from "./string/is_null_or";
export { strPadEnd, strPadStart } from "./string/pad";
export { strReplace } from "./string/replace";
export { strReplaceAll } from "./string/replace_all";
export { strRepeat } from "./string/repeat";
export { strSlice } from "./string/slice";
export { strStartsWith } from "./string/starts_with";
export { strSubstr, strSubstring, strLeft, strRight, polyStrSubstr } from "./string/substring";
export { asString } from "./string/as_string";
export { strSplit, strSymSplit } from "./string/split";
export { strTruncate } from "./string/truncate";
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
export {
    TimeoutOverrideFn, ClearTimeoutOverrideFn, TimeoutOverrideFuncs, scheduleTimeout, scheduleTimeoutWith,
    createTimeout, createTimeoutWith, setTimeoutOverrides, setGlobalTimeoutOverrides
} from "./timer/timeout";

// Exporting the helpers, but not the "initialization" code to populate any missing values
// This will enable anyone to "reuse" or create their own polyfills.ts implementation if they want.
// Not including all of the polyfills as they will be removed in v2.x and beyond, so only including the
// initial exported ones, even these you should not depend on.
export { polyIsArray, polyArrFind, polyArrFindIndex, polyArrFindLast, polyArrFindLastIndex, polyArrIncludes, polyArrFrom } from "./polyfills/array";
export { polyObjKeys, polyObjEntries } from "./polyfills/object/objKeys";
export { polyObjIs } from "./polyfills/object/objIs";
export { polyStrSymSplit } from "./polyfills/split";
export { polyGetKnownSymbol, polyNewSymbol, polySymbolFor, polySymbolKeyFor } from "./polyfills/symbol";
export { polyStrTrim, polyStrTrimEnd, polyStrTrimStart } from "./polyfills/trim";
export { polyStrReplaceAll } from "./string/replace_all";
export { polyObjHasOwn } from "./object/has_own";
