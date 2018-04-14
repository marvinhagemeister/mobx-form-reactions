import * as t from "assert";
import Form from "../chained-select";

describe("Chained Selects", () => {
  it("should chain select elements", () => {
    t.equal(Form.fields.city.value, "Paris");

    Form.fields.country.setValue("Sweden");
    t.equal(Form.fields.city.value, "Stockholm");

    Form.fields.country.setValue("France");
    t.equal(Form.fields.city.value, "Paris");
  });
});
