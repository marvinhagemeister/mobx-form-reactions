import { action, computed, observable } from "mobx";
import { AbstractFormControl, Validator, ValidationError } from "./shapes";
import FormGroup from "./FormGroup";
import Field from "./Field";

export default class FieldArray implements AbstractFormControl {
  validator: Validator<any>;
  @observable fields: AbstractFormControl[] = [];
  @observable errors: ValidationError = {};

  constructor(fields?: AbstractFormControl[]) {
    if (fields) {
      this.push(...fields);
    }
  }

  @computed get valid() {
    for (const field of this.fields) {
      if (!field.valid) {
        return false;
      }
    }

    if (this.validator) {
      const res = this.validator(this.fields);
      if (res !== null && Object.keys(res).length) {
        Object.assign(this.errors, res);
        return false;
      }
    }

    return true;
  }

  @action removeAt(index: number) {
    this.fields.splice(index, 1);
  }

  @action insert(index: number, field: AbstractFormControl) {
    this.fields.splice(index, 0, field);
  }

  @action push(...fields: AbstractFormControl[]) {
    this.fields.push(...fields);
  }

  @action reset() {
    this.fields.forEach(field => field.reset());
    this.errors = {};
  }
}
