import { TResponseData } from '@/common/types';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseDataHelper } from '../helper/response-data.helper';
import { DebugLoggerService } from './debug-logger.service';
import { EnvironmentService } from './environment.service';

@Injectable()
export class ResponseDataService {
  constructor(
    private readonly response: ResponseDataHelper,
    private readonly env: EnvironmentService,
    private readonly debug: DebugLoggerService,
  ) {}

  ok(data = null, message = 'Success'): TResponseData {
    return this.response
      .status(HttpStatus.OK)
      .message(message)
      .body(data)
      .toJson();
  }
  created(data: any, message: any) {
    return this.response
      .status(HttpStatus.CREATED)
      .message(message)
      .body(data)
      .toJson();
  }
  badRequest({
    message = 'Invalid Input',
    errorMessage,
  }: {
    message: string;
    errorMessage?: any;
  }): TResponseData {
    return this.response
      .status(HttpStatus.BAD_REQUEST)
      .message(message)
      .errorMessage(errorMessage)
      .toJson();
  }
  notFound(message: string = 'Sorry, data not found.'): TResponseData {
    return this.response.status(HttpStatus.NOT_FOUND).message(message).toJson();
  }
  unauthorized(message: string = 'Unauthorized'): TResponseData {
    return this.response
      .status(HttpStatus.UNAUTHORIZED)
      .message(message)
      .toJson();
  }
  unprocessableEntity({
    message = 'We could not process your request.',
    errorMessage,
  }: {
    message: string;
    errorMessage?: any;
  }): TResponseData {
    return this.response
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .message(message)
      .errorMessage(errorMessage)
      .toJson();
  }
  forbidden(message: string = 'Access forbidden'): TResponseData {
    return this.response.status(HttpStatus.FORBIDDEN).message(message).toJson();
  }
  conflict(message: string = 'Data already exist.'): TResponseData {
    return this.response.status(HttpStatus.CONFLICT).message(message).toJson();
  }
  tooManyRequest(
    message: string = 'Too may request. Try again later.',
  ): TResponseData {
    return this.response
      .status(HttpStatus.TOO_MANY_REQUESTS)
      .message(message)
      .toJson();
  }
  internalServerError(error: any): TResponseData {
    this.debug.log(error);
    const res = this.response.status(HttpStatus.INTERNAL_SERVER_ERROR);
    const isDev = this.env.get('NODE_ENV') === 'development';
    if (!isDev) {
      return res
        .message('Sorry, an error occurred. Please try again later.')
        .toJson();
    }
    //eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const message = error ? error?.message : 'Unknown error';
    return this.response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .message(message)
      .toJson();
  }
}
