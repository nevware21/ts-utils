[@nevware21/ts-utils](../README.md) / string/starts\_with

# Module: string/starts\_with

## Table of contents

### Functions

- [polyStrStartsWith](string_starts_with.md#polystrstartswith)
- [strStartsWith](string_starts_with.md#strstartswith)

## Functions

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

[string/starts_with.ts:36](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/starts_with.ts#L36)

___

### strStartsWith

▸ **strStartsWith**(`value`, `searchString`, `position?`): `boolean`

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

[string/starts_with.ts:22](https://github.com/nevware21/ts-utils/blob/e2a920b/ts-utils/src/string/starts_with.ts#L22)
