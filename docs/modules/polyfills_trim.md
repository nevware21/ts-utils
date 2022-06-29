[@nevware21/ts-utils](../README.md) / polyfills/trim

# Module: polyfills/trim

## Table of contents

### Functions

- [polyStrTrim](polyfills_trim.md#polystrtrim)
- [polyStrTrimEnd](polyfills_trim.md#polystrtrimend)
- [polyStrTrimStart](polyfills_trim.md#polystrtrimstart)

## Functions

### polyStrTrim

▸ **polyStrTrim**(`value`): `string`

The trim() method removes whitespace from both ends of a string and returns a new string,
without modifying the original string. Whitespace in this context is all the whitespace
characters (space, tab, no-break space, etc.) and all the line terminator characters
(LF, CR, etc.).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string value to be trimmed. |

#### Returns

`string`

A new string representing str stripped of whitespace from both its beginning and end.
If neither the beginning or end of str has any whitespace, a new string is still returned (essentially
a copy of str), with no exception being thrown.
To return a new string with whitespace trimmed from just one end, use `strTrimStart()` or `strTrimEnd()`.

#### Defined in

[polyfills/trim.ts:38](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/polyfills/trim.ts#L38)

___

### polyStrTrimEnd

▸ **polyStrTrimEnd**(`value`): `string`

The `polyStrTrimEnd()` method removes whitespace from the end of a string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be trimmed. |

#### Returns

`string`

A new string representing str stripped of whitespace from its end (right side).
If the end of str has no whitespace, a new string is still returned (essentially a copy of str),
with no exception being thrown.

#### Defined in

[polyfills/trim.ts:56](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/polyfills/trim.ts#L56)

___

### polyStrTrimStart

▸ **polyStrTrimStart**(`value`): `string`

The `polyStrTrimStart()` method removes whitespace from the beginning of a string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be trimmed. |

#### Returns

`string`

A new string representing str stripped of whitespace from its beginning (left side).
If the beginning of str has no whitespace, a new string is still returned (essentially a copy of str),
with no exception being thrown.

#### Defined in

[polyfills/trim.ts:47](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/polyfills/trim.ts#L47)
