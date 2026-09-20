import { TResponseData } from '@/common/types/response-data.type';
import { ResponseDataHelper } from '@/shared/helper/response-data.helper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly response: ResponseDataHelper) {}
  getHello(): TResponseData {
    const result = this.response.message('OK').toJson();
    return result;
  }
}
