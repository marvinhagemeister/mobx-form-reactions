import { assert as t } from "chai";
import { maxLength, minLength, pattern, range, required } from "../validations";

describe("required", () => {
  it("should fail if value is empty", () => {
    t.equal(required(""), false);
    t.equal(required(null), false);
    t.equal(required(undefined), false);
    t.equal(required([]), false);
    t.equal(required({}), false);
  });

  it("should succeed if value is present", () => {
    t.equal(required("a"), true);
    t.equal(required([1]), true);
    t.equal(required({ foo: 1 }), true);
  });
});

describe("minLength", () => {
  it("should fail if value is < min", () => {
    t.equal(minLength(2)(""), false);
    t.equal(minLength(2)("a"), false);
    t.equal(minLength(2)(null), false);
    t.equal(minLength(2)(undefined), false);
    t.equal(minLength(2)([1]), false);
  });

  it("should succeed if value is >= min", () => {
    t.equal(minLength(2)("aa"), true);
    t.equal(minLength(2)("aaa"), true);
    t.equal(minLength(2)([1, 3, 4]), true);
  });
});

describe("minLength", () => {
  it("should fail if value is > max", () => {
    t.equal(maxLength(2)("aaa"), false);
    t.equal(maxLength(2)("aaaaa"), false);
    t.equal(maxLength(2)(null), false);
    t.equal(maxLength(2)(undefined), false);
    t.equal(maxLength(2)([1, 2, 3]), false);
  });

  it("should succeed if value is <= max", () => {
    t.equal(maxLength(2)("aa"), true);
    t.equal(maxLength(2)("a"), true);
    t.equal(maxLength(2)([4]), true);
  });
});

describe("pattern", () => {
  it("should fail if value is > max", () => {
    t.equal(pattern(/foo/g)("aaa"), false);
    t.equal(pattern(/foo/g)(null), false);
    t.equal(pattern(/foo/g)(undefined), false);
    t.equal(pattern(/foo/g)([1, 2, 3]), false);
  });

  it("should succeed if value is <= max", () => {
    t.equal(pattern(/foo/g)("foo"), true);
  });
});

describe("range", () => {
  it("should fail if value is > max", () => {
    t.equal(range(1, 4)("aaa"), false);
    t.equal(range(1, 4)(null), false);
    t.equal(range(1, 4)(undefined), false);
    t.equal(range(1, 4)([1, 2, 3]), false);
  });

  it("should succeed if value is <= max", () => {
    t.equal(range(1, 4)(2), true);
    t.equal(range(1, 4)(3), true);
  });
});
