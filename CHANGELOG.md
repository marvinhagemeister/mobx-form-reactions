# Changelog

## 3.3.1

- Fix error when only setting `defaultValue` in `BooleanField` constructor
- Add `setDefaultValue` setter for `Field`

## 3.3.0

Add new `BooleanField` field class as a child class of `Field`. Only difference is
that its default value is `false`, the validator is set to `isBoolean` and
that it has a handy `toggle()` method.

## 3.2.0

- Fix `defaultValue` not beeing used correctly if it was set to `false`
- Field `setValue` method changed to `setValue(value, skipValidation)`

Most fields in our use case are validated synchronously and this
was the expected behaviour for users here.

- all form classes respect the `disabled` status during submition and validation

## 3.1.0

- Add a few more validation methods that are used in most forms

## 3.0.0

- **Breaking Change**: Remove `SimpleForm`. State should be derived not synced
- Add `submit` and `validate` method for `FormGroup` and `FieldArray`

## 2.0.2

- Distribute as `ES5` package instead of `ES6`. Babel breaks on `extends` otherwise.
See: https://github.com/babel/babel/issues/5208

## 2.0.1

- upgrade TypeScript version

## 2.0.0

- fields are now stored as an `Object` instead of an `Array` for easier retrieval
- `SimpleForm` class that can be used to sync with a model
- Improved typings

## 1.0.0

- initial Release
