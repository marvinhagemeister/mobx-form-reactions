import { action, computed, observable } from "mobx";
import Field from "./Field";

export interface FieldCache {
  [key: string]: Field;
}

export default class Form {
  @observable fields: FieldCache;

  constructor(fields?: Field[]) {
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

  @action addFields(...fields: Field[]) {
    for (const field of fields) {
      this.fields[field.name] = field;
    }
  }
}
