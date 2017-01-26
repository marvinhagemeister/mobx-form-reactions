import { action, observe, isObservableArray, isObservableMap } from "mobx";
import Field from "./Field";
import Form from "./Form";

export default class SimpleForm extends Form {
  model: Object;

  constructor(model: Object, fields?: Field[]) {
    super(fields);

    this.model = model;
    this.observeModel(model);
  }

  observeModel(model: Object) {
    observe(model, (change: any) => {
      const key = change.name;
      const next = change.object[change.name];
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

  @action commit() {
    const keys = Object.keys(this.fields);
    for (const key of keys) {
      if (this.fields[key] instanceof Field) {
        const value = (this.fields[key] as Field).value;

        const destination = (this.model as any)[key];
        if (isObservableArray(destination)) {
          // destination.replace(value);
        } else if (isObservableMap(destination)) {

        } else {
          (this.model as any)[key] = value;
        }
      }
    }
  }
}
