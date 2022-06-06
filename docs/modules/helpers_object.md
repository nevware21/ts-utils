[@nevware21/ts-utils](../README.md) / helpers/object

# Module: helpers/object

## Table of contents

### Functions

- [objAssign](helpers_object.md#objassign)
- [objCopyProps](helpers_object.md#objcopyprops)
- [objDeepCopy](helpers_object.md#objdeepcopy)
- [objDeepFreeze](helpers_object.md#objdeepfreeze)
- [objDefineAccessors](helpers_object.md#objdefineaccessors)
- [objDefineGet](helpers_object.md#objdefineget)
- [objDefineProp](helpers_object.md#objdefineprop)
- [objExtend](helpers_object.md#objextend)
- [objForEachKey](helpers_object.md#objforeachkey)
- [objFreeze](helpers_object.md#objfreeze)
- [objHasOwnProperty](helpers_object.md#objhasownproperty)
- [objKeys](helpers_object.md#objkeys)
- [objSeal](helpers_object.md#objseal)

## Functions

### objAssign

▸ **objAssign**<`T`, `U`\>(`target`, `source`): `T` & `U`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |
| `U` | `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `T` |
| `source` | `U` |

#### Returns

`T` & `U`

#### Defined in

[helpers/object.ts:58](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L58)

▸ **objAssign**<`T`, `U`, `V`\>(`target`, `source1`, `source2`): `T` & `U` & `V`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |
| `U` | `U` |
| `V` | `V` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `T` |
| `source1` | `U` |
| `source2` | `V` |

#### Returns

`T` & `U` & `V`

#### Defined in

[helpers/object.ts:58](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L58)

▸ **objAssign**<`T`, `U`, `V`, `W`\>(`target`, `source1`, `source2`, `source3`): `T` & `U` & `V` & `W`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |
| `U` | `U` |
| `V` | `V` |
| `W` | `W` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `T` |
| `source1` | `U` |
| `source2` | `V` |
| `source3` | `W` |

#### Returns

`T` & `U` & `V` & `W`

#### Defined in

[helpers/object.ts:58](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L58)

▸ **objAssign**(`target`, ...`sources`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `object` |
| `...sources` | `any`[] |

#### Returns

`any`

#### Defined in

[helpers/object.ts:58](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L58)

___

### objCopyProps

▸ **objCopyProps**<`T`\>(`target`, `source`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `T` |
| `source` | `any` |

#### Returns

`T`

#### Defined in

[helpers/object.ts:82](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L82)

___

### objDeepCopy

▸ **objDeepCopy**<`T`\>(`source`): `T`

Performs a deep copy of the source object

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `T` |

#### Returns

`T`

#### Defined in

[helpers/object.ts:64](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L64)

___

### objDeepFreeze

▸ **objDeepFreeze**<`T`\>(`obj`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `T` |

#### Returns

`T`

#### Defined in

[helpers/object.ts:174](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L174)

___

### objDefineAccessors

▸ **objDefineAccessors**<`T`\>(`target`, `prop`, `getProp?`, `setProp?`): `boolean`

Try to define get/set object property accessors for the target object/prototype, this will provide compatibility with
existing API definition when run within an ES5+ container that supports accessors but still enable the code to be loaded
and executed in an ES3 container, providing basic IE8 compatibility.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `any` | The object on which to define the property. |
| `prop` | `PropertyKey` | The name of the property to be defined or modified. |
| `getProp?` | () => `T` | The getter function to wire against the getter. |
| `setProp?` | (`v`: `T`) => `void` | The setter function to wire against the setter. |

#### Returns

`boolean`

True if it was able to create the accessors otherwise false

#### Defined in

[helpers/object.ts:148](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L148)

___

### objDefineGet

▸ **objDefineGet**(`target`, `key`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `key` | `PropertyKey` |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[helpers/object.ts:124](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L124)

___

### objDefineProp

▸ **objDefineProp**(`target`, `key`, `descriptor`): `any`

Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `any` | The object on which to define the property. |
| `key` | `PropertyKey` | The name or Symbol of the property to be defined or modified. |
| `descriptor` | `PropertyDescriptor` & `ThisType`<`any`\> | The descriptor for the property being defined or modified. |

#### Returns

`any`

#### Defined in

[helpers/object.ts:111](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L111)

___

### objExtend

▸ **objExtend**(`target`, ...`theArgs`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `...theArgs` | `any` |

#### Returns

`any`

#### Defined in

[helpers/object.ts:93](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L93)

___

### objForEachKey

▸ **objForEachKey**(`theObject`, `callbackfn`, `thisArg?`): `void`

Calls the provided `callbackFn` function once for each key in an object. This is equivelent to `arrForEach(Object.keys(theObject), callbackFn)` or
if not using the array helper `Object.keys(theObject).forEach(callbackFn)` except that this helper avoid creating a temporary of the object
keys before iterating over them and like the `arrForEach` helper you CAN stop or break the iteration by returning -1 from the `callbackFn` function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `theObject` | `any` | - |
| `callbackfn` | (`key`: `string`, `value`: `any`) => `number` \| `void` | A function that accepts up to two arguments, the key name and the current value of the property represented by the key. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, null or undefined the object will be used as the this value. |

#### Returns

`void`

#### Defined in

[helpers/object.ts:46](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L46)

___

### objFreeze

▸ **objFreeze**<`T`\>(`value`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`T`

#### Defined in

[helpers/object.ts:186](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L186)

___

### objHasOwnProperty

▸ **objHasOwnProperty**(`obj`, `prop`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |
| `prop` | `string` |

#### Returns

`boolean`

#### Defined in

[helpers/object.ts:23](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L23)

___

### objKeys

▸ **objKeys**(`value`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`string`[]

#### Defined in

[helpers/object.ts:27](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L27)

___

### objSeal

▸ **objSeal**<`T`\>(`value`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |

#### Returns

`T`

#### Defined in

[helpers/object.ts:187](https://github.com/nevware21/ts-utils/blob/9dde265/ts-utils/src/helpers/object.ts#L187)
