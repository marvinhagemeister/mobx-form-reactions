import { action, computed, observable } from "mobx";
import Field from "./Field";
import { FieldBase, FieldCache } from "./shapes";

export default class Form implements FieldBase {
  name: "";
  @observable fields: FieldCache;

  constructor(fields?: FieldBase[]) {
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

  @action addFields(...fields: FieldBase[]) {
    for (const field of fields) {
      this.fields[field.name] = field;
    }
  }
}
