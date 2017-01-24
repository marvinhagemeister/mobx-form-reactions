declare module "mobx-form-reactions" {
  export interface FieldOptions {
    required?: boolean;
    disabled?: boolean;
    validator?: (value: any) => string[] | Promise<string[]>;
  }

  export class Field {
    name: string;
    validator: (value: any) => string[] | Promise<string[]>;
    errors: string[];
    initial: boolean;
    required: boolean;
    disabled: boolean;
    validating: boolean;
    value: any;
    constructor(name: string, options?: FieldOptions);
    readonly valid: boolean;
    init(name: string, options: FieldOptions): void;
    setValue(value: any): Promise<boolean>;
    hydrate(value: any): void;
    startValidation(value: any): Promise<boolean>;
    stopValidation(errors: string[]): void;
  }

  export interface FieldCache {
    [key: string]: Field;
  }

  export class Form {
    fields: Field[];
    constructor(fields: Field[]);
    readonly valid: boolean;
    init(): void;
    addFields(...fields: Field[]): void;
  }

  export class SimpleForm extends Form {
    constructor(model: Object, fields?: Field[]);
  }
}
