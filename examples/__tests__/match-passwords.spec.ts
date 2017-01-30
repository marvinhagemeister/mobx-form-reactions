import { assert as t } from "chai";
import { toJS } from "mobx";
import Form from "../match-passwords";

describe("match-passwords", () => {
  beforeEach(() => Form.reset());

  it("should validate that both fields are the same", () => {
    Form.fields.password.setValue("nope");

    return Form.validate()
      .then(() => {
        t.equal(Form.valid, false);
        Form.fields.confirmPassword.setValue("nope");
      })
      .then(() => Form.validate())
      .then(() => {
        t.equal(Form.valid, true);
        Form.fields.password.setValue("asdf");
      })
      .then(() => Form.validate())
      .then(() => {
        t.equal(Form.valid, false);
      });
  });
});
