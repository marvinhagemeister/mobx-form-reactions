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
    setValue(value: any): Promise<boolean>;
    hydrate(value: any): void;
    private startValidation(value);
  }

  export class Form {
    fields: Field[];
    constructor(fields: Field[]);
    readonly valid: boolean;
    addFields(...fields: Field[]): void;
  }
}
