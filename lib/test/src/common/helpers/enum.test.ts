/*
 * @nevware21/ts-utils
 * https://github.com/nevware21/ts-utils
 *
 * Copyright (c) 2022 Nevware21
 * Licensed under the MIT license.
 */

import { assert } from "chai";
import { createEnum, createEnumKeyMap, createEnumValueMap, createSimpleMap, createTypeMap } from "../../../../src/helpers/enum";
import { isNumber, isString } from "../../../../src/helpers/base";

type If<E, T, Y, N> = T extends E ? Y : N;
type Is<E, T> = If<E, T, T, never>;

type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N;
type IsAny<T> = IfAny<T, T, never>;
type IsNotAny<T> = IfAny<T, never, T>;

// Helper functions which check whether the passed type is any or not
// Designed to causes a compile error
const chkNotAny = <T>(x: IsNotAny<T>) => true;
const chkIsAny = <T>(x: IsAny<T>) => true;

const chkIs = <E, T = E>(x: Is<E, T>, validator: (arg: T) => boolean) => validator ? validator(x) : true;

describe("enum helpers", () => {
    it("createEnum", () => {
        const enum Animal {
            Dog = 0,
            Cat = 1,
            Butterfly = 2,
            Bear = 3
        }

        const animalEnum = createEnum<typeof Animal>({
            Dog: Animal.Dog,
            Cat: Animal.Cat,
            Butterfly: Animal.Butterfly,
            Bear: Animal.Bear
        });

        assert.equal(chkNotAny(animalEnum.Dog), true);
        assert.equal(chkNotAny(animalEnum[Animal.Dog]), true);
        assert.equal(chkNotAny(animalEnum[0]), true);
        assert.equal(chkNotAny(animalEnum["Dog"]), true);
        assert.equal(chkIsAny(animalEnum["Hello"]), true);

        assert.equal(chkIs<Animal>(animalEnum.Dog, isNumber), true);
        assert.equal(chkIs<String>(animalEnum[Animal.Dog], isString), true);
        assert.equal(chkIs<String>(animalEnum[0], isString), true);
        assert.equal(chkIs<Animal>(animalEnum["Dog"], isNumber), true);

        // You end up with an object that maps everything to the name
        assert.equal(animalEnum.Dog, 0);
        assert.equal(animalEnum[0], "Dog");
        assert.equal(animalEnum[Animal.Dog], "Dog");
        assert.equal(animalEnum["Dog"], 0);
        assert.equal(animalEnum.Cat, 1);
        assert.equal(animalEnum[1], "Cat");
        assert.equal(animalEnum[Animal.Cat], "Cat");
        assert.equal(animalEnum["Cat"], 1);
        assert.equal(animalEnum.Butterfly, 2);
        assert.equal(animalEnum[2], "Butterfly");
        assert.equal(animalEnum[Animal.Butterfly], "Butterfly");
        assert.equal(animalEnum["Butterfly"], 2);
        assert.equal(animalEnum.Bear, 3);
        assert.equal(animalEnum[3], "Bear");
        assert.equal(animalEnum[Animal.Bear], "Bear");
        assert.equal(animalEnum["Bear"], 3);
    });

    it("createEnumKeyMap", () => {
        const enum Animal {
            Dog = 0,
            Cat = 1,
            Butterfly = 2,
            Bear = 3
        }

        const animalEnum = createEnumKeyMap<typeof Animal>({
            Dog: Animal.Dog,
            Cat: Animal.Cat,
            Butterfly: Animal.Butterfly,
            Bear: Animal.Bear
        });

        assert.equal(chkNotAny(animalEnum.Dog), true);
        assert.equal(chkNotAny(animalEnum[Animal.Dog]), true);
        assert.equal(chkNotAny(animalEnum[0]), true);
        assert.equal(chkNotAny(animalEnum["Bear"]), true);
        assert.equal(chkIsAny(animalEnum["Hello"]), true);

        assert.equal(chkIs<String>(animalEnum.Dog, isString), true);
        assert.equal(chkIs<String>(animalEnum[Animal.Dog], isString), true);
        assert.equal(chkIs<String>(animalEnum[0], isString), true);
        assert.equal(chkIs<String>(animalEnum["Dog"], isString), true);

        // You end up with an object that maps everything to the name
        assert.equal(animalEnum.Dog, "Dog");
        assert.equal(animalEnum[0], "Dog");
        assert.equal(animalEnum[Animal.Dog], "Dog");
        assert.equal(animalEnum["Dog"], "Dog");
        assert.equal(animalEnum.Cat, "Cat");
        assert.equal(animalEnum[1], "Cat");
        assert.equal(animalEnum[Animal.Cat], "Cat");
        assert.equal(animalEnum["Cat"], "Cat");
        assert.equal(animalEnum.Butterfly, "Butterfly");
        assert.equal(animalEnum[2], "Butterfly");
        assert.equal(animalEnum[Animal.Butterfly], "Butterfly");
        assert.equal(animalEnum["Butterfly"], "Butterfly");
        assert.equal(animalEnum.Bear, "Bear");
        assert.equal(animalEnum[3], "Bear");
        assert.equal(animalEnum[Animal.Bear], "Bear");
        assert.equal(animalEnum["Bear"], "Bear");
    });

    it("createEnumValueMap", () => {
        const enum Animal {
            Dog = 0,
            Cat = 1,
            Butterfly = 2,
            Bear = 3
        }

        const animalEnum = createEnumValueMap<typeof Animal>({
            Dog: Animal.Dog,
            Cat: Animal.Cat,
            Butterfly: Animal.Butterfly,
            Bear: Animal.Bear
        });

        assert.equal(chkNotAny(animalEnum.Dog), true);
        assert.equal(chkNotAny(animalEnum[Animal.Dog]), true);
        assert.equal(chkNotAny(animalEnum[0]), true);
        assert.equal(chkNotAny(animalEnum["Bear"]), true);
        assert.equal(chkIsAny(animalEnum["Hello"]), true);

        assert.equal(chkIs<Animal>(animalEnum.Dog, isNumber), true);
        assert.equal(chkIs<Animal>(animalEnum[Animal.Dog], isNumber), true);
        assert.equal(chkIs<Animal>(animalEnum[0], isNumber), true);
        assert.equal(chkIs<Animal>(animalEnum["Dog"], isNumber), true);

        // You end up with an object that maps everything to the name
        assert.equal(animalEnum.Dog, 0);
        assert.equal(animalEnum[0], 0);
        assert.equal(animalEnum["Dog"], 0);
        assert.equal(animalEnum.Cat, 1);
        assert.equal(animalEnum[1], 1);
        assert.equal(animalEnum["Cat"], 1);
        assert.equal(animalEnum.Butterfly, 2);
        assert.equal(animalEnum[2], 2);
        assert.equal(animalEnum["Butterfly"], 2);
        assert.equal(animalEnum.Bear, 3);
        assert.equal(animalEnum[3], 3);
        assert.equal(animalEnum["Bear"], 3);
    });

    it("createSimpleMap", () => {
        const enum Animal {
            Dog = 0,
            Cat = 1,
            Butterfly = 2,
            Bear = 3
        }

        // Creates a simple map where the key maps to the specificed generic type
        const animalFamilyMap = createSimpleMap<typeof Animal, string>({
            Dog: [ Animal.Dog, "Canidae"],
            Cat: [ Animal.Cat, "Felidae"],
            Butterfly: [ Animal.Butterfly, "Papilionidae"],
            Bear: [ Animal.Bear, "Ursidae"]
        });
       
        assert.equal(chkNotAny(animalFamilyMap.Dog), true);
        assert.equal(chkNotAny(animalFamilyMap[Animal.Dog]), true);
        assert.equal(chkNotAny(animalFamilyMap[0]), true);
        assert.equal(chkNotAny(animalFamilyMap["Bear"]), true);
        assert.equal(chkIsAny(animalFamilyMap["Hello"]), true);

        assert.equal(chkIs<String>(animalFamilyMap.Dog, isString), true);
        assert.equal(chkIs<String>(animalFamilyMap[Animal.Dog], isString), true);
        assert.equal(chkIs<String>(animalFamilyMap[0], isString), true);
        assert.equal(chkIs<String>(animalFamilyMap["Dog"], isString), true);

        // You end up with an object that maps everything to the name
        assert.equal(animalFamilyMap.Dog, "Canidae");
        assert.equal(animalFamilyMap[0], "Canidae");
        assert.equal(animalFamilyMap["Dog"], "Canidae");
        assert.equal(animalFamilyMap.Cat, "Felidae");
        assert.equal(animalFamilyMap[1], "Felidae");
        assert.equal(animalFamilyMap["Cat"], "Felidae");
        assert.equal(animalFamilyMap.Butterfly, "Papilionidae");
        assert.equal(animalFamilyMap[2], "Papilionidae");
        assert.equal(animalFamilyMap["Butterfly"], "Papilionidae");
        assert.equal(animalFamilyMap.Bear, "Ursidae");
        assert.equal(animalFamilyMap[3], "Ursidae");
        assert.equal(animalFamilyMap["Bear"], "Ursidae");
    });

    it("createTypeMap", () => {
        const enum Animal {
            Dog = 0,
            Cat = 1,
            Butterfly = 2,
            Bear = 3
        }

        // Create a strongly types map
        const animalFamilyMap = createTypeMap<typeof Animal, {
            // Defined the enum lookups
            [Animal.Dog]: "Canidae",
            [Animal.Cat]: "Felidae",
            [Animal.Butterfly]: "Papilionidae",
            [Animal.Bear]: "Ursidae",
            // Defined Named reference
            Dog: "Canidae",
            Cat: "Felidae",
            Butterfly: "Papilionidae",
            Bear: "Ursidae",
        }>({
            Dog: [ Animal.Dog, "Canidae"],
            Cat: [ Animal.Cat, "Felidae"],
            Butterfly: [ Animal.Butterfly, "Papilionidae"],
            Bear: [ Animal.Bear, "Ursidae"]
        });
       
        assert.equal(chkNotAny(animalFamilyMap.Dog), true);
        assert.equal(chkNotAny(animalFamilyMap[Animal.Dog]), true);
        assert.equal(chkNotAny(animalFamilyMap[0]), true);
        assert.equal(chkNotAny(animalFamilyMap["Bear"]), true);
        assert.equal(chkIsAny(animalFamilyMap["Hello"]), true);

        assert.equal(chkIs<String>(animalFamilyMap.Dog, isString), true);
        assert.equal(chkIs<String>(animalFamilyMap[Animal.Dog], isString), true);
        assert.equal(chkIs<String>(animalFamilyMap[0], isString), true);
        assert.equal(chkIs<String>(animalFamilyMap["Dog"], isString), true);

        // You end up with an object that maps everything to the name
        assert.equal(animalFamilyMap.Dog, "Canidae");
        assert.equal(animalFamilyMap[0], "Canidae");
        assert.equal(animalFamilyMap["Dog"], "Canidae");
        assert.equal(animalFamilyMap.Cat, "Felidae");
        assert.equal(animalFamilyMap[1], "Felidae");
        assert.equal(animalFamilyMap["Cat"], "Felidae");
        assert.equal(animalFamilyMap.Butterfly, "Papilionidae");
        assert.equal(animalFamilyMap[2], "Papilionidae");
        assert.equal(animalFamilyMap["Butterfly"], "Papilionidae");
        assert.equal(animalFamilyMap.Bear, "Ursidae");
        assert.equal(animalFamilyMap[3], "Ursidae");
        assert.equal(animalFamilyMap["Bear"], "Ursidae");
    });

    it("createTypeMap with weak interface", () => {
        const enum Animal {
            Dog = 0,
            Cat = 1,
            Butterfly = 2,
            Bear = 3
        }

        interface IAnimalFamilyMap {
            Dog: string,
            Cat: string,
            Butterfly: string,
            Bear: string
        }

        // Create a strongly types map
        const animalFamilyMap = createTypeMap<typeof Animal, IAnimalFamilyMap & {
            // Defined the enum lookups
            [Animal.Dog]: "Canidae",
            [Animal.Cat]: "Felidae",
            [Animal.Butterfly]: "Papilionidae",
            [Animal.Bear]: "Ursidae",
            // Defined Named reference
            Dog: "Canidae",
            Cat: "Felidae",
            Butterfly: "Papilionidae",
            Bear: "Ursidae",
        }>({
            Dog: [ Animal.Dog, "Canidae"],
            Cat: [ Animal.Cat, "Felidae"],
            Butterfly: [ Animal.Butterfly, "Papilionidae"],
            Bear: [ Animal.Bear, "Ursidae"]
        });
       
        assert.equal(chkNotAny(animalFamilyMap.Dog), true);
        assert.equal(chkNotAny(animalFamilyMap[Animal.Dog]), true);
        assert.equal(chkNotAny(animalFamilyMap[0]), true);
        assert.equal(chkNotAny(animalFamilyMap["Bear"]), true);
        assert.equal(chkIsAny(animalFamilyMap["Hello"]), true);

        assert.equal(chkIs<String>(animalFamilyMap.Dog, isString), true);
        assert.equal(chkIs<String>(animalFamilyMap[Animal.Dog], isString), true);
        assert.equal(chkIs<String>(animalFamilyMap[0], isString), true);
        assert.equal(chkIs<String>(animalFamilyMap["Dog"], isString), true);

        // You end up with an object that maps everything to the name
        assert.equal(animalFamilyMap.Dog, "Canidae");
        assert.equal(animalFamilyMap[0], "Canidae");
        assert.equal(animalFamilyMap["Dog"], "Canidae");
        assert.equal(animalFamilyMap.Cat, "Felidae");
        assert.equal(animalFamilyMap[1], "Felidae");
        assert.equal(animalFamilyMap["Cat"], "Felidae");
        assert.equal(animalFamilyMap.Butterfly, "Papilionidae");
        assert.equal(animalFamilyMap[2], "Papilionidae");
        assert.equal(animalFamilyMap["Butterfly"], "Papilionidae");
        assert.equal(animalFamilyMap.Bear, "Ursidae");
        assert.equal(animalFamilyMap[3], "Ursidae");
        assert.equal(animalFamilyMap["Bear"], "Ursidae");
    });

    it("createTypeMap with typed interface", () => {
        const enum Animal {
            Dog = 0,
            Cat = 1,
            Butterfly = 2,
            Bear = 3
        }

        interface IAnimalFamilyMap {
            Dog: "Canidae",
            Cat: "Felidae",
            Butterfly: "Papilionidae",
            Bear: "Ursidae"
        }

        // Create a strongly types map
        const animalFamilyMap = createTypeMap<typeof Animal, IAnimalFamilyMap & {
            // Defined the enum lookups
            [Animal.Dog]: "Canidae",
            [Animal.Cat]: "Felidae",
            [Animal.Butterfly]: "Papilionidae",
            [Animal.Bear]: "Ursidae"
        }>({
            Dog: [ Animal.Dog, "Canidae"],
            Cat: [ Animal.Cat, "Felidae"],
            Butterfly: [ Animal.Butterfly, "Papilionidae"],
            Bear: [ Animal.Bear, "Ursidae"]
        });
       
        assert.equal(chkNotAny(animalFamilyMap.Dog), true);
        assert.equal(chkNotAny(animalFamilyMap[Animal.Dog]), true);
        assert.equal(chkNotAny(animalFamilyMap[0]), true);
        assert.equal(chkNotAny(animalFamilyMap["Bear"]), true);
        assert.equal(chkIsAny(animalFamilyMap["Hello"]), true);

        assert.equal(chkIs<String>(animalFamilyMap.Dog, isString), true);
        assert.equal(chkIs<String>(animalFamilyMap[Animal.Dog], isString), true);
        assert.equal(chkIs<String>(animalFamilyMap[0], isString), true);
        assert.equal(chkIs<String>(animalFamilyMap["Dog"], isString), true);

        // You end up with an object that maps everything to the name
        assert.equal(animalFamilyMap.Dog, "Canidae");
        assert.equal(animalFamilyMap[0], "Canidae");
        assert.equal(animalFamilyMap["Dog"], "Canidae");
        assert.equal(animalFamilyMap.Cat, "Felidae");
        assert.equal(animalFamilyMap[1], "Felidae");
        assert.equal(animalFamilyMap["Cat"], "Felidae");
        assert.equal(animalFamilyMap.Butterfly, "Papilionidae");
        assert.equal(animalFamilyMap[2], "Papilionidae");
        assert.equal(animalFamilyMap["Butterfly"], "Papilionidae");
        assert.equal(animalFamilyMap.Bear, "Ursidae");
        assert.equal(animalFamilyMap[3], "Ursidae");
        assert.equal(animalFamilyMap["Bear"], "Ursidae");
    });
});
