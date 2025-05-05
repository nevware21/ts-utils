/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022-2025 NevWare21 Solutions LLC
 * Licensed under the MIT license.
 */

import { assert } from "@nevware21/tripwire-chai";
import { isAsyncFunction, isGenerator, isAsyncGenerator, isFunction } from "../../../../src/helpers/base";

// This test suite is designed to check the functionality of the base helper functions
// As TypeScript rewrites the async and generator functions when the target is ES5, and
// we need to ensure that the tests are run in an environment that supports ES6+ features
describe("ESNext base tests", () => {
    describe("function types", () => {

        function _regularFunction() {
            return 42;
        }

        async function _asyncFunction() {
            return 42;
        }

        function* _generatorFunction() {
            yield 42;
        }

        async function* _asyncGeneratorFunction() {
            yield 42;
        }

        describe("isAsyncFunction", () => {
            it("should identify async functions correctly", () => {
                assert.equal(isAsyncFunction(_asyncFunction), true, "Should identify async function");
                assert.equal(isAsyncFunction(_regularFunction), false, "Should not identify regular function");
                assert.equal(isAsyncFunction(_generatorFunction), false, "Should not identify generator function");
                assert.equal(isAsyncFunction(_asyncGeneratorFunction), false, "Should not identify async generator function");
                assert.equal(isAsyncFunction(null), false, "Should handle null");
                assert.equal(isAsyncFunction(undefined), false, "Should handle undefined");
                assert.equal(isAsyncFunction({}), false, "Should handle object");
                assert.equal(isAsyncFunction([]), false, "Should handle array");
                assert.equal(isAsyncFunction(42), false, "Should handle number");
                assert.equal(isAsyncFunction("string"), false, "Should handle string");
                assert.equal(isAsyncFunction(true), false, "Should handle boolean");
            });
        });

        describe("isGenerator", () => {
            it("should identify generator functions correctly", () => {
                assert.equal(isGenerator(_generatorFunction), true, "Should identify generator function");
                assert.equal(isGenerator(_regularFunction), false, "Should not identify regular function");
                assert.equal(isGenerator(_asyncFunction), false, "Should not identify async function");
                assert.equal(isGenerator(_asyncGeneratorFunction), false, "Should not identify async generator function");
                assert.equal(isGenerator(null), false, "Should handle null");
                assert.equal(isGenerator(undefined), false, "Should handle undefined");
                assert.equal(isGenerator({}), false, "Should handle object");
                assert.equal(isGenerator([]), false, "Should handle array");
                assert.equal(isGenerator(42), false, "Should handle number");
                assert.equal(isGenerator("string"), false, "Should handle string");
                assert.equal(isGenerator(true), false, "Should handle boolean");
            });
        });

        describe("isAsyncGenerator", () => {
            it("should identify async generator functions correctly", () => {
                assert.equal(isAsyncGenerator(_asyncGeneratorFunction), true, "Should identify async generator function");
                assert.equal(isAsyncGenerator(_regularFunction), false, "Should not identify regular function");
                assert.equal(isAsyncGenerator(_asyncFunction), false, "Should not identify async function");
                assert.equal(isAsyncGenerator(_generatorFunction), false, "Should not identify generator function");
                assert.equal(isAsyncGenerator(null), false, "Should handle null");
                assert.equal(isAsyncGenerator(undefined), false, "Should handle undefined");
                assert.equal(isAsyncGenerator({}), false, "Should handle object");
                assert.equal(isAsyncGenerator([]), false, "Should handle array");
                assert.equal(isAsyncGenerator(42), false, "Should handle number");
                assert.equal(isAsyncGenerator("string"), false, "Should handle string");
                assert.equal(isAsyncGenerator(true), false, "Should handle boolean");
            });
        });

        describe("isFunction", () => {
            it("should identify all callable function types correctly", () => {
                assert.equal(isFunction(_regularFunction), true, "Should identify regular function");
                assert.equal(isFunction(_asyncFunction), true, "Should identify async function");
                assert.equal(isFunction(_generatorFunction), true, "Should identify generator function");
                assert.equal(isFunction(_asyncGeneratorFunction), true, "Should identify async generator function");
                assert.equal(isFunction(null), false, "Should handle null");
                assert.equal(isFunction(undefined), false, "Should handle undefined");
                assert.equal(isFunction({}), false, "Should handle object");
                assert.equal(isFunction([]), false, "Should handle array");
                assert.equal(isFunction(42), false, "Should handle number");
                assert.equal(isFunction("string"), false, "Should handle string");
                assert.equal(isFunction(true), false, "Should handle boolean");
                assert.equal(isFunction("function"), false, "Should handle string with function value");
            });

            it("should work with arrow functions", () => {
                const arrowFn = () => 42;
                const asyncArrowFn = async () => 42;
                assert.equal(isFunction(arrowFn), true, "Should identify arrow function");
                assert.equal(isFunction(asyncArrowFn), true, "Should identify async arrow function");
            });

            it("should work with function expressions", () => {
                const fnExpression = function() {
                    return 42;
                };
                const asyncFnExpression = async function() {
                    return 42;
                };
                const genFnExpression = function*() {
                    yield 42;
                };
                const asyncGenFnExpression = async function*() {
                    yield 42;
                };
                
                assert.equal(isFunction(fnExpression), true, "Should identify function expression");
                assert.equal(isFunction(asyncFnExpression), true, "Should identify async function expression");
                assert.equal(isFunction(genFnExpression), true, "Should identify generator function expression");
                assert.equal(isFunction(asyncGenFnExpression), true, "Should identify async generator function expression");
            });

            it("should work with class methods", () => {
                class TestClass {
                    regularMethod() {
                        return 42;
                    }
                    async asyncMethod() {
                        return 42;
                    }
                    *generatorMethod() {
                        yield 42;
                    }
                    async *asyncGeneratorMethod() {
                        yield 42;
                    }
                }
                
                const instance = new TestClass();
                assert.equal(isFunction(instance.regularMethod), true, "Should identify class method");
                assert.equal(isFunction(instance.asyncMethod), true, "Should identify async class method");
                assert.equal(isFunction(instance.generatorMethod), true, "Should identify generator class method");
                assert.equal(isFunction(instance.asyncGeneratorMethod), true, "Should identify async generator class method");
            });
        });
    });
});