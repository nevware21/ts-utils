[@nevware21/ts-utils](../README.md) / helpers/environment

# Module: helpers/environment

## Table of contents

### Functions

- [getDocument](helpers_environment.md#getdocument)
- [getGlobal](helpers_environment.md#getglobal)
- [getHistory](helpers_environment.md#gethistory)
- [getInst](helpers_environment.md#getinst)
- [getNavigator](helpers_environment.md#getnavigator)
- [getWindow](helpers_environment.md#getwindow)
- [hasDocument](helpers_environment.md#hasdocument)
- [hasHistory](helpers_environment.md#hashistory)
- [hasNavigator](helpers_environment.md#hasnavigator)
- [hasWindow](helpers_environment.md#haswindow)
- [isNode](helpers_environment.md#isnode)
- [isWebWorker](helpers_environment.md#iswebworker)

## Functions

### getDocument

▸ **getDocument**(): `Document`

Return the global `document` instance.

#### Returns

`Document`

#### Defined in

[helpers/environment.ts:111](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L111)

___

### getGlobal

▸ **getGlobal**(`useCached?`): `Window`

Returns the current global scope object, for a normal web page this will be the current
window, for a Web Worker this will be current worker global scope via "self". The internal
implementation returns the first available instance object in the following order
- globalThis (New standard)
- self (Will return the current window instance for supported browsers)
- window (fallback for older browser implementations)
- global (NodeJS standard)
- <null> (When all else fails)
While the return type is a Window for the normal case, not all environments will support all
of the properties or functions. And this caches the lookup of the global as in some environments
this can be an expensive operation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `useCached?` | `boolean` |

#### Returns

`Window`

#### Defined in

[helpers/environment.ts:54](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L54)

___

### getHistory

▸ **getHistory**(): `History` \| ``null``

Returns the global `history` instance

#### Returns

`History` \| ``null``

#### Defined in

[helpers/environment.ts:159](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L159)

___

### getInst

▸ **getInst**<`T`\>(`name`): `T`

Return the named global object if available, will return null if the object is not available.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | The globally named object |

#### Returns

`T`

#### Defined in

[helpers/environment.ts:84](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L84)

___

### getNavigator

▸ **getNavigator**(): `Navigator`

Returns the global `navigator` instance

#### Returns

`Navigator`

#### Defined in

[helpers/environment.ts:143](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L143)

___

### getWindow

▸ **getWindow**(): `Window`

Return the global `window` instance.

#### Returns

`Window`

#### Defined in

[helpers/environment.ts:127](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L127)

___

### hasDocument

▸ **hasDocument**(): `boolean`

Identify whether the runtime contains a `document` object

#### Returns

`boolean`

- True if a `document` exists

#### Defined in

[helpers/environment.ts:103](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L103)

___

### hasHistory

▸ **hasHistory**(): `boolean`

Identifies whether the runtime contains a `history` object

#### Returns

`boolean`

#### Defined in

[helpers/environment.ts:151](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L151)

___

### hasNavigator

▸ **hasNavigator**(): `boolean`

Identify whether the runtimne contains a `navigator` object

#### Returns

`boolean`

#### Defined in

[helpers/environment.ts:135](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L135)

___

### hasWindow

▸ **hasWindow**(): `boolean`

Identify whether the runtime contains a `window` object

#### Returns

`boolean`

#### Defined in

[helpers/environment.ts:119](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L119)

___

### isNode

▸ **isNode**(): `boolean`

Simple method to determine if we are running in a node environment

#### Returns

`boolean`

True if you are

#### Defined in

[helpers/environment.ts:167](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L167)

___

### isWebWorker

▸ **isWebWorker**(): `boolean`

Helper to identify if you are running as a Dedicated, Shared or Service worker

#### Returns

`boolean`

True if the environment you are in looks like a Web Worker

#### Defined in

[helpers/environment.ts:175](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/helpers/environment.ts#L175)
