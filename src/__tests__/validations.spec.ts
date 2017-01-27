import { assert as t } from "chai";
import { maxLength, minLength, pattern, range, required } from "../validations";

describe("required", () => {
  it("should fail if value is empty", () => {
    t.deepEqual(required(""), { required: true });
    t.deepEqual(required(null), { required: true });
    t.deepEqual(required(undefined), { required: true });
    t.deepEqual(required([]), { required: true });
    t.deepEqual(required({}), { required: true });
  });

  it("should succeed if value is present", () => {
    t.deepEqual(required("a"), null);
    t.deepEqual(required([1]), null);
    t.deepEqual(required({ foo: 1 }), null);
  });
});

describe("minLength", () => {
  it("should fail if value is < min", () => {
    t.deepEqual(minLength(2)(""), { minLength: true });
    t.deepEqual(minLength(2)("a"), { minLength: true });
    t.deepEqual(minLength(2)(null), { minLength: true });
    t.deepEqual(minLength(2)(undefined), { minLength: true });
    t.deepEqual(minLength(2)([1]), { minLength: true });
  });

  it("should succeed if value is >= min", () => {
    t.equal(minLength(2)("aa"), null);
    t.equal(minLength(2)("aaa"), null);
    t.equal(minLength(2)([1, 3, 4]), null);
  });
});

describe("maxLength", () => {
  it("should fail if value is > max", () => {
    t.deepEqual(maxLength(2)("aaa"), { maxLength: true });
    t.deepEqual(maxLength(2)("aaaaa"), { maxLength: true });
    t.deepEqual(maxLength(2)(null), { maxLength: true });
    t.deepEqual(maxLength(2)(undefined), { maxLength: true });
    t.deepEqual(maxLength(2)([1, 2, 3]), { maxLength: true });
  });

  it("should succeed if value is <= max", () => {
    t.equal(maxLength(2)("aa"), null);
    t.equal(maxLength(2)("a"), null);
    t.equal(maxLength(2)([4]), null);
  });
});

describe("pattern", () => {
  it("should fail if value is > max", () => {
    t.deepEqual(pattern(/foo/g)("aaa"), { pattern: true });
    t.deepEqual(pattern(/foo/g)(null), { pattern: true });
    t.deepEqual(pattern(/foo/g)(undefined), { pattern: true });
    t.deepEqual(pattern(/foo/g)([1, 2, 3]), { pattern: true });
  });

  it("should succeed if value is <= max", () => {
    t.equal(pattern(/foo/g)("foo"), null);
  });
});

describe("range", () => {
  it("should fail if value is > max", () => {
    t.deepEqual(range(1, 4)("aaa"), { range: true });
    t.deepEqual(range(1, 4)(null), { range: true });
    t.deepEqual(range(1, 4)(undefined), { range: true });
    t.deepEqual(range(1, 4)([1, 2, 3]), { range: true });
  });

  it("should succeed if value is <= max", () => {
    t.equal(range(1, 4)(2), null);
    t.equal(range(1, 4)(3), null);
  });
});
