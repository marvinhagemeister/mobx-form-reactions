import * as t from "assert";
import { toJS, configure, observe } from "mobx";
import { asyncIsHello, isHello } from "./helpers";
import { Field } from "../Field";
import { FormGroup } from "../FormGroup";
import { FieldArray } from "../FieldArray";
import { FieldStatus, AsyncValidateFn, Validator } from "..";

configure({ enforceActions: true });

describe("FormGroup", () => {
  it("should initialize via constructor", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.status, FieldStatus.VALID);

    const form2 = new FormGroup(
      {},
      {
        disabled: true,
        validator: new Validator({
          sync: [(value: any) => undefined],
        }),
      },
    );

    t.equal(form2.disabled, true);
  });

  it("should track initial", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.initial, true);

    fa.setInitial(false);
    t.equal(form.initial, false);

    fa.setInitial(true);
    fb.setInitial(false);
    t.equal(form.initial, false);
  });

  it("should return valid if fields are valid", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.status, FieldStatus.VALID);
  });

  it("should track revision", () => {
    const f = new Field();
    const f2 = new Field();
    const form = new FormGroup({ foo: f, bar: f2 });

    f.setValue("123");
    t.equal(form.revision, 1);

    f2.setValue("bob");
    t.equal(form.revision, 2);
  });

  it("should return invalid if one field is invalid", async () => {
    const fa = new Field();
    const fb = new Field({ validator: new Validator({ sync: [isHello] }) });
    const form = new FormGroup({ fa, fb });

    fb.setValue("yes");

    await form.validate();
    t.equal(form.status, FieldStatus.INVALID);
  });

  it("should getField by name", () => {
    const fa = new Field();
    const fb = new Field();
    const form = new FormGroup({ fa, fb });

    t.equal(form.fields.fa === fa, true);
  });

  it("should reset the FormGroup", async () => {
    const foo = new Field({ validator: new Validator({ sync: [isHello] }) });
    const form = new FormGroup({ foo });

    foo.setValue("nope");

    await form.validate();
    t.equal(form.status, FieldStatus.INVALID);
    t.deepEqual(form.validator.errors, []);
    t.deepEqual(toJS(foo.validator.errors), ["hello"]);

    await form.reset();

    t.equal(form.status, FieldStatus.INVALID);
    t.deepEqual(form.validator.errors, {});
    t.deepEqual(foo.validator.errors, []);
  });

  it("should handle pending validation", async () => {
    const validator: AsyncValidateFn<any> = () =>
      new Promise(res => setTimeout(res, 10));

    const foo = new Field();
    const form = new FormGroup(
      { foo },
      { validator: new Validator({ async: [validator] }) },
    );

    const events: FieldStatus[] = [];
    observe(form, "status", change => events.push(change.newValue), true);

    foo.setValue("");
    await form.validate();

    t.deepEqual(events, [
      FieldStatus.VALID,
      FieldStatus.PENDING,
      FieldStatus.VALID,
    ]);
  });

  it("should get values", () => {
    const form = new FormGroup({
      bar: new FormGroup({
        name: new Field({ value: "value2" }),
      }),
      baz: new FieldArray([new Field({ value: "value3" })]),
      foo: new Field({ value: "value1" }),
    });

    t.deepEqual(form.value, {
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

  it("should not include disabled fields", () => {
    const form = new FormGroup({
      bar: new FieldArray([], { disabled: true }),
      baz: new FormGroup({}, { disabled: true }),
      foo: new Field({ disabled: true }),
    });

    t.deepEqual(form.value, {});
  });

  it("should return empty object if disabled", () => {
    const form = new FormGroup(
      {
        foo: new Field(),
      },
      { disabled: true },
    );
    t.deepEqual(form.value, {});
  });

  it("should skip disabled fields in validation", () => {
    const field = new Field({
      value: "foo",
      disabled: true,
      validator: new Validator({ sync: [isHello] }),
    });
    field.setValue("nope");

    const form = new FormGroup({
      bar: new FieldArray([field]),
      baz: new FormGroup({ foo: field }, { disabled: true }),
      foo: field,
    });

    t.equal(form.status, FieldStatus.VALID);
  });

  it("should set validating flag", async () => {
    const field = new Field({
      value: "foo",
      validator: new Validator({ async: [asyncIsHello] }),
    });

    const form = new FormGroup({
      bar: new FieldArray([field]),
      baz: new FormGroup({ foo: field }),
      foo: field,
    });

    field.setValue("nope");
    const p = form.validate();
    t.equal(form.status, FieldStatus.PENDING);

    await p;
    t.equal(form.status, FieldStatus.INVALID);
  });
});
