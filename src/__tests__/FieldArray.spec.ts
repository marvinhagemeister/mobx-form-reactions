import { assert as t } from "chai";
import { toJS } from "mobx";
import FieldArray from "../FieldArray";
import FormGroup from "../FormGroup";
import Field from "../Field";

const isHello = (value: any) =>
  value !== "hello" ? { hello: true } : {};

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
    const form = new FieldArray([
      first,
      new Field(),
    ]);

    form.removeAt(1);

    t.equal(form.fields.length, 1);
    t.deepEqual(form.fields[0], first);
  });

  it("should insert fields at index", () => {
    const next = new Field();
    const form = new FieldArray([
      new Field(),
      new Field(),
    ]);

    form.insert(1, next);

    t.equal(form.fields.length, 3);
    t.deepEqual(form.fields[1], next);
  });

  it("should reset itself and fields", () => {
    const foo = new Field({ validator: isHello });
    const form = new FieldArray();
    form.push(foo);

    foo.setValue("nope");
    t.equal(foo.initial, false);

    return form.validate()
      .then(() => {
        t.deepEqual(toJS(foo.errors), { hello: true });
        form.reset();

        t.deepEqual(toJS(foo.errors), {});
        t.equal(foo.initial, true);
      });
  });

  it("should submit values", () => {
    const field = new Field("value1");
    const group = new FormGroup({
      foo: new Field("value2"),
    });

    const form = new FieldArray([
      field,
      group,
    ]);

    t.deepEqual(form.submit(), [
      "value1",
      {
        foo: "value2",
      },
    ]);
  });

  it("should submit empty array if disabled", () => {
    const form = new FieldArray([new Field()]);
    form.setDisabled(true);

    t.deepEqual(form.submit(), []);
  });

  it("should check if fields are disabled", () => {
    const form = new FieldArray([
      new Field(),
      new FieldArray([new Field()]),
      new FormGroup({ foo: new Field() }),
    ]);

    (form.fields[0] as Field).setDisabled(true);
    (form.fields[1] as FieldArray).setDisabled(true);
    (form.fields[2] as FormGroup<any>).setDisabled(true);

    t.deepEqual(form.submit(), []);
  });

  it("should skip fields in validation if disabled", () => {
    const field = new Field("foo", { validator: isHello });
    const form = new FieldArray([
      field,
      new Field(),
    ]);

    field.setValue("no");
    field.setDisabled(true);

    t.deepEqual(form.valid, true);
  });
});
