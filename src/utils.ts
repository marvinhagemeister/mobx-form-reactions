import { AbstractFormControl, FieldStatus } from "./shapes";

export function getStatus(fields: AbstractFormControl[]) {
  let pending = false;

  for (const field of fields) {
    if (field.status === FieldStatus.INVALID) {
      return FieldStatus.INVALID;
    } else if (field.status === FieldStatus.PENDING) {
      pending = true;
    }
  }

  return pending ? FieldStatus.PENDING : FieldStatus.VALID;
}
