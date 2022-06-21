[@nevware21/ts-utils](../README.md) / helpers/extend

# Module: helpers/extend

## Table of contents

### Functions

- [deepExtend](helpers_extend.md#deepextend)
- [objExtend](helpers_extend.md#objextend)

## Functions

### deepExtend

▸ **deepExtend**<`T`, `T1`, `T2`, `T3`, `T4`, `T5`, `T6`\>(`target`, `obj1?`, `obj2?`, `obj3?`, `obj4?`, `obj5?`, `obj6?`): `T` & `T1` & `T2` & `T3` & `T4` & `T5` & `T6`

Create a new object by merging the passed arguments, this is effectively the same as calling `objExtend({}, ...theArgs)` where
all of the arguments are added to a new object that is returned.

#### Type parameters

| Name |
| :------ |
| `T` |
| `T1` |
| `T2` |
| `T3` |
| `T4` |
| `T5` |
| `T6` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `T` | The original object to be extended. |
| `obj1?` | `T1` | - |
| `obj2?` | `T2` | - |
| `obj3?` | `T3` | - |
| `obj4?` | `T4` | - |
| `obj5?` | `T5` | - |
| `obj6?` | `T6` | - |

#### Returns

`T` & `T1` & `T2` & `T3` & `T4` & `T5` & `T6`

- A new object or the original

#### Defined in

helpers/extend.ts:27

___

### objExtend

▸ **objExtend**<`T`, `T1`, `T2`, `T3`, `T4`, `T5`, `T6`\>(`target`, `obj1?`, `obj2?`, `obj3?`, `obj4?`, `obj5?`, `obj6?`): `T` & `T1` & `T2` & `T3` & `T4` & `T5` & `T6`

Extend the target object by merging the passed arguments into it

#### Type parameters

| Name |
| :------ |
| `T` |
| `T1` |
| `T2` |
| `T3` |
| `T4` |
| `T5` |
| `T6` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `T` | The object to be extended or overwritten |
| `obj1?` | `T1` | - |
| `obj2?` | `T2` | - |
| `obj3?` | `T3` | - |
| `obj4?` | `T4` | - |
| `obj5?` | `T5` | - |
| `obj6?` | `T6` | - |

#### Returns

`T` & `T1` & `T2` & `T3` & `T4` & `T5` & `T6`

- A new object or the original

#### Defined in

helpers/extend.ts:38
