import { assert as t } from "chai";
import Field from "../Field";

describe("Field", () => {
  it("should set options", () => {
    const field = new Field("foo", {
      disabled: true,
      required: true,
    });

    t.equal(field.disabled, true);
    t.equal(field.required, true);
    t.equal(field.name, "foo");
  });

  it("should validate synchronously", () => {
    const field = new Field("foo", {
      validator: value => value === "hello" ? [] : ["nope"],
    });

    field.setValue("nope");

    t.equal(field.valid, false);
    t.equal(field.errors.length, 1);
    t.equal(field.errors[0], "nope");

    field.setValue("hello");
    t.equal(field.valid, true);
    t.equal(field.errors.length, 0);
  });

  it("should validate asynchronously", () => {
    const validator = (value: any) => {
      return new Promise(res => {
        setTimeout(() => {
          return res(value !== "hello" ? ["nope"] : []);
        }, 10);
      });
    };

    const field = new Field("foo", {
      validator,
    });

    return field.setValue("nope")
      .then(() => {
        t.equal(field.valid, false);
        t.equal(field.errors.length, 1);
        t.equal(field.initial, false);
      });
  });

  it("should set value", () => {
    const field = new Field("foo");
    field.setValue("hey");

    t.equal(field.value, "hey");
    t.equal(field.initial, false);
  });

  it("should hydrate", () => {
    const field = new Field("foo");
    field.hydrate("hey");

    t.equal(field.value, "hey");
    t.equal(field.initial, true);
  });
});
