/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2023 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { readArgs }  from "../../../../src/funcs/readArgs";
import { _initTestHooks } from "../../../../src/helpers/lazy";

describe("args helpers", () => {
    describe("readArgs", () => {

        let _orgSymbol = Symbol;
        beforeEach(() => {
            _orgSymbol = Symbol;
            _initTestHooks();
        });
    
        afterEach(() => {
            // eslint-disable-next-line no-global-assign
            Symbol = _orgSymbol;
        });
        
        function* myGenerator() {
            yield "Hello";
            yield "Darkness";
            yield "my";
            yield "old";
            yield "friend";
        }

        function* myGenerator2() {
            yield "I've";
            yield "come";
            yield "to";
            yield "talk";
            yield "with";
            yield "you";
            yield "again";
        }

        it("examples", () => {
            let _allArgs: any[] = [];
            let _optArgs: any[] = [];
    
            function myFunc<T>(firstArg: T, ...otherArgs: any[]) {
                // Read all of the arguments
                _allArgs = readArgs(arguments);
             
                // Get all of the arguments after the first
                _optArgs = readArgs(arguments, 1);
            }
    
            myFunc("Hello");
            assert.deepEqual(_allArgs, [ "Hello" ]);
            assert.deepEqual(_optArgs, []);

            myFunc("Hello", "Darkness", "my", "old", "friend");
            assert.deepEqual(_allArgs, [ "Hello", "Darkness", "my", "old", "friend" ]);
            assert.deepEqual(_optArgs, [ "Darkness", "my", "old", "friend"]);
        });

        it("examples 2", () => {
            let theArgs: any[] = readArgs(myGenerator());

            assert.deepEqual(theArgs, [ "Hello", "Darkness", "my", "old", "friend"]);

            theArgs = readArgs(myGenerator(), 1);
            assert.deepEqual(theArgs, [ "Darkness", "my", "old", "friend"]);

            theArgs = readArgs(myGenerator(), 1, 3);
            assert.deepEqual(theArgs, [ "Darkness", "my" ]);

            theArgs = readArgs(myGenerator(), 0, 3);
            assert.deepEqual(theArgs, [ "Hello", "Darkness", "my" ]);

            theArgs = readArgs(myGenerator(), -1, 3);
            assert.deepEqual(theArgs, [ ]);

            theArgs = readArgs(myGenerator(), -4, 3);
            assert.deepEqual(theArgs, [ "Darkness", "my" ]);

            theArgs = readArgs(myGenerator2());
            assert.deepEqual(theArgs, [ "I've", "come", "to", "talk", "with", "you", "again" ]);

            theArgs = readArgs(myGenerator2(), 0, -2);
            assert.deepEqual(theArgs, [ "I've", "come", "to", "talk", "with" ]);

            theArgs = readArgs(myGenerator2(), -3, -2);
            assert.deepEqual(theArgs, [ "with" ]);
        });
    });
});

