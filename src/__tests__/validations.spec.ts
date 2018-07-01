import * as t from "assert";
import { maxLength, minLength, pattern, required } from "../validations";

describe("required", () => {
  it("should fail if value is empty", () => {
    t.equal(required(""), "required");
    t.equal(required("  "), "required");
    t.equal(required(null), "required");
    t.equal(required(undefined as any), "required");
    t.equal(required([] as any), "required");
    t.equal(required({} as any), "required");
  });

  it("should succeed if value is present", () => {
    t.equal(required("a"), undefined);
    t.equal(required([1]), undefined);
    t.equal(required({ foo: 1 }), undefined);
  });
});

describe("minLength", () => {
  it("should fail if value is < min", () => {
    t.equal(minLength(2)(""), "minLength");
    t.equal(minLength(2)("a"), "minLength");
    t.equal(minLength(2)([1]), "minLength");
  });

  it("should succeed if value is >= min", () => {
    t.equal(minLength(2)("aa"), undefined);
    t.equal(minLength(2)("aaa"), undefined);
    t.equal(minLength(2)([1, 3, 4]), undefined);
  });
});

describe("maxLength", () => {
  it("should fail if value is > max", () => {
    t.equal(maxLength(2)("aaa"), "maxLength");
    t.equal(maxLength(2)("aaaaa"), "maxLength");
    t.equal(maxLength(2)([1, 2, 3]), "maxLength");
  });

  it("should succeed if value is <= max", () => {
    t.equal(maxLength(2)("aa"), undefined);
    t.equal(maxLength(2)("a"), undefined);
    t.equal(maxLength(2)([4]), undefined);
  });
});

describe("pattern", () => {
  it("should fail if value is > max", () => {
    t.equal(pattern(/foo/g)("aaa"), "pattern");
    t.equal(pattern(/foo/g)(null as any), "pattern");
    t.equal(pattern(/foo/g)(undefined as any), "pattern");
  });

  it("should succeed if value is <= max", () => {
    t.equal(pattern(/foo/g)("foo"), undefined);
  });
});
