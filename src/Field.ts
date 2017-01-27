import { action, computed, observable } from "mobx";
import { AbstractFormControl, FieldOptions, Validator, ValidationResult, ValidationError } from "./shapes";

export default class Field implements AbstractFormControl {
  name: string;
  validator: Validator<any>;
  @observable errors: ValidationError = {};
  @observable initial: boolean = true;
  @observable disabled: boolean = false;
  @observable validating: boolean = false;
  @observable value: any;

  constructor(name: string, options?: FieldOptions) {
    this.init(name, options);
  }

  @computed get valid() {
    if (Object.keys(this.errors).length || this.validating) {
      return false;
    }

    if (!this.initial && !this.value.length) {
      return false;
    }

    return true;
  }

  @action init(name: string, options?: FieldOptions) {
    this.name = name;
    Object.assign(this, options);
  }

  @action setValue(value: any): Promise<boolean> {
    this.initial = false;
    this.value = value;
    return this.startValidation(value);
  }

  @action hydrate(value: any) {
    this.initial = true;
    this.value = value;
    this.startValidation(value);
  }

  // Must be an action because of strict mode
  @action startValidation(value: any): Promise<boolean> {
    if (typeof this.validator === "undefined") {
      this.errors = {};
      return Promise.resolve(true);
    }

    const result = this.validator(value);
    if (result === null) {
      this.errors = {};
      return Promise.resolve(true);
    } else if (typeof (result as any).then !== "function") {
      this.errors = result;
      return Promise.resolve(this.valid);
    }

    this.validating = true;
    return (result as Promise<ValidationResult>).then(this.stopValidation);
  }

  // Cannot work inside startValidation function because of strict mode.
  @action stopValidation = (errors: ValidationError) => {
    this.validating = false;
    this.errors = errors;
    return this.valid;
  }
}
