import { action, computed, observable } from "mobx";
import Field from "./Field";
import {
  AbstractFormControl,
  FieldCache,
  FormGroupOptions,
  LocalFormControls,
  Validator,
  ValidationError,
} from "./shapes";

export default class FormGroup<T> implements AbstractFormControl {
  name: "";
  validator: Validator<any>;
  @observable errors: ValidationError = {};
  @observable fields: T;

  constructor(fields: T, options?: FormGroupOptions) {
    this.init(fields, options);
  }

  @action init(fields: T, options?: FormGroupOptions) {
    this.fields = fields;
    if (options) {
      Object.assign(this, options);
    }
  }

  @computed get valid() {
    const keys = Object.keys(this.fields);
    for (const key of keys) {
      if (!((this.fields as any)[key].valid)) {
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

  @action reset() {
    const keys = Object.keys(this.fields);
    for (const key of keys) {
      (this.fields as any)[key].reset();
    }

    this.errors = {};
  }

  @action addFields(fields: T) {
    this.fields = fields;
  }
}
