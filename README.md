# MobX form reactions

`@marvinh/mobx-form-reactions` is an advanced form library for mobx. It was written for
complex form needs, such as support for nested fields, field dependencies,
field dependencies across different forms and first class support for
asynchronous validators.

## Installation

```bash
npm install @marvinh/mobx-form-reactions
# or
yarn add @marvinh/mobx-form-reactions
```

## Usage

There are 3 basic modesl which are the building blocks for any form:

- `Field` - A simple input field
- `FormGroup` - A group of fields stored as an object
- `FieldArray` - Holds a list of fields/groups where the order is important or children can be dynamically added/removed.

Additional classes:

- `BooleanField`- Abstraction for toggles/checkboxes

### API

```ts
// Each class implements this interface
interface AbstractControl {
  /**
   * Incremented each time a field is changed. Useful for dirty-checking or
   * syncing requirements
   */
  revision: number;
  /**
   * Control is marked as being pristine. This is usually used to customize
   * the behaviour when errors should be shown the first time
   */
  initial: boolean;
  /** Marks control as being disabled */
  disabled: boolean;
  /** The current state of the field */
  status: "valid" | "pending" | "invalid";
  setDisabled(disabled: boolean): void;
  /** Reset the field */
  reset(): Promise<void>;
  /** Validates the field value and mutates the current instance */
  validate(): Promise<void>;
}

interface Field extends AbstractControl {
  /** The value of a field. `null` means empty */
  value: boolean | string | number | null;
  /** Note: setting a value doesn't trigger validation automatically */
  setValue(value: boolean | string | number | null): void;
}

interface FormGroup extends AbstractControl {
  /**
   * Get all child field values. Example:
   *
   * {
   *   name: "John Doe",
   *   age: 25,
   * }
   */
  value: Record<string, any>;
}

interface FieldArray extends AbstractControl {
  /**
   * Get all child field values. Example:
   *
   * [
   *   { name: "Jon Doe" },
   *   { name: "Peter" },
   * ]
   */
  value: any[];
}
```

### Validators

Each class can have it's own validators. These functions can be `sync` or
`async`. They return either a `string` if the field is invalid or `undefined`in
case if valid.

```ts
import { Validator, Field } from "@marvinh/mobx-form-reactions";

// Create a validation functions
const isHello = (field: Field) => field.value !== "hello" ? "hello" : undefined;

const validator = new Validator({
  bailFirstError: true,
  // synchronous validators are run before async for performance reasons
  sync: [isHello]
  // async functions are automatically cancelled when something changed.
  // This means that race conditions can't happen
  async: [somethingAsync]
})

// Create a field and assign our validator
const field = new Field({ validator });
```

### Examples

Simple form:

```ts
import {
  Field,
  FormGroup,
  Validator,
  required,
} from "@marvinh/mobx-form-reactions";

const nameValidator = new Validator({ sync: [required] });

const name = new Field({ validator: nameValidator });
const note = new Field();
const form = new FormGroup({ name, note });

note.value = "my user input";

// Form is still marked as invalid, because name isn't set
console.log(form.status); // invalid
console.log(name.status); // invalid

name.value = "John Doe";
console.log(form.status); // valid
```

Fields with a default value:

```ts
import { Field, required } from "@marvinh/mobx-form-reactions";

const nameValidator = new Validator({ sync: [required] });

const name = new Field({ value: "John Doe", validator: nameValidator });
console.log(name.value); // Logs: "John Doe"
```

### Examples

- [Form control dependencies](examples/)
- [Form validation dependencies](examples/)

### FieldArrays (dynamic fields)

When dealing with complex forms you'll usually come across a form where
the inputs have to be added dynamically. Think of a form where you can
add an abritary number of persons. The `FieldArray` class is made for
this exact purpose.

```ts
import { Field, FormGroup, FieldArray } from "@marvinh/mobx-form-reactions";

const createPerson = () =>
  new FormGroup({
    name: new Field(),
    surname: new Field(),
  });

const form = new FieldArray();

const onBtnClick = form => form.push(createPerson());

// Let's pretend that the user clicked on a button labeld "add person"
onBtnClick(form);

console.log(form.fields.length); // Logs: 2
```

## License

`MIT`, see the [license file](./LICENSE.md).
