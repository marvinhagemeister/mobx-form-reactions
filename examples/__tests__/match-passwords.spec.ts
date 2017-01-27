import { assert as t } from "chai";
import Form from "../match-passwords";

describe("match-passwords", () => {
  beforeEach(() => Form.reset());

  it("should validate that both fields are the same", () => {
    Form.fields.password.setValue("nope");
    t.equal(Form.valid, false);

    Form.fields.confirmPassword.setValue("nope");
    t.equal(Form.valid, true);

    Form.fields.password.setValue("asdf");
    t.equal(Form.valid, false);
  });
});
