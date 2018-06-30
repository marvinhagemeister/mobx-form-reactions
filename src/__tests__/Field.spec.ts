import * as t from "assert";
import { toJS, configure } from "mobx";
import { FieldStatus } from "../shapes";
import { Field } from "../Field";
import { SyncValidateFn, AsyncValidateFn, Validator } from "..";
import { isHello, delay } from "./helpers";

configure({ enforceActions: true });

describe("Field", () => {
  it("should set options", () => {
    const field = new Field();
    t.equal(field.disabled, false);

    const field2 = new Field({ disabled: true });
    t.equal(field2.disabled, true);

    const field3 = new Field({ value: "foo", disabled: true });
    t.equal(field3.disabled, true);
    t.equal(field3.value, "foo");

    const field4 = new Field({ revision: 10 });
    t.equal(field4.revision, 10);
  });

  it("should set initial value", () => {
    const field = new Field();
    t.equal(field.initial, true);

    field.setInitial(false);
    t.equal(field.initial, false);
  });

  it("should validate synchronously", async () => {
    const field = new Field({
      value: "foo",
      validator: new Validator({ sync: [isHello] }),
    });

    field.setValue("nope");
    await field.validate();

    t.equal(field.status, FieldStatus.INVALID);

    field.setValue("hello");
    await field.validate();
    t.equal(field.status, FieldStatus.VALID);
  });

  it("should validate asynchronously", async () => {
    const fn: AsyncValidateFn<Field> = x => {
      return new Promise(res =>
        setTimeout(() => res(x.value !== "hello" ? "nope" : undefined), 0),
      );
    };

    const field = new Field({
      value: "foo",
      validator: new Validator({ async: [fn] }),
    });

    field.setValue("nope");

    await field.validate();
    t.equal(field.status, FieldStatus.INVALID);
  });

  it("should set value", () => {
    const field = new Field({ value: "foo" });
    field.setValue("hey");
    t.equal(field.value, "hey");
  });

  it("should get fall back to defaultValue when empty", () => {
    const field = new Field({ value: false });
    t.equal(field.value, false);
  });

  it("should reset a field", () => {
    const field = new Field({ value: "foo" });
    field.setValue("baz");
    field.setInitial(false);

    t.equal(field.initial, false);

    field.reset();
    t.equal(field.value, "foo");
    t.equal(field.status, FieldStatus.VALID);
    t.equal(field.initial, true);
    t.equal(field.revision, 0);
  });

  it("should track revision", () => {
    const f = new Field();
    f.setValue("123");
    t.equal(f.revision, 1);
  });

  it("should set disabled", () => {
    const field = new Field();
    t.equal(field.disabled, false);

    field.setDisabled(true);
    t.equal(field.disabled, true);
  });

  it("should validate defaultValue", async () => {
    const field = new Field({
      value: "foo",
      validator: new Validator({ sync: [isHello] }),
    });
    await field.validate();

    t.equal(field.status, FieldStatus.INVALID);
  });

  it("should set status properly", async () => {
    const f = new Field();
    t.equal(f.status, FieldStatus.VALID);

    const f2 = new Field({ disabled: true });
    t.equal(f2.status, FieldStatus.VALID);

    const f3 = new Field({
      validator: new Validator({ async: [() => delay(100) as any] }),
    });
    const p = f3.validate();
    t.equal(f3.status, FieldStatus.PENDING);
    await p;
  });
});
