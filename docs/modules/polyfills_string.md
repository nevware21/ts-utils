[@nevware21/ts-utils](../README.md) / polyfills/string

# Module: polyfills/string

## Table of contents

### Functions

- [polyStrEndsWith](polyfills_string.md#polystrendswith)
- [polyStrStartsWith](polyfills_string.md#polystrstartswith)

## Functions

### polyStrEndsWith

▸ **polyStrEndsWith**(`value`, `searchString`, `length?`): `boolean`

This method lets you determine whether or not a string ends with another string. This method is case-sensitive.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be checked |
| `searchString` | `string` | The characters to be searched for at the end of `value` string. |
| `length?` | `number` | If provided, it is used as the length of `value`. Defaults to value.length. |

#### Returns

`boolean`

#### Defined in

polyfills/string.ts:34

___

### polyStrStartsWith

▸ **polyStrStartsWith**(`value`, `searchString`, `position?`): `boolean`

This method lets you determine whether or not a string begins with another string. This method is case-sensitive.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be checked |
| `searchString` | `string` | The characters to be searched for at the start of the string |
| `position?` | `number` | [Optional] The position in this string at which to begin searching for `searchString`. Defaults to 0 |

#### Returns

`boolean`

`true` if the given characters are found at the beginning of the string; otherwise, `false`.

#### Defined in

polyfills/string.ts:19
