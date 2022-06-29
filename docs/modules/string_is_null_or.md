[@nevware21/ts-utils](../README.md) / string/is\_null\_or

# Module: string/is\_null\_or

## Table of contents

### Functions

- [strIsNullOrEmpty](string_is_null_or.md#strisnullorempty)
- [strIsNullOrWhiteSpace](string_is_null_or.md#strisnullorwhitespace)

## Functions

### strIsNullOrEmpty

▸ **strIsNullOrEmpty**(`value`): `boolean`

Checks whether the passed `value` is null, undefined or an empty string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be checked. |

#### Returns

`boolean`

`true` if the string is null, undefined or an empty string.

#### Defined in

[string/is_null_or.ts:31](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/is_null_or.ts#L31)

___

### strIsNullOrWhiteSpace

▸ **strIsNullOrWhiteSpace**(`value`): `boolean`

This method checks if the string `value` is null, undefined, an empty string or only contains
whiltespace `\t \r \n \f \v` characters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be checked. |

#### Returns

`boolean`

`true` if the string is null, undefined an empty string or contains only whitespace characters.

#### Defined in

[string/is_null_or.ts:18](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/is_null_or.ts#L18)
