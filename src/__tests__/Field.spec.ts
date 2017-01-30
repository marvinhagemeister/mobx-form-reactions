import { assert as t } from "chai";
import { useStrict, toJS } from "mobx";
import { Validator, ValidationError } from "../shapes";
import Field from "../Field";

useStrict(true);

describe("Field", () => {
  it("should set options", () => {
    const field = new Field();
    t.equal(field.disabled, false);

    const field2 = new Field({ disabled: true });
    t.equal(field2.disabled, true);

    const field3 = new Field("foo", { disabled: true });
    t.equal(field3.disabled, true);
    t.equal(field3.defaultValue, "foo");
  });

  it("should validate synchronously", () => {
    const field = new Field("foo", {
      validator: value => value !== "hello" ? { hello: true } : {},
    });

    field.setValue("nope");
    field.validate();

    t.equal(field.valid, false);
    t.deepEqual(field.errors, {
      hello: true,
    });

    field.setValue("hello");
    field.validate();
    t.equal(field.valid, true);
  });

  it("should validate asynchronously", () => {
    const validator: Validator<any> = (value: string): Promise<ValidationError> => {
      return new Promise<ValidationError>(res => {
        setTimeout(() => {
          return res(value !== "hello" ? { nope: true } : {});
        }, 10);
      });
    };

    const field = new Field("foo", {
      validator,
    });

    field.setValue("nope");
    return field.validate()
      .then(() => {
        t.equal(field.valid, false);
        t.equal(field.initial, false);
      });
  });

  it("should set value", () => {
    const field = new Field("foo");
    field.setValue("hey");

    t.equal(field.value, "hey");
    t.equal(field.initial, false);
  });

  it("should reset a field", () => {
    const field = new Field("foo");
    field.setValue("baz");

    t.equal(field.initial, false);

    field.reset();
    t.deepEqual(toJS(field), {
      _value: null,
      defaultValue: "foo",
      disabled: false,
      errors: {},
      initial: true,
      validating: false,
    });
  });
});
