import SimpleForm from "./SimpleForm";
import { Validator, ValidationError, ValidationResult } from "./shapes";
import Field from "./Field";

// export function createFormModel<T>(model: T): T & SimpleForm {
//   const fields = Object.keys(model)
//     .map(prop => new Field(prop));

//   return new SimpleForm(model, fields);
// }

const notNull = (x: any) => x !== null;

export const flatten = <K, T>(prev: K, x: T): K & T => {
  return Object.assign(prev, x);
};

/** Apply synchronous validations */
export const combine = <T>(...funcs: Array<Validator<T>>) => (value: T): ValidationResult => {
  return funcs
    .map(f => f(value))
    .filter(notNull)
    .reduce(flatten, {});
};

/** Apply asynchronous validations */
export const combineAsync = <T>(...funcs: Array<Validator<T>>) => (value: T): Promise<ValidationError> => {
  return Promise.all(funcs.map(f => f(value)))
    .then(res => res
      .filter(notNull)
      .reduce(flatten, {}),
    );
};
