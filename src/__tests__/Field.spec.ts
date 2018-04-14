import * as t from "assert";
import { toJS } from "mobx";
import { FieldStatus } from "../shapes";
import { Field } from "../Field";
import { SyncValidateFn, AsyncValidateFn } from "..";
import { isHello } from "./helpers";

describe("Field", () => {
  it("should set options", () => {
    const field = new Field();
    t.equal(field.disabled, false);

    const field2 = new Field({ disabled: true });
    t.equal(field2.disabled, true);

    const field3 = new Field({ value: "foo", disabled: true });
    t.equal(field3.disabled, true);
    t.equal(field3.value, "foo");
  });

  it("should validate synchronously", async () => {
    const field = new Field({
      value: "foo",
      sync: [isHello],
    });

    field.setValue("nope");
    await field.validate();

    t.equal(field.status, FieldStatus.INVALID);
    t.deepEqual(toJS(field.errors), ["hello"]);

    field.setValue("hello");
    field.validate();
    t.equal(field.status, FieldStatus.VALID);
  });

  it("should validate asynchronously", async () => {
    const fn: AsyncValidateFn<Field> = field => {
      return new Promise(res =>
        setTimeout(() => res(field.value !== "hello" ? "nope" : undefined), 0),
      );
    };

    const field = new Field({
      value: "foo",
      async: [fn],
    });

    field.setValue("nope");

    await field.validate();
    t.equal(field.status, FieldStatus.INVALID);
    t.equal(field.initial, false);
  });

  it("should set value", () => {
    const field = new Field({ value: "foo" });
    field.setValue("hey");

    t.equal(field.value, "hey");
    t.equal(field.initial, false);
  });

  it("should get fall back to defaultValue when empty", () => {
    const field = new Field({ value: false });
    t.equal(field.value, false);
  });

  it("should reset a field", () => {
    const field = new Field({ value: "foo" });
    field.setValue("baz");

    t.equal(field.initial, false);

    field.reset();
    t.equal(field.value, "foo");
    t.equal(field.status, FieldStatus.VALID);
    t.equal(field.initial, true);
  });

  it("should set disabled", () => {
    const field = new Field();
    t.equal(field.disabled, false);

    field.setDisabled(true);
    t.equal(field.disabled, true);
  });

  it("should validate defaultValue", async () => {
    const field = new Field({ value: "foo", sync: [isHello] });
    await field.validate();

    t.equal(field.status, FieldStatus.INVALID);
  });
});
