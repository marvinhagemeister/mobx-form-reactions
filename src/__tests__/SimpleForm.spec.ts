import { assert as t } from "chai";
import { action, observable, useStrict } from "mobx";
import Field from "../Field";
import FormGroup from "../FormGroup";
import SimpleForm from "../SimpleForm";

useStrict(true);

/* tslint:disable max-classes-per-file */

class NestedModel {
  @observable name: string;
  @observable surname: string;

  constructor() {
    this.init();
  }

  @action init() {
    this.name = "foo";
    this.surname = "baz";
  }

  @action setName(value: string) {
    this.name = value;
  }
}

class Model {
  @observable foo: string;
  @observable bar: string;
  @observable nested: NestedModel[];

  constructor() {
    this.init();
  }

  @action init() {
    this.foo = "";
    this.bar = "";
    this.nested = [
      new NestedModel()
    ];
  }

  @action setFoo(value: any)  {
    this.foo = value;
  }
}

describe("SimpleForm", () => {
  it("should observe model", () => {
    const model = new Model();
    const form = new SimpleForm(model);
    const field = new Field("foo");
    form.addFields(field);

    model.setFoo("nope");

    t.equal(field.value, "nope");
    t.equal(form.valid, true);
  });

  it("should add fields via constructor", () => {
    const model = new Model();
    const field = new Field("foo");
    const form = new SimpleForm(model, [field]);

    t.equal(Object.keys(form.fields).length, 1);
  });

  it("should commit state to model", () => {
    const model = new Model();
    const field = new Field("foo");
    const form = new SimpleForm(model, [field]);

    t.equal(model.foo, "");
    field.setValue("hello");
    form.submit();

    t.equal(model.foo, "hello");

    field.setValue("nope");
    t.equal(model.foo, "hello");
  });

  it.skip("should commit nested state to model", () => {

  });

  it.skip("should support nested forms", () => {
    const model = new Model();

    const fa = new Field("foo");
    const fb = new Field("bar");
    const form = new SimpleForm(model, [fa, fb]);

    const c = new Field("name");
    const d = new Field("surname");
    const nested = new FormGroup([c, d]);
    form.addFields(nested);

    model.nested[0].setName("yo");

    t.equal(c.value, "yo");
  });
});
