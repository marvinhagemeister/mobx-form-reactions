import { assert as t } from "chai";
import { action, computed, observable } from "mobx";
import { combineAsync, combine } from "../utils";

// describe("createFormModel", () => {
//   it("should create a view model with observable keys", () => {
//     class Model {
//       @observable name: string = null;
//       @observable surname: string = null;

//       @computed get fullName() {
//         return this.name + " " + this.surname;
//       }

//       @action doSomething() {
//         this.surname = Math.random() + "";
//       }
//     }

//     const model = new Model();

//     console.log((Object as any).getOwnPropertyDescriptors(model));

//     console.log(model);
//     console.log(Object.keys(model));
//   });
// });

const isABC = (value: string) => value !== "ABC" ? { isABC: true } : null;
const isABCAsync = (value: string) => Promise.resolve(isABC(value));
const startsWithA = (value: string) => value[0] !== "A" ? { startsWithA: true } : null;
const startsWithAAsync = (value: string) => Promise.resolve(startsWithA(value));

describe("combine", () => {
  it("should run synchronous validations", () => {
    const validate = combine(isABC, startsWithA);
    t.deepEqual(validate("nope"), {
      isABC: true,
      startsWithA: true,
    });
  });
});

describe("combineAsync", () => {
  it("should work with synchronous validations", () => {
    const validate = combineAsync(isABC, startsWithA);

    return validate("nope")
      .then(res => t.deepEqual(res, {
        isABC: true,
        startsWithA: true,
      }));
  });

  it("should work with asynchronous validations", () => {
    const validate = combineAsync(isABCAsync, startsWithAAsync);

    return validate("nope")
      .then(res => t.deepEqual(res, {
        isABC: true,
        startsWithA: true,
      }));
  });

  it("should work with mixed synchronous and asynchronous", () => {
    const validate = combineAsync(isABC, startsWithAAsync);

    return validate("nope")
      .then(res => t.deepEqual(res, {
        isABC: true,
        startsWithA: true,
      }));
  });
});
