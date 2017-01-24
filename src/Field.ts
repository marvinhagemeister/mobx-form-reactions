import { action, computed, observable } from "mobx";

export interface FieldOptions {
  required?: boolean;
  disabled?: boolean;
  validator?: (value: any) => string[] | Promise<string[]>;
}

export default class Field {
  name: string;
  validator: (value: any) => string[] | Promise<string[]>;
  @observable errors: string[] = [];
  @observable initial: boolean = true;
  @observable required: boolean = false;
  @observable disabled: boolean = false;
  @observable validating: boolean = false;
  @observable value: any;

  constructor(name: string, options?: FieldOptions) {
    this.init(name, options);
  }

  @computed get valid() {
    if (this.errors.length || this.validating) {
      return false;
    }

    if (!this.initial && this.required && !this.value.length) {
      return false;
    }

    return true;
  }

  @action init(name: string, options: FieldOptions) {
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
      return Promise.resolve(true);
    }

    const result = this.validator(value);
    if (Array.isArray(result)) {
      this.errors = result;
      this.validating = false;
      return Promise.resolve(this.errors.length === 0);
    }

    this.validating = true;
    return result
      .then(res => {
        this.stopValidation(res);
        return this.errors.length === 0;
      });
  }

  // Cannot work inside startValidation function because of strict mode.
  @action stopValidation(errors: string[]) {
    this.validating = false;
    this.errors = errors;
  }
}
