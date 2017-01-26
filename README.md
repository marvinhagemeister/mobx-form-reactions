# MobX form reactions

`mobx-form-reactions` is a model-based form library for mobx. It was written for complex form needs
which weren't satisfied with existing libraries (nested fields, fields depending upon each other,...).
It works great in combination with SPA-Frameworks like [React](https://github.com/facebook/react/) or
[Angular 2](https://angular.io/).

The basic idea is that form state should be derived from a model. Form state is more similar to display
state and should only be synched to the model when the form is submitted.

## Installation

```bash
# npm
npm install mobx-form-reactions

# yarn
yarn add mobx-form-reactions
```

## Usage

Simple usage without synching with models.

```ts
import { Form } from "mobx-form-reactions";

const name = new Field("name", { required: true });
const note = new Field("note");
const form = new Form([name, note]);

note.value = "my user input";

// Form is still marked as invalid, because name isn't set
console.log(form.valid); // false
console.log(name.valid); // false

name.value = "John Doe";
console.log(form.valid); // true
```

In most cases you have a model which you need to submit the local changes to.
For that case we have `SimpleForm` as a useful abstraction which covers 90% of form use cases:

```ts
import { observable } from "mobx";
import { SimpleForm } from "mobx-form-reactions";

class Person {
  @observable name: string = "";
  @observable surname: string = "";
}

class PersonForm extends SimpleForm {

}

// Somewhere in your app
const person = new Person();
const form = new PersonForm(person);



```

### Connecting validations to form fields

tbd

### Custom Validations

Validations are simple functions which can be pure or have side-effects (think of having to verify the value against a
backend source). This makes them a no brainer to test, compose and reuse across different `Fields`.

Function signature:

```ts
type Validator = (value: any) => string[] | Promise<string[]>;
```

Simple synchronous validation:

```ts
const validate = value => value !== "hello" ? ["Value must be 'hello'"] : [];
```

If you need multiple error messages it is as easy as filling returned array:

```ts
import { combine } from "mobx-form-reactions";
const startsWithA = value => value[0] !== "A" ? ["Must start with 'A'"] : [];
const containsNumber = value => !/\d/.test(value) ? ["Must contain a number"] : [];

const validate = combine(startsWithA, containsNumber);

console.log(validate("hello world"));
// Logs:
// [
//   "Value must start with 'A'",
//   "Value must contain a number"
// ]
```

### Asynchronous Validation

Asynchronous validators work similar to synchronous one except that they return a `Promise`
containing a `string[]`.

```ts
import { combineAsync } from "mobx-form-reactions";

function checkFoo(value: any) {
  return new Promise((result, reject) => {
    // Do something slow here
  });
}

// or with fetch
function checkApi(value: any) {
  return fetch("https://example.com/my-json-api")
    .then(res => res.json())
    .then(res => res.errors.length ? res.errors : []);
}

// Synchronous
const status = res => res.status !== 200 ? ["failed"] : [];

// Can also be combined with synchronous validations
const validate = combineAsync(checkFoo, checkApi, status);

validate("hello world")
  .then(res => console.log(res));
```

### FieldArrays (aka nested forms)

### Wizards

tbd

## Compared to other form libraries

`mobx-form-reactions` is built on the learnings and experiences of
previous and current form libraries. The most obvious difference is that
`mobx-form-reactions` is smaller, allows multiple error messages per
form field and makes it easier to chain custom validation functions.

Typically other form libraries are inspired by string configs like you may know
frameworks such as Laravel: `required|otherValidation`.

This style of configuration is in my opinion against the spirit of JavaScript/TypeScript and makes it hard to support complex validation logic where fields are dependent upon each other.

### [mobx-react-form](https://github.com/foxhound87/mobx-react-form) (previously: mobx-ajv-form)

is a great form library built completely on OOP Design principles. Heck they even built there own devtools which shares a lot of similarity with redux-devtools.

### [mobx-forms](https://github.com/oreqizer/mobx-forms)

Doesn't seem to be maintained anymore. Readme says it's a work in progress.

### [mobx-form](https://github.com/royriojas/mobx-form)

isn't maintained, same as `mobx-forms`.

### [redux-form](https://github.com/erikras/redux-form)

is based on redux and uses HOC-Components as its API. For redux based
projects this is the way to go.

### [formsy-react](https://github.com/christianalfoni/formsy-react/)

is more closely tied to react components. State is handled internally via
setState commands. For simple projects this may be great. For large ones I
believe the seperation between renderering and state is greatly beneficial.

## Further Reading

- redux-form: [Discussion on seperation of model state and form state](https://github.com/erikras/redux-form/issues/529#issuecomment-172653330)
