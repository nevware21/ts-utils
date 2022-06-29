[@nevware21/ts-utils](../README.md) / string/pad

# Module: string/pad

## Table of contents

### Functions

- [polyStrPadEnd](string_pad.md#polystrpadend)
- [polyStrPadStart](string_pad.md#polystrpadstart)
- [strPadEnd](string_pad.md#strpadend)
- [strPadStart](string_pad.md#strpadstart)

## Functions

### polyStrPadEnd

▸ **polyStrPadEnd**(`value`, `targetLength`, `padString?`): `string`

The `strPadEnd()` method pads the current string with a given string (repeated, if needed) so that
the resulting string reaches a given length. The padding is applied from the end of the current string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be padded |
| `targetLength` | `number` | The length of the resulting string once the current `value`` has been padded. If the `targetLength` is lower than `value.length`, the current string will be returned as-is. |
| `padString?` | `string` | The string to pad the current `value` with. If padString is too long to stay within `targetLength`, it will be truncated. The default value for this parameter is " " (U+0020). |

#### Returns

`string`

A String of the specified targetLength with the padString applied at the end of the current str.

#### Defined in

[string/pad.ts:95](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/string/pad.ts#L95)

___

### polyStrPadStart

▸ **polyStrPadStart**(`value`, `targetLength`, `padString?`): `string`

The `strPadStart()` method pads the current string with another string (multiple times, if needed)
until the resulting string reaches the given length. The padding is applied from the start of the
current string. Provided for runtimes that don't support see [padStart](https://caniuse.com/?search=padStart)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be padded |
| `targetLength` | `number` | The length of the resulting string once the current str has been padded. If the value is less than str.length, then str is returned as-is. |
| `padString?` | `string` | The string to pad the current str with. If padString is too long to stay within the targetLength, it will be truncated from the end. The default value is the unicode "space" character (U+0020). |

#### Returns

`string`

#### Defined in

[string/pad.ts:81](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/string/pad.ts#L81)

___

### strPadEnd

▸ **strPadEnd**(`value`, `targetLength`, `padString?`): `string`

The `strPadEnd()` method pads the current string with a given string (repeated, if needed) so that
the resulting string reaches a given length. The padding is applied from the end of the current string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be padded |
| `targetLength` | `number` | The length of the resulting string once the current `value`` has been padded. If the `targetLength` is lower than `value.length`, the current string will be returned as-is. |
| `padString?` | `string` | The string to pad the current `value` with. If padString is too long to stay within `targetLength`, it will be truncated: for left-to-right languages the left-most part and for right-to-left languages the right-most will be applied. The default value for this parameter is " " (U+0020). |

#### Returns

`string`

A String of the specified targetLength with the padString applied at the end of the current str.

#### Defined in

[string/pad.ts:66](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/string/pad.ts#L66)

___

### strPadStart

▸ **strPadStart**(`value`, `targetLength`, `padString?`): `string`

The `strPadStart()` method pads the current string with another string (multiple times, if needed)
until the resulting string reaches the given length. The padding is applied from the start of the
current string. This will use any native implementation if available, but will fall back to the
provided polyfill for runtimes that don't support [padStart](https://caniuse.com/?search=padStart)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The value to be padded |
| `targetLength` | `number` | The length of the resulting string once the current str has been padded. If the value is less than str.length, then str is returned as-is. |
| `padString?` | `string` | The string to pad the current str with. If padString is too long to stay within the targetLength, it will be truncated from the end. The default value is the unicode "space" character (U+0020). |

#### Returns

`string`

#### Defined in

[string/pad.ts:51](https://github.com/nevware21/ts-utils/blob/9e4a475/ts-utils/src/string/pad.ts#L51)
