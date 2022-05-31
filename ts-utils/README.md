<h1 align="center">@Nevware21 ts-utils</h1>
<h2 align="center">Common JavaScript functions for TypeScript</h2>


![GitHub Workflow Status (main)](https://img.shields.io/github/workflow/status/nevware21/ts-utils/NodeCI/main)
[![codecov](https://codecov.io/gh/nevware21/ts-utils/branch/main/graph/badge.svg?token=8YCAMUA7VB)](https://codecov.io/gh/nevware21/ts-utils)
[![npm version](https://badge.fury.io/js/%40nevware21%2Fts-utils.svg)](https://badge.fury.io/js/%40nevware21%2Fts-utils)
[![downloads](https://img.shields.io/npm/dt/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)
[![downloads](https://img.shields.io/npm/dm/%40nevware21/ts-utils.svg)](https://www.npmjs.com/package/%40nevware21/ts-utils)

## Description

This is a collection of general JavaScript functions (written in and for TypeScript) to aid with removing code duplication and assist with minification, as such the provided functions are expected to only rarely be included in their namespaced environment.

### Quickstart

Install the npm packare: `npm install @nevware21/ts-utils --save-dev`

```TypeScript

import { isString } from "@nevware21/ts-utils";

function checkString(value: any) {
    let ug = 1;

    return isString(value);
}
```
## Contributing

Read our [contributing guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

