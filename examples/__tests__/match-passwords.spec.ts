import * as t from "assert";
import Form from "../match-passwords";
import { FieldStatus } from "../../src";

describe("match-passwords", () => {
  beforeEach(() => Form.reset());

  it("should validate that both fields are the same", async () => {
    Form.fields.password.setValue("nope");

    await Form.validate();
    t.equal(Form.status, FieldStatus.INVALID);

    Form.fields.confirmPassword.setValue("nope");
    await Form.validate();
    t.equal(Form.status, FieldStatus.VALID);

    Form.fields.password.setValue("asdf");
    await Form.validate();
    t.equal(Form.status, FieldStatus.INVALID);
  });
});
