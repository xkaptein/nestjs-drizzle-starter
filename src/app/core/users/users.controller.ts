import { Body, Controller, Get, Post } from '@nestjs/common';
import { type DataUser } from './users.repository';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async findAll() {
    const result = await this.service.findAll();
    return result;
  }

  @Post()
  async store(@Body() body: DataUser) {
    const result = await this.service.store(body);
    return result;
  }
}
