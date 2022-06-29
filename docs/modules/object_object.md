[@nevware21/ts-utils](../README.md) / object/object

# Module: object/object

## Table of contents

### Functions

- [objAssign](object_object.md#objassign)
- [objCopyProps](object_object.md#objcopyprops)
- [objDeepCopy](object_object.md#objdeepcopy)
- [objDeepFreeze](object_object.md#objdeepfreeze)
- [objFreeze](object_object.md#objfreeze)
- [objKeys](object_object.md#objkeys)
- [objSeal](object_object.md#objseal)

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

[object/object.ts:22](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L22)

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

[object/object.ts:22](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L22)

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

[object/object.ts:22](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L22)

▸ **objAssign**(`target`, ...`sources`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `object` |
| `...sources` | `any`[] |

#### Returns

`any`

#### Defined in

[object/object.ts:22](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L22)

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

[object/object.ts:54](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L54)

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

[object/object.ts:36](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L36)

___

### objDeepFreeze

▸ **objDeepFreeze**<`T`\>(`value`): `T`

Perform a deep freeze on the object and all of it's contained values / properties by recursively calling
`objFreeze()` on all enumerable properties of the object and on each property returned.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | the object to be completly frozen. |

#### Returns

`T`

The originally passed in object.

#### Defined in

[object/object.ts:72](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L72)

___

### objFreeze

▸ **objFreeze**<`T`\>(`value`): `T`

The `objFreeze()` method freezes an object. A frozen object can no longer be changed; freezing an object
prevents new properties from being added to it, existing properties from being removed, prevents changing the
enumerability, configurability, or writability of existing properties, and prevents the values of existing
properties from being changed. In addition, freezing an object also prevents its prototype from being changed.
`objFreeze()` returns the same object that was passed in.

Nothing can be added to or removed from the properties set of a frozen object. Any attempt to do so will fail,
either silently or by throwing a TypeError exception (most commonly, but not exclusively, when in strict mode).

For data properties of a frozen object, values cannot be changed, the writable and configurable attributes are
set to false. Accessor properties (getters and setters) work the same (and still give the illusion that you are
changing the value). Note that values that are objects can still be modified, unless they are also frozen. As
an object, an array can be frozen; after doing so, its elements cannot be altered and no elements can be added
to or removed from the array.

`objFreeze()` returns the same object that was passed into the function. It does not create a frozen copy.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | The object to freeze. |

#### Returns

`T`

The object that was passed to the function.

#### Defined in

[object/object.ts:105](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L105)

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

[object/object.ts:24](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L24)

___

### objSeal

▸ **objSeal**<`T`\>(`value`): `T`

The `objSeal()` method seals an object, preventing new properties from being added to it and marking all
existing properties as non-configurable. Values of present properties can still be changed as long as they
are writable.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `T` | The object which should be sealed. |

#### Returns

`T`

The object being sealed.

#### Defined in

[object/object.ts:114](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/object/object.ts#L114)
