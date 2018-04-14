import { observe } from "mobx";
import { Field, FormGroup } from "../src";
import { FieldValue } from "../src/Field";

const form = new FormGroup({
  city: new Field(),
  country: new Field({ value: "France" }),
});

const setCityByCountry = (country: FieldValue) => {
  if (country === "Sweden") {
    form.fields.city.setValue("Stockholm");
  } else if (country === "France") {
    form.fields.city.setValue("Paris");
  }
};

// Set initial value
setCityByCountry(form.fields.country.value);

observe(form.fields.country, change => {
  const value = change.object.value;
  setCityByCountry(value);
});

export default form;
