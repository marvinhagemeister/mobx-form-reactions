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
    this.name = name;
    Object.assign(this, options);
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

  private startValidation(value: any): Promise<boolean> {
    if (typeof this.validator === "undefined") {
      return Promise.resolve(true);
    }

    const result = this.validator(value);
    if (Array.isArray(result)) {
      this.errors = result;
      this.validating = false;
      return Promise.resolve(this.errors.length === 0);
    } else if (typeof result.then === "function") {
      this.validating = true;
      return result
        .then(res => {
          this.validating = false;
          this.errors = res;
          return this.errors.length === 0;
        });
    }
  }
}
