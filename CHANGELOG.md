# Changelog

## next

- Fix `defaultValue` not beeing used correctly if it was set to `false`

## 3.1.0

- Added a few more validation methods that are used in most forms

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
