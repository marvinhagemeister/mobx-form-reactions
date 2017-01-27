import { action, computed, observable } from "mobx";
import Field from "./Field";
import { AbstractFormControl, FieldCache } from "./shapes";

export default class FormGroup implements AbstractFormControl {
  name: "";
  @observable fields: FieldCache;

  constructor(fields?: AbstractFormControl[]) {
    this.init();

    if (fields) {
      this.addFields(...fields);
    }
  }

  @action init() {
    this.fields = {};
  }

  @computed get valid() {
    const keys = Object.keys(this.fields);
    for (const key of keys) {
      if (!this.fields[key].valid) {
        return false;
      }
    }

    return true;
  }

  @action addFields(...fields: AbstractFormControl[]) {
    for (const field of fields) {
      this.fields[field.name] = field;
    }
  }
}
