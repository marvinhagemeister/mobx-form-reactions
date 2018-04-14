import { action } from "mobx";
import { Field } from "./Field";
import { ControlOptions } from "./shapes";

export class BooleanField extends Field {
  constructor({
    disabled = false,
    value = false,
  }: Pick<ControlOptions<Field>, "disabled"> & { value?: boolean } = {}) {
    super({
      value,
      disabled,
    });
  }

  @action.bound
  setValue(value: boolean) {
    return super.setValue(value);
  }

  @action.bound
  toggle() {
    this.initial = false;
    this.value = !this.value;
  }
}
