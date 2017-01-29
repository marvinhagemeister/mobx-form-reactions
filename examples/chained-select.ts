import { observe } from "mobx";
import { Field, FormGroup } from "../src";

/* tslint:disable no-shadowed-variable */

const country = new Field("France");
const city = new Field();

const form = new FormGroup({
  country, city,
});

const setCityByCountry = (country: string) => {
  if (country === "Sweden") {
    city.setValue("Stockholm");
  } else if (country === "France") {
    city.setValue("Paris");
  }
};

// Set initially
setCityByCountry(country.defaultValue);

observe(country, change => {
  const value = change.object.value;
  setCityByCountry(value);
});

export default form;
