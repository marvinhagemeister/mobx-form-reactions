import { assert as t } from "chai";
import { action, computed, observable } from "mobx";
import { combineAsync, combine } from "../utils";

interface IIsABC {
  abc?: boolean;
}

interface IStartsWithA {
  startsWithA?: boolean;
}

const isABC = (value: any) => value !== "ABC" ? { isABC: true } : {};
const isABCAsync = (value: any) => Promise.resolve(isABC(value));
const startsWithA = (value: string) => value[0] !== "A" ? { startsWithA: true } : {};
const startsWithAAsync = (value: string) => Promise.resolve(startsWithA(value));

describe("combine", () => {
  it("should run synchronous validations", () => {
    const validate = combine<IIsABC & IStartsWithA>(isABC, startsWithA);
    t.deepEqual(validate("nope"), {
      isABC: true,
      startsWithA: true,
    });
  });
});

describe("combineAsync", () => {
  it("should work with synchronous validations", () => {
    const validate = combineAsync<IIsABC & IStartsWithA>(isABC, startsWithA);

    return validate("nope")
      .then(res => t.deepEqual(res, {
        isABC: true,
        startsWithA: true,
      }));
  });

  it("should work with asynchronous validations", () => {
    const validate = combineAsync<IIsABC & IStartsWithA>(isABCAsync, startsWithAAsync);

    return validate("nope")
      .then(res => t.deepEqual(res, {
        isABC: true,
        startsWithA: true,
      }));
  });

  it("should work with mixed synchronous and asynchronous", () => {
    const validate = combineAsync<IIsABC & IStartsWithA>(isABC, startsWithAAsync);

    return validate("nope")
      .then(res => t.deepEqual(res, {
        isABC: true,
        startsWithA: true,
      }));
  });
});
