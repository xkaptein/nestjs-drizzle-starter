import { Injectable } from '@nestjs/common';
import vine, { ValidationError } from '@vinejs/vine';
import { SchemaTypes } from '@vinejs/vine/types';
type ErrorMessage = {
  field: string;
  message: string;
};
@Injectable()
export class ValidationHelper {
  private _schema: SchemaTypes = vine.object({});
  private _body: any;
  schema(schema: SchemaTypes) {
    this._schema = schema;
    return this;
  }
  body<T>(body: T) {
    this._body = body;
    return this;
  }

  async validate<T>() {
    try {
      const output = await vine.validate({
        data: this._body,
        schema: this._schema,
      });
      return { data: output as T, success: true, errorMessages: null };
    } catch (error) {
      let errorMessages: any;
      if (error instanceof ValidationError) {
        const errorValidationMessages = error.messages as ErrorMessage[];
        errorMessages = errorValidationMessages.map((e: ErrorMessage) => ({
          field: e.field,
          message: e.message,
        }));
        return { data: undefined, success: false, errorMessages };
      }
      throw error;
    }
  }
}
