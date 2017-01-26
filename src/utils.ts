import SimpleForm from "./SimpleForm";
import { Validator } from "./shapes";
import Field from "./Field";

// export function createFormModel<T>(model: T): T & SimpleForm {
//   const fields = Object.keys(model)
//     .map(prop => new Field(prop));

//   return new SimpleForm(model, fields);
// }

/** Apply synchronous validations */
export const combine = <T>(...funcs: Validator[]) => (value: T): string[] => {
  return [].concat(...funcs.map(f => f(value)));
};

/** Apply asynchronous validations */
export const combineAsync = <T>(...funcs: Validator[]) => (value: T): Promise<string[]> => {
  return Promise.all(funcs.map(f => f(value)))
    .then(res => [].concat(...res));
};
