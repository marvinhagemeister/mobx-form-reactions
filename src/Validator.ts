import {
  CancelController,
  AbortedErrorMsg,
  throwIfAborted
} from "@marvinh/cancel-token";
import { AbstractFormControl } from "./shapes";

export type SyncValidateFn<T> = (item: T) => string | undefined;
export type AsyncValidateFn<T> = (item: T) => Promise<string | undefined>;

export interface ValidatorOptions<T> {
  sync?: SyncValidateFn<T>[];
  async?: AsyncValidateFn<T>[];
  bailFirstError?: boolean;
}

export interface IValidator<T extends AbstractFormControl> {
  run(control: T): Promise<void>;
}

export class Validator<T extends AbstractFormControl> implements IValidator<T> {
  sync: SyncValidateFn<T>[];
  async: AsyncValidateFn<T>[];
  bailFirstError: boolean;
  private controller = new CancelController();

  constructor({
    sync = [],
    async = [],
    bailFirstError = true
  }: ValidatorOptions<T> = {}) {
    this.sync = sync;
    this.async = async;
    this.bailFirstError = bailFirstError;
  }

  async run(control: T): Promise<void> {
    this.controller.abort();
    const controller = (this.controller = new CancelController());

    control.errors = [];

    if (this.sync.length > 0) {
      // Use a standard for loop, because babel can't transpile it to a for-loop
      // because of missing type information and will attempt to use a generator
      // polyfill combined with symbols instead. This always leads to undefined
      // errors in IE with the cryptic message: `Object expected`.
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.sync.length; i++) {
        const fn = this.sync[i];
        const res = fn(control);
        if (res !== undefined) {
          control.errors.push(res);
          if (this.bailFirstError) {
            return;
          }
        }
      }
    }

    if (this.async.length > 0) {
      control._validating = true;
      try {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.async.length; i++) {
          const fn = this.async[i];
          if (this.bailFirstError && control.errors.length > 0) return;
          const res = await fn(control);
          throwIfAborted(controller.signal);

          if (res !== undefined) {
            control.errors.push(res);
          }
        }
      } catch (err) {
        if (err !== AbortedErrorMsg) {
          throw err;
        }
      } finally {
        control._validating = false;
      }
    }
  }
}
