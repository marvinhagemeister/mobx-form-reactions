import { action, observe, isObservableArray, isObservableMap } from "mobx";
import Field from "./Field";
import FormGroup from "./FormGroup";

export default class SimpleForm extends FormGroup {
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
        } else if (field instanceof FormGroup) {
          this.observeModel(field);
        }
      }
    });
  }

  @action submit() {
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
