import SimpleForm from "./SimpleForm";
import { Validator, ValidationError } from "./shapes";
import Field from "./Field";

// export function createFormModel<T>(model: T): T & SimpleForm {
//   const fields = Object.keys(model)
//     .map(prop => new Field(prop));

//   return new SimpleForm(model, fields);
// }

/** Apply synchronous validations */
export const combine = <R extends ValidationError>(...funcs: Array<Validator<R>>) => (value: any): Partial<R> => {
  return funcs.reduce((prev, f) => Object.assign(prev, f(value)), {} as Partial<R>);
};

/** Apply asynchronous validations */
export const combineAsync = <R extends ValidationError>(...funcs: Array<Validator<R>>) =>
 (value: any): Promise<Partial<R>> => {
  return Promise.all(funcs.map(f => f(value)))
    .then(res => res.reduce((prev, x) => Object.assign(prev, x), {} as Partial<R>));
};
