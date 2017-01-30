import { action, computed, observable } from "mobx";
import { AbstractFormControl, Validator, ValidationError } from "./shapes";
import FormGroup from "./FormGroup";
import Field from "./Field";

export default class FieldArray implements AbstractFormControl {
  validator: Validator<any>;
  @observable _validating: boolean = false;
  @observable fields: AbstractFormControl[] = [];
  @observable errors: ValidationError = {};

  constructor(fields?: AbstractFormControl[]) {
    if (fields) {
      this.push(...fields);
    }
  }

  @computed get valid() {
    for (const field of this.fields) {
      if (!field.valid || field.validating) {
        return false;
      }
    }

    return true;
  }

  @computed get validating() {
    if (this._validating) {
      return true;
    }

    for (const field of this.fields) {
      if (field.validating) {
        return true;
      }
    }

    return false;
  }

  @action.bound validate(): Promise<boolean> {
    this._validating = true;

    const p = this.fields.reduce((seq, field) => {
      return seq.then(() => field.validate());
    }, Promise.resolve(true));

    if (!this.valid || !this.validator) {
      return p.then(() => this.valid);
    }

    return p.then(() => this.validator(this.fields))
      .then((result: ValidationError) => {
        this._validating = false;
        Object.assign(this.errors, result);
        return this.valid;
      });
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

  @action submit(): Object {
    return this.fields.map(item => {
      if (item instanceof Field) {
        return (item as Field).value;
      } else if (item instanceof FieldArray) {
        return (item as FieldArray).submit();
      } else if (item instanceof FormGroup) {
        return (item as FormGroup<any>).submit();
      }
    }, []);
  }
}
