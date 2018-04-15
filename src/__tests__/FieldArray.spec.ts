import * as t from "assert";
import { toJS } from "mobx";
import { asyncIsHello, isHello } from "./helpers";
import { FieldArray } from "../FieldArray";
import { FormGroup } from "../FormGroup";
import { Field } from "../Field";
import { FieldStatus } from "..";

describe("FieldArray", () => {
  it("should add fields via constructor", () => {
    const form = new FieldArray([new Field()]);
    t.equal(form.fields.length, 1);
  });

  it("should push new elements", () => {
    const foo = new Field();
    const form = new FieldArray();

    form.push(foo);

    t.equal(form.fields.length, 1);
    t.deepEqual(form.fields[0], foo);
  });

  it("should remove fields at index", () => {
    const first = new Field();
    const form = new FieldArray([first, new Field()]);

    form.removeAt(1);

    t.equal(form.fields.length, 1);
    t.deepEqual(form.fields[0], first);
  });

  it("should insert fields at index", () => {
    const next = new Field();
    const form = new FieldArray([new Field(), new Field()]);

    form.insert(1, next);

    t.equal(form.fields.length, 3);
    t.deepEqual(form.fields[1], next);
  });

  it("should reset itself and fields", async () => {
    const foo = new Field({ sync: [isHello], value: "hello" });
    const form = new FieldArray();
    form.push(foo);

    foo.setValue("nope");
    t.equal(foo.initial, false);

    await form.validate();

    t.deepEqual(toJS(foo.errors), ["hello"]);
    form.reset();

    t.deepEqual(toJS(foo.errors), []);
    t.equal(foo.initial, true);
  });

  it("should get values", () => {
    const field = new Field({ value: "value1" });
    const group = new FormGroup({
      foo: new Field({ value: "value2" }),
    });

    const form = new FieldArray([field, group]);

    t.deepEqual(form.value, [
      "value1",
      {
        foo: "value2",
      },
    ]);
  });

  it("should get empty array if disabled", () => {
    const form = new FieldArray([new Field()]);
    form.setDisabled(true);

    t.deepEqual(form.value, []);
  });

  it("should check if fields are disabled", () => {
    const form = new FieldArray([
      new Field(),
      new FieldArray([new Field()]),
      new FormGroup({ foo: new Field() }),
    ]);

    form.fields.forEach(x => x.setDisabled(true));
    t.deepEqual(form.value, []);
  });

  it("should skip fields in validation if disabled", () => {
    const field = new Field({ value: "foo", sync: [isHello] });
    const form = new FieldArray([field, new Field()]);

    field.setValue("no");
    field.setDisabled(true);

    t.deepEqual(form.status, FieldStatus.VALID);
  });

  it("should run validator", async () => {
    const field = new Field({ value: "foo", sync: [isHello] });
    const form = new FieldArray([field, new Field()], {
      sync: [group => isHello(group.fields[0] as Field)],
    });

    await form.validate();
    t.equal(form.status, FieldStatus.INVALID);

    await field.setValue("hello");

    await form.validate();
    t.equal(form.status, FieldStatus.VALID);
  });

  it("should set validating flag", async () => {
    const field = new Field({
      value: "hello",
      async: [asyncIsHello],
    });

    const field2 = new Field({
      value: "hello",
      async: [asyncIsHello],
    });

    const form = new FieldArray([field, field2]);

    await field.setValue("nope");
    await field2.setValue("nope");

    const p = form.validate();
    t.equal(form.status, FieldStatus.PENDING);

    await p;
    t.equal(form.status, FieldStatus.INVALID);
  });

  it("should set validating flag if validator is present", async () => {
    const field = new Field({
      value: "foo",
      async: [asyncIsHello],
    });

    const form = new FieldArray([field], {
      sync: [
        group =>
          group.fields.length !== 0 && group.fields[0].value !== "hello"
            ? "hello"
            : undefined,
      ],
    });

    await field.setValue("nope");

    const p = form.validate();
    t.equal(form.status, FieldStatus.PENDING);
    await p;
    t.equal(form.status, FieldStatus.INVALID);
  });
});
