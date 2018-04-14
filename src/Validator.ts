import { AbstractFormControl } from "./shapes";

export type SyncValidateFn<T> = (item: T) => string | undefined;
export type AsyncValidateFn<T> = (item: T) => Promise<string | undefined>;

export interface ValidatorOptions<T> {
  sync?: SyncValidateFn<T>[];
  async?: AsyncValidateFn<T>[];
  bailFirstError?: boolean;
}

export class Validator<T extends AbstractFormControl> {
  sync: SyncValidateFn<T>[];
  async: AsyncValidateFn<T>[];
  bailFirstError: boolean;

  constructor({
    sync = [],
    async = [],
    bailFirstError = true,
  }: ValidatorOptions<T> = {}) {
    this.sync = sync;
    this.async = async;
    this.bailFirstError = bailFirstError;
  }

  run(control: T): Promise<boolean> {
    control.errors = [];

    if (this.sync.length > 0) {
      for (const fn of this.sync) {
        const res = fn(control);
        if (res !== undefined) {
          control.errors.push(res);
          if (this.bailFirstError) {
            return Promise.resolve(false);
          }
        }
      }
    }

    let p: Promise<any> = Promise.resolve(undefined);
    if (this.async.length > 0) {
      control._validating = true;
      for (const fn of this.async) {
        p = p.then(() => {
          if (this.bailFirstError && control.errors.length > 0) return;

          return fn(control).then(res => {
            if (res !== undefined) control.errors.push(res);
          });
        });
      }
    }

    return p.then(res => {
      control._validating = false;
      return res;
    });
  }
}
