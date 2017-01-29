import { Field, FieldCache, FormGroup, LocalFormControls } from "../src";

interface PasswordGroup {
  password: Field;
  confirmPassword: Field;
}

export const matchPasswords = (fields: PasswordGroup) => {
  return fields.password.value !== fields.confirmPassword.value
    ? { matchPasswords: true }
    : {};
};

const options = { validator: matchPasswords };
const form = new FormGroup({
  confirmPassword: new Field(),
  password: new Field(),
}, options);

export default form;
