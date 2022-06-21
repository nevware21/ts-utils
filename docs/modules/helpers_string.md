[@nevware21/ts-utils](../README.md) / helpers/string

# Module: helpers/string

## Table of contents

### Functions

- [strEndsWith](helpers_string.md#strendswith)
- [strIsNullOrEmpty](helpers_string.md#strisnullorempty)
- [strIsNullOrWhiteSpace](helpers_string.md#strisnullorwhitespace)
- [strStartsWith](helpers_string.md#strstartswith)

## Functions

### strEndsWith

▸ **strEndsWith**(`value`, `searchString`, `length?`): `any`

This method lets you determine whether or not a string ends with another string. This method is case-sensitive.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be checked |
| `searchString` | `string` | The characters to be searched for at the end of `value` string. |
| `length?` | `number` | If provided, it is used as the length of `value`. Defaults to value.length. |

#### Returns

`any`

#### Defined in

[helpers/string.ts:66](https://github.com/nevware21/ts-utils/blob/65eb5b0/ts-utils/src/helpers/string.ts#L66)

___

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

[helpers/string.ts:38](https://github.com/nevware21/ts-utils/blob/65eb5b0/ts-utils/src/helpers/string.ts#L38)

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

[helpers/string.ts:25](https://github.com/nevware21/ts-utils/blob/65eb5b0/ts-utils/src/helpers/string.ts#L25)

___

### strStartsWith

▸ **strStartsWith**(`value`, `searchString`, `position?`): `any`

This method lets you determine whether or not a string begins with another string. This method is case-sensitive.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be checked |
| `searchString` | `string` | The characters to be searched for at the start of the string |
| `position?` | `number` | [Optional] The position in this string at which to begin searching for `searchString`. Defaults to 0 |

#### Returns

`any`

`true` if the given characters are found at the beginning of the string; otherwise, `false`.

#### Defined in

[helpers/string.ts:54](https://github.com/nevware21/ts-utils/blob/65eb5b0/ts-utils/src/helpers/string.ts#L54)
