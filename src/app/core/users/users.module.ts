import { DatabaseModule } from '@/database/database.module';
import { EnvironmentService } from '@/shared/service/environment.service';
import { ServiceModule } from '@/shared/service/service.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [ServiceModule, DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, EnvironmentService, ConfigService, UsersRepository],
})
export class UsersModule {}
