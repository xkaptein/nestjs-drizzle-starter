import { HTTP_STATUS_MESSAGE } from '@/common/const/http-status';
import { TResponseData } from '@/common/types/response-data.type';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ResponseDataHelper {
  private _status: number = HttpStatus.OK;
  private _statusMessage: string = HTTP_STATUS_MESSAGE[HttpStatus.OK];
  private _data: any = null;
  private _message: string = '';
  private _errorMessage: any = undefined;
  constructor() {}

  status(code: number) {
    this._status = code;
    this._statusMessage = HTTP_STATUS_MESSAGE[code];
    return this;
  }
  body(data?: any) {
    this._data = data;
    return this;
  }
  message(message: any) {
    this._message = message;
    return this;
  }
  errorMessage(message: any) {
    this._errorMessage = message;
    return this;
  }
  toJson(): TResponseData {
    return {
      statusCode: this._status,
      message: this._message,
      statusMessage: this._statusMessage,
      data: this._data,
      errorMessage: this._errorMessage,
    };
  }
}
