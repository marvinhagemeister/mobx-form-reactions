import {
  CancelController,
  AbortedErrorMsg,
  throwIfAborted,
} from "@marvinh/cancel-token";
import { observable, action, runInAction } from "mobx";
import { AbstractFormControl } from "./shapes";

export type SyncValidateFn<T> = (item: T) => string | undefined;
export type AsyncValidateFn<T> = (item: T) => Promise<string | undefined>;

export interface ValidatorOptions<T> {
  sync?: SyncValidateFn<T>[];
  async?: AsyncValidateFn<T>[];
  bailFirstError?: boolean;
}

export interface IValidator<T extends AbstractFormControl> {
  errors: string[];
  pending: boolean;
  run(control: T): Promise<void>;
  reset(): void;
}

export class Validator<T extends AbstractFormControl> implements IValidator<T> {
  sync: SyncValidateFn<T>[];
  async: AsyncValidateFn<T>[];
  bailFirstError: boolean;
  private controller = new CancelController();

  @observable pending: boolean = false;
  @observable errors: string[] = [];

  constructor({
    sync = [],
    async = [],
    bailFirstError = true,
  }: ValidatorOptions<T> = {}) {
    this.sync = sync;
    this.async = async;
    this.bailFirstError = bailFirstError;
  }

  @action
  reset() {
    this.controller.abort();
    this.errors = [];
    this.pending = false;
  }

  @action
  async run(control: T): Promise<void> {
    this.controller.abort();
    // Local reference is necessary to avoid the next validation run to overwrite
    // our cancel signal
    const controller = (this.controller = new CancelController());

    this.errors = [];

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
          this.errors.push(res);
          if (this.bailFirstError) {
            return;
          }
        }
      }
    }

    if (this.async.length > 0) {
      this.pending = true;
      try {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.async.length; i++) {
          const fn = this.async[i];
          if (this.bailFirstError && this.errors.length > 0) return;
          const res = await fn(control);
          throwIfAborted(controller.signal);

          if (res !== undefined) {
            this.errors.push(res);
          }
        }
      } catch (err) {
        if (err !== AbortedErrorMsg) {
          throw err;
        }
      } finally {
        runInAction(() => (this.pending = false));
      }
    }
  }
}
