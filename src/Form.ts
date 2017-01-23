import { action, computed, observable } from "mobx";
import Field from "./Field";

export default class Form {
  fields: Field[] = [];

  constructor(fields: Field[]) {
    this.addFields(...fields);
  }

  @computed get valid() {
    return this.fields
      .every(field => field.valid);
  }

  @action addFields(...fields: Field[]) {
    this.fields.push(...fields);
  }
}
