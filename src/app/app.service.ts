import { TResponseData } from '@/common/types/response-data.type';
import { ResponseDataService } from '@/shared/service/response-data.service';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './core/users/users.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly response: ResponseDataService,
    private readonly userRepo: UsersRepository,
  ) {}
  getHello(): TResponseData {
    try {
      return this.response.ok();
    } catch (error) {
      return this.response.internalServerError(error);
    }
  }
}
