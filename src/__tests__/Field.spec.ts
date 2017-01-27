import { assert as t } from "chai";
import { useStrict, toJS } from "mobx";
import { Validator, ValidationResult } from "../shapes";
import Field from "../Field";

useStrict(true);

describe("Field", () => {
  it("should set options", () => {
    const field = new Field("foo", {
      disabled: true,
    });

    t.equal(field.disabled, true);
    t.equal(field.name, "foo");
  });

  it("should validate synchronously", () => {
    const field = new Field("foo", {
      validator: value => value !== "hello" ? { hello: true } : null,
    });

    field.setValue("nope");

    t.equal(field.valid, false);
    t.deepEqual(field.errors, {
      hello: true,
    });

    field.setValue("hello");
    t.equal(field.valid, true);
  });

  it("should validate asynchronously", () => {
    const validator: Validator<any> = (value: string): Promise<ValidationResult> => {
      return new Promise<ValidationResult>(res => {
        setTimeout(() => {
          return res(value !== "hello" ? { nope: true } : null);
        }, 10);
      });
    };

    const field = new Field("foo", {
      validator,
    });

    return field.setValue("nope")
      .then(() => {
        t.equal(field.valid, false);
        // t.equal(field.errorCount, 1);
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

  it("should reset a field", () => {
    const field = new Field("foo");
    field.setValue("baz");

    t.equal(field.initial, false);

    field.reset();
    t.deepEqual(toJS(field), {
      disabled: false,
      errors: {},
      initial: true,
      name: "foo",
      validating: false,
      value: null,
    });
  });
});
