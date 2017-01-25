# MobX form reactions

`mobx-form-reactions` is a model-based form library for mobx. It works great
in combination with [React](https://github.com/facebook/react/) or [Angular 2](https://angular.io/).

## Installation

```bash
# npm
npm install mobx-form-reactions

# yarn
yarn add mobx-form-reactions
```

## Usage

### Select & Dropdown components

### Custom Validations

### Asynchronous Validation

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
