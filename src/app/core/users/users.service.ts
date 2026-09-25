import { Injectable } from '@nestjs/common';
import { DataUser, UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UsersRepository) {}

  async findAll() {
    const result = await this.userRepo.findAll();
    return result;
  }

  async store(body: DataUser) {
    const result = await this.userRepo.store(body);
    return result;
  }
}
