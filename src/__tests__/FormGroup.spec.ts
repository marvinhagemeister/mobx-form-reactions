import { assert as t } from "chai";
import { useStrict, toJS } from "mobx";
import Field from "../Field";
import FormGroup from "../FormGroup";
import FieldArray from "../FieldArray";

useStrict(true);

const isHello = (value: string) => value !== "hello"
  ? { hello: true }
  : {};

describe("FormGroup", () => {
  it("should initialize via constructor", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.valid, true);

    const form2 = new FormGroup({}, {
      disabled: true,
      validator: (value: any) => ({}),
    });

    t.equal(form2.disabled, true);
    t.equal(typeof form2.validator, "function");
  });

  it("should return valid if fields are valid", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.valid, true);
  });

  it("should return invalid if one field is invalid", () => {
    const fa = new Field();
    const fb = new Field(null, { validator: isHello });
    const form = new FormGroup({ fa, fb });

    fb.setValue("yes");
    return form.validate()
      .then(() => t.equal(form.valid, false));
  });

  it("should getField by name", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.fields.fa === fa, true);
  });

  it("should reset the FormGroup", () => {
    const foo = new Field({ validator: isHello });
    const form = new FormGroup({ foo });

    foo.setValue("nope");
    return form.validate()
      .then(() => {
        t.equal(form.valid, false);
        t.deepEqual(form.errors, {});
        t.deepEqual(foo.errors, {
          hello: true,
        });
      })
      .then(() => {
        form.reset();

        t.equal(form.valid, true);
        t.deepEqual(form.errors, {});
        t.deepEqual(foo.errors, {});
      });
  });

  it("should handle pending validation", () => {
    const validator = (value: any) =>
      new Promise((res, rej) => {
        setTimeout(() => res({}), 10);
      });

    const foo = new Field();
    const form = new FormGroup({ foo }, { validator });

    t.equal(form.validating, false);
    foo.setValue("");
    const p = form.validate();
    t.equal(form.validating, true);

    return p.then(() => {
      t.equal(form.validating, false);
    });
  });

  it("should submit values", () => {
    const form = new FormGroup({
      bar: new FormGroup({
        name: new Field("value2"),
      }),
      baz: new FieldArray([new Field("value3")]),
      foo: new Field("value1"),
    });

    t.deepEqual(form.submit(), {
      bar: {
        name: "value2",
      },
      baz: ["value3"],
      foo: "value1",
    });
  });

  it("should set disabled", () => {
    const form = new FormGroup({});
    t.equal(form.disabled, false);
    form.setDisabled(true);
    t.equal(form.disabled, true);
  });

  it("should not submit disabled fields", () => {
    const form = new FormGroup({
      bar: new FieldArray([], { disabled: true }),
      baz: new FormGroup({}, { disabled: true }),
      foo: new Field({ disabled: true }),
    });

    t.deepEqual(form.submit(), {});
  });

  it("should submit empty object if disabled", () => {
    const form = new FormGroup({
      foo: new Field(),
    }, { disabled: true });
    t.deepEqual(form.submit(), {});
  });

  it("should skip disabled fields in validation", () => {
    const field = new Field("foo", {
      disabled: true,
      validator: isHello,
    });
    field.setValue("nope");

    const form = new FormGroup({
      bar: new FieldArray([field]),
      baz: new FormGroup({ foo: field }, { disabled: true }),
      foo: field,
    });

    t.equal(form.valid, true);
  });
});
