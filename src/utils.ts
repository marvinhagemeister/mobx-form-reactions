import { AbstractFormControl, FieldStatus } from "./shapes";

export function getStatus(fields: AbstractFormControl[]) {
  let pending = false;

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field.status === FieldStatus.INVALID) {
      return FieldStatus.INVALID;
    } else if (field.status === FieldStatus.PENDING) {
      pending = true;
    }
  }

  return pending ? FieldStatus.PENDING : FieldStatus.VALID;
}
