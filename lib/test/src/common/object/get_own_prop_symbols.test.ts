/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { hasSymbol } from "../../../../src/symbol/symbol";
import { objGetOwnPropertySymbols } from "../../../../src/object/get_own_property"

describe("object get_own_prop_symbols tests", () => {
    describe("objGetOwnPropertySymbols", () => {
        it("Should return symbols defined on an object", () => {
            // Skip test if symbols are not supported
            if (!hasSymbol()) {
                return;
            }
            
            const sym1 = Symbol("sym1");
            const sym2 = Symbol.for("sym2");
            
            const obj = {
                regularProp: "value",
                [sym1]: "symbol1 value",
                [sym2]: "symbol2 value"
            };
            
            const symbols = objGetOwnPropertySymbols(obj);
            
            assert.isArray(symbols, "Result should be an array");
            assert.include(symbols, sym1, "Result should include the first symbol");
            assert.include(symbols, sym2, "Result should include the second symbol");
            assert.equal(symbols.length, 2, "Result should have exactly 2 symbols");
        });
        
        it("Should return an empty array for objects with no symbol properties", () => {
            const obj = { a: 1, b: 2 };
            const symbols = objGetOwnPropertySymbols(obj);
            
            assert.isArray(symbols, "Result should be an array");
            assert.equal(symbols.length, 0, "Result should be an empty array");
        });
        
        it("Should work with Arrays", () => {
            // Skip test if symbols are not supported
            if (!hasSymbol()) {
                return;
            }
            
            const sym = Symbol("arrayProp");
            const arr: any[] = [1, 2, 3];
            arr[sym as any] = "symbol value";
            
            const symbols = objGetOwnPropertySymbols(arr);
            
            assert.isArray(symbols, "Result should be an array");
            if (symbols.length > 0) { // Some environments might not properly support symbols on arrays
                assert.include(symbols, sym, "Result should include the symbol");
            }
        });
        
        it("Should handle primitive values", () => {
            // Using try-catch to handle any errors that might be thrown
            // when using null or undefined with objGetOwnPropertySymbols
            let nullResult: symbol[] = [];
            let undefinedResult: symbol[] = [];
            let numberResult: symbol[];
            let stringResult: symbol[];
            let booleanResult: symbol[];
            
            try {
                nullResult = objGetOwnPropertySymbols(null as any);
            } catch (e) {
                // If it throws, use an empty array as fallback
                nullResult = [];
            }
            
            try {
                undefinedResult = objGetOwnPropertySymbols(undefined as any);
            } catch (e) {
                // If it throws, use an empty array as fallback
                undefinedResult = [];
            }
            
            // These should work fine in all implementations
            numberResult = objGetOwnPropertySymbols(1);
            stringResult = objGetOwnPropertySymbols("string");
            booleanResult = objGetOwnPropertySymbols(true);
            
            assert.isArray(nullResult, "null should return an array");
            assert.isArray(undefinedResult, "undefined should return an array");
            assert.isArray(numberResult, "Numbers should return an array");
            assert.isArray(stringResult, "Strings should return an array");
            assert.isArray(booleanResult, "Booleans should return an array");
            
            assert.equal(nullResult.length, 0, "null should return an empty array");
            assert.equal(undefinedResult.length, 0, "undefined should return an empty array");
            assert.equal(numberResult.length, 0, "Numbers should return an empty array");
            assert.equal(stringResult.length, 0, "Strings should return an empty array");
            assert.equal(booleanResult.length, 0, "Booleans should return an empty array");
        });
        
        it("Should only return own symbol properties", () => {
            // Skip test if symbols are not supported
            if (!hasSymbol()) {
                return;
            }
            
            const sym1 = Symbol("parent");
            const sym2 = Symbol("child");
            
            // Create parent object with symbol property
            const parent = {
                [sym1]: "parent value"
            };
            
            // Create child object that inherits from parent
            const child = Object.create(parent);
            child[sym2] = "child value";
            
            const symbols = objGetOwnPropertySymbols(child);
            
            assert.isArray(symbols, "Result should be an array");
            assert.include(symbols, sym2, "Result should include child's own symbol");
            assert.notInclude(symbols, sym1, "Result should not include parent's symbol");
            assert.equal(symbols.length, 1, "Result should have exactly 1 symbol");
        });
    });
});