import { Field, FormGroup } from "../src";

interface PasswordFields {
  password: Field;
  confirmPassword: Field;
}

export const matchPasswords = (group: FormGroup<PasswordFields>) => {
  return group.fields.password.value !== group.fields.confirmPassword.value
    ? "matchPasswords"
    : undefined;
};

const form = new FormGroup(
  {
    confirmPassword: new Field(),
    password: new Field(),
  },
  { sync: [matchPasswords] },
);

export default form;
