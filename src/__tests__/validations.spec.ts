import { assert as t } from "chai";
import {
  isBoolean,
  isNumber,
  maxLength,
  minLength,
  oneOf,
  pattern,
  range,
  required,
} from "../validations";

describe("required", () => {
  it("should fail if value is empty", () => {
    t.deepEqual(required(""), { required: true });
    t.deepEqual(required(null), { required: true });
    t.deepEqual(required(undefined), { required: true });
    t.deepEqual(required([]), { required: true });
    t.deepEqual(required({}), { required: true });
  });

  it("should succeed if value is present", () => {
    t.deepEqual(required("a"), {});
    t.deepEqual(required([1]), {});
    t.deepEqual(required({ foo: 1 }), {});
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
    t.deepEqual(minLength(2)("aa"), {});
    t.deepEqual(minLength(2)("aaa"), {});
    t.deepEqual(minLength(2)([1, 3, 4]), {});
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
    t.deepEqual(maxLength(2)("aa"), {});
    t.deepEqual(maxLength(2)("a"), {});
    t.deepEqual(maxLength(2)([4]), {});
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
    t.deepEqual(pattern(/foo/g)("foo"), {});
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
    t.deepEqual(range(1, 4)(2), {});
    t.deepEqual(range(1, 4)(3), {});
  });
});

describe("oneOf", () => {
  it("should fail if value is not in haystack", () => {
    t.deepEqual(oneOf(["foo", "bar"])("baz"), { oneOf: true });
    t.deepEqual(oneOf([1, 2])(3), { oneOf: true });
  });

  it("should succeed if value is in haystack", () => {
    t.deepEqual(oneOf(["foo", "bar"])("foo"), {});
    t.deepEqual(oneOf([1, 2])(1), {});
  });
});

describe("isBoolean", () => {
  it("should fail if value is not a boolean", () => {
    t.deepEqual(isBoolean("nope"), { isBoolean: true });
    t.deepEqual(isBoolean("false"), { isBoolean: true });
    t.deepEqual(isBoolean("true"), { isBoolean: true });
    t.deepEqual(isBoolean(0), { isBoolean: true });
  });

  it("should succeed if value is a boolean", () => {
    t.deepEqual(isBoolean(true), {});
    t.deepEqual(isBoolean(false), {});
  });
});

describe("isNumber", () => {
  it("should fail if value is not a number", () => {
    t.deepEqual(isNumber("1"), { isNumber: true });
    t.deepEqual(isNumber("a"), { isNumber: true });
    t.deepEqual(isNumber(true), { isNumber: true });
    t.deepEqual(isNumber(null), { isNumber: true });
  });

  it("should succeed if value is a number", () => {
    t.deepEqual(isNumber(1), {});
    t.deepEqual(isNumber(0), {});
    t.deepEqual(isNumber(-1), {});
    t.deepEqual(isNumber(1000), {});
  });
});
