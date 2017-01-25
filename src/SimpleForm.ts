import { action, observe } from "mobx";
import Field from "./Field";
import Form from "./Form";

export default class SimpleForm extends Form {
  constructor(model: Object, fields?: Field[]) {
    super(fields);

    observe(model, (change: any) => {
      const key = change.name;
      const next = change.object[change.name];

      if (this.fields[key]) {
        this.fields[key].setValue(next);
      }
    });
  }
}
