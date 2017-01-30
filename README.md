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
import { Field, FormGroup, required } from "mobx-form-reactions";

const name = new Field({ validator: required });
const note = new Field();
const form = new FormGroup({ name, note });

note.value = "my user input";

// Form is still marked as invalid, because name isn't set
console.log(form.valid); // false
console.log(name.valid); // false

name.value = "John Doe";
console.log(form.valid); // true
```

Fields with a default value:

```ts
import { Field, FormGroup, required } from "mobx-form-reactions";

const name = new Field("John Doe", { validator: required });

console.log(name.value); // Logs: "John Doe"
```

### Examples

- [Form control dependencies](examples/)
- [Form validation dependencies](examples/)

### Connecting validations to form fields

For single `Validators` it is as easy as passing the validator option:

```ts
import { Field, required } from "mobx-form-reactions";

const field = new Field({ validator: required });
```

Complex validations can be easily combined into a single `Validator`:

```ts
import { Field, combine, minLength, required } from "mobx-form-reactions";

const validator = combine(required, minLength(8));
const passwordField = new Field({ validator });
```

### Submitting

```ts
import { Field, FormGroup } from "mobx-form-reactions";

const form = new FormGroup({
  name: new Field("John"),
  surname: new Field("Doe"),
});

// Validation returns promise because validation may be async
form.validate().then(isValid => {
  if (isValid) {
    const json = form.submit();
    // Do somthing with our json
  } else {
    // Display error message
  }
});
```

### Custom Validations

Validations are simple functions which can be pure or have side-effects (think of having to verify the value against a
backend source). This makes them a no brainer to test, compose and reuse across different `Fields`.

Simple synchronous validation:

```ts
const isHello = value => value !== "hello" ? { hello: true } : {};
```

If you need multiple error messages simply add new properties to the errors object:

```ts
import { combine } from "mobx-form-reactions";
const startsWithA = value => value[0] !== "A" ? { startsWithA: true } : {};
const containsNumber = value => !/\d/.test(value) ? { containsNumber: true } : {};

const validate = combine(startsWithA, containsNumber);

console.log(validate("hello world"));
// Logs:
// {
//   startsWithA: true,
//   containsNumber: true,
// }
```

### Asynchronous Validation

Asynchronous validators work similar to synchronous one except that they return a `Promise`.

```ts
import { combineAsync } from "mobx-form-reactions";

function checkApi(value: any) {
  return fetch("https://example.com/my-json-api")
    .then(res => res.json())
    .then(res => {
      if (res.status > 300) {
        return { response: res.status };
      }

      return {};
    });
}
```

Combine asynchronous validations

```ts
const validate = combineAsync(checkFoo, checkApi);

validate("hello world")
  .then(res => console.log(res));
```

They can even be combined with synchronous validation.

```ts
const status = res => res.status !== 200 ? ["failed"] : [];
const validate = combineAsync(checkFoo, checkApi, status);

validate("hello world")
  .then(res => console.log(res));
```

### FieldArrays (dynamic fields)

When dealing with complex forms you'll usually come across a form where
the inputs have to be added dynamically. Think of a form where you can
add an abritary number of persons. The `FieldArray` class is made for
this exact purpose.

```ts
import { Field, FormGroup, FieldArray } from "mobx-form-reactions";

const createPerson = () =>
  new FormGroup({
    name: new Field("John"),
    surname: new Field("Doe"),
  });

const form = new FieldArray();

const onBtnClick = form =>
  form.push(createPerson());

// Let's pretend that the user clicked on a button labeld "add person"
onBtnClick(form);

console.log(form.fields.length); // Logs: 2
```

### Wizards

tbd

## Architecture

To support complex forms a lot of architectual decisions were made. You can read
more about the concept of this library here:

- [Template vs Model-based Forms](docs/architecture.md/#template-based-forms-vs-reactivemodel-based-forms)
- [Why Validators return objects](docs/architecture.md/#why-validators-return-objects)
- [Compared to other form libraries](docs/architecture.md/#compared-to-other-form-libraries)

