import { action, observe } from "mobx";
import Field from "./Field";
import Form from "./Form";

export default class SimpleForm extends Form {
  constructor(model: Object, fields?: Field[]) {
    super(fields);

    this.observeModel(model);
  }

  observeModel(model: Object) {
    observe(model, (change: any) => {
      const key = change.name;
      const next = change.object[change.name];

      console.log("change", change);

      const field = this.fields[key];

      if (field) {
        if (field instanceof Field) {
          (field as Field).setValue(next);
        } else if (field instanceof Form) {
          this.observeModel(field);
        }
      }
    });
  }
}
