import { assert as t } from "chai";
import { useStrict, toJS } from "mobx";
import { Validator, ValidationError } from "../shapes";
import Field from "../Field";

useStrict(true);

const isHello = (value: any) =>
  value !== "hello" ? { hello: true } : {};

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
      validator: isHello,
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
          return res(value !== "hello" ? { nope: true  } : {});
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

  it("should get fall back to defaultValue when empty", () => {
    const field = new Field(false);
    t.equal(field.value, false);
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

  it("should set disabled", () => {
    const field = new Field();
    t.equal(field.disabled, false);

    field.setDisabled(true);
    t.equal(field.disabled, true);
  });

  it("should skip validation", () => {
    const field = new Field("foo", {
      validator: isHello,
    });

    field.setValue("hey", true);
    t.equal(field.valid, true);

    field.setValue("no");
    t.equal(field.valid, false);
  });

  it("should set defaultValue", () => {
    const field = new Field("foo");
    t.equal(field.defaultValue, "foo");

    field.setDefaultValue("bar");
    t.equal(field.defaultValue, "bar");
  });

  it("should validate defaultValue", () => {
    const field = new Field("hello", { validator: isHello });
    return field.validate()
      .then(() => {
        t.equal(field.valid, true);
      });
  });
});
