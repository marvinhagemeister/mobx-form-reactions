import { assert as t } from "chai";
import { action, observable, useStrict } from "mobx";
import Field from "../Field";
import SimpleForm from "../SimpleForm";

useStrict(true);

class Model {
  @observable foo: string;
  @observable bar: string;

  constructor() {
    this.init();
  }

  @action init() {
    this.foo = "";
    this.bar = "";
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
});
