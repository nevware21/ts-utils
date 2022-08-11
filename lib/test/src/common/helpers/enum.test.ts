import { assert } from "chai";
import { createEnum, createEnumKeyMap, createEnumValueMap, createSimpleMap, createTypeMap } from "../../../../src/helpers/enum";

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
        // You end up with an object that maps everything to the name
        assert.equal(animalEnum.Dog, 0);
        assert.equal(animalEnum[0], "Dog");
        assert.equal(animalEnum["Dog"], 0);
        assert.equal(animalEnum.Cat, 1);
        assert.equal(animalEnum[1], "Cat");
        assert.equal(animalEnum["Cat"], 1);
        assert.equal(animalEnum.Butterfly, 2);
        assert.equal(animalEnum[2], "Butterfly");
        assert.equal(animalEnum["Butterfly"], 2);
        assert.equal(animalEnum.Bear, 3);
        assert.equal(animalEnum[3], "Bear");
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
        // You end up with an object that maps everything to the name
        assert.equal(animalEnum.Dog, "Dog");
        assert.equal(animalEnum[0], "Dog");
        assert.equal(animalEnum["Dog"], "Dog");
        assert.equal(animalEnum.Cat, "Cat");
        assert.equal(animalEnum[1], "Cat");
        assert.equal(animalEnum["Cat"], "Cat");
        assert.equal(animalEnum.Butterfly, "Butterfly");
        assert.equal(animalEnum[2], "Butterfly");
        assert.equal(animalEnum["Butterfly"], "Butterfly");
        assert.equal(animalEnum.Bear, "Bear");
        assert.equal(animalEnum[3], "Bear");
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
